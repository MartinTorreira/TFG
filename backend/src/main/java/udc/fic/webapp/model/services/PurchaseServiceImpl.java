package udc.fic.webapp.model.services;

import com.paypal.orders.Order;
import com.paypal.orders.OrderRequest;
import com.paypal.orders.OrdersCaptureRequest;
import com.paypal.core.PayPalHttpClient;
import com.paypal.http.HttpResponse;
import com.paypal.http.exceptions.HttpException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import udc.fic.webapp.model.entities.*;
import udc.fic.webapp.model.exceptions.InstanceNotFoundException;
import udc.fic.webapp.rest.dto.PurchaseConversor;
import udc.fic.webapp.rest.dto.PurchaseDto;
import udc.fic.webapp.rest.dto.PurchaseItemDto;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PurchaseServiceImpl implements PurchaseService {

    @Autowired
    private PurchaseDao purchaseDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private ProductDao productDao;

    @Autowired
    private PurchaseItemDao purchaseItemDao;

    @Autowired
    private PayPalHttpClient payPalClient;

    @Autowired
    private NotificationService notificationService;

    @Override
    public Purchase createPurchase(PurchaseDto dto) throws InstanceNotFoundException {
        User buyer = userDao.findById(dto.getBuyerId())
                .orElseThrow(() -> new InstanceNotFoundException("project.entities.user", dto.getBuyerId()));

        User seller = userDao.findById(dto.getSellerId())
                .orElseThrow(() -> new InstanceNotFoundException("project.entities.user", dto.getSellerId()));

        Purchase purchase = new Purchase();
        purchase.setBuyer(buyer);
        purchase.setSeller(seller);
        purchase.setAmount(dto.getAmount());
        purchase.setPurchaseDate(new Date());

        if (dto.getOrderId() == null || dto.getOrderId().isEmpty()) {
            throw new IllegalArgumentException("orderId must be provided by PayPal");
        }
        purchase.setOrderId(dto.getOrderId());
        purchase.setIsRefunded(false);

        if (dto.getPurchaseStatus() == null || dto.getPurchaseStatus().isEmpty()) {
            throw new IllegalArgumentException("status must be provided");
        }
        purchase.setPurchaseStatus(Purchase.PurchaseStatus.valueOf(dto.getPurchaseStatus()));

        Purchase.PaymentMethod paymentMethodValue;
        try {
            paymentMethodValue = Purchase.PaymentMethod.valueOf(dto.getPaymentMethod().toUpperCase());
            purchase.setPaymentMethod(paymentMethodValue);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid payment method: " + dto.getPaymentMethod());
        }

        purchase = purchaseDao.save(purchase);

        for (PurchaseItemDto itemDto : dto.getPurchaseItems()) {
            Product product = productDao.findById(itemDto.getProductId())
                    .orElseThrow(() -> new InstanceNotFoundException("project.entities.product", itemDto.getProductId()));

            PurchaseItem purchaseItem = new PurchaseItem();
            purchaseItem.setPurchase(purchase);
            purchaseItem.setProduct(product);
            purchaseItem.setQuantity(itemDto.getQuantity());

            purchaseItemDao.save(purchaseItem);
            notifySeller(purchase);
        }

        return purchase;
    }

    @Override
    public Order executePayment(String orderId) throws IOException {
        OrdersCaptureRequest request = new OrdersCaptureRequest(orderId);
        request.requestBody(new OrderRequest());

        try {
            HttpResponse<Order> response = payPalClient.execute(request);
            return response.result();
        } catch (HttpException e) {
            throw new IOException("Error capturing order: " + e.getMessage(), e);
        }
    }

    @Override
    public void completePurchase(Long purchaseId) throws InstanceNotFoundException {
        Purchase purchase = purchaseDao.findById(purchaseId)
                .orElseThrow(() -> new InstanceNotFoundException("project.entities.purchase", purchaseId));
        // purchase.setCompleted(true);
        purchaseDao.save(purchase);
    }


    @Override
    public Long getPurchaseIdFromOrderId(String orderId) throws InstanceNotFoundException {
        Purchase purchase = purchaseDao.findByOrderId(orderId)
                .orElseThrow(() -> new InstanceNotFoundException("project.entities.purchase", orderId));

        return purchase.getId();
    }


    @Override
    public Product getProductByOrderId(String orderId) throws InstanceNotFoundException {
        Purchase purchase = purchaseDao.findByOrderId(orderId)
                .orElseThrow(() -> new InstanceNotFoundException("project.entities.purchase", orderId));

        List<PurchaseItem> purchaseItems = purchaseItemDao.findByPurchaseId(purchase.getId());
        if (!purchaseItems.isEmpty()) {
            return purchaseItems.get(0).getProduct();
        } else {
            throw new InstanceNotFoundException("project.entities.product", orderId);
        }
    }

    @Override
    public PurchaseDto getPurchaseByProductId(Long productId) throws InstanceNotFoundException {
                // Recursive function to notify the seller with all purchase items
    PurchaseItem purchaseItem = purchaseItemDao.findByProductId(productId)
                    .orElseThrow(() -> new InstanceNotFoundException("project.entities.purchase", productId));

        Purchase purchase = purchaseItem.getPurchase();
        PurchaseDto purchaseDto = new PurchaseDto();
        purchaseDto.setId(purchase.getId());
        purchaseDto.setBuyerId(purchase.getBuyer().getId());
        purchaseDto.setSellerId(purchase.getSeller().getId());
        purchaseDto.setAmount(purchase.getAmount());
        purchaseDto.setPurchaseDate(purchase.getPurchaseDate());
        purchaseDto.setOrderId(purchase.getOrderId());
        purchaseDto.setPaymentMethod(purchase.getPaymentMethod().toString());
        purchaseDto.setCaptureId(purchase.getCaptureId());
        purchaseDto.setPurchaseStatus(purchase.getPurchaseStatus().toString());

        return purchaseDto;
    }

    @Override
    public PurchaseDto changePurchaseStatus(Long purchaseId, PurchaseDto purchaseDto) throws InstanceNotFoundException {
        Purchase purchase = purchaseDao.findById(purchaseId)
                .orElseThrow(() -> new InstanceNotFoundException("project.entities.purchase", purchaseId));

        purchase.setPurchaseStatus(Purchase.PurchaseStatus.valueOf(purchaseDto.getPurchaseStatus()));
        purchaseDao.save(purchase);

        String message = "El estado de tu compra con ID de pedido #" + purchase.getOrderId() + " ha sido actualizado a " + purchase.getPurchaseStatus();
        notificationService.createNotification(purchase.getId(), message);

        return PurchaseConversor.toDto(purchase);
    }

    @Override
    public Page<Purchase> getPurchasesByUserId(Long userId, int page, int size) throws InstanceNotFoundException {

        User user = userDao.findById(userId)
                .orElseThrow(() -> new InstanceNotFoundException("project.entities.user", userId));

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        return purchaseDao.findByBuyerId(userId, pageRequest);

    }

    @Override
    public PurchaseDto getPurchaseById(Long purchaseId) throws InstanceNotFoundException {
        Purchase purchase = purchaseDao.findById(purchaseId)
                .orElseThrow(() -> new InstanceNotFoundException("project.entities.purchase", purchaseId));

        return PurchaseConversor.toDto(purchase);
    }


    @Override
    public void completePurchase(Long purchaseId, String captureId) throws InstanceNotFoundException {
        Purchase purchase = purchaseDao.findById(purchaseId)
                .orElseThrow(() -> new InstanceNotFoundException("Purchase not found", purchaseId));
        purchase.setCaptureId(captureId);
        purchaseDao.save(purchase);
    }

    @Override
    public Purchase getPurchaseByCaptureId(String captureId) throws InstanceNotFoundException {
        Optional<Purchase> purchaseOpt = purchaseDao.findByCaptureId(captureId);
        if (purchaseOpt.isEmpty()) {
            throw new InstanceNotFoundException("Purchase not found for captureId: " ,captureId);
        }
        return purchaseOpt.get();
    }


    public List<PurchaseItem> getPurchaseItems(List<Product> products) {
        return products.stream().map(product -> {
            PurchaseItem purchaseItem = new PurchaseItem();
            purchaseItem.setProduct(product);
            purchaseItem.setQuantity(1);
            return purchaseItem;
        }).toList();
    }



    @Override
    public Page<Purchase> getSalesByUserId(Long userId, int page, int size) throws InstanceNotFoundException {
        User user = userDao.findById(userId)
                .orElseThrow(() -> new InstanceNotFoundException("project.entities.user", userId));

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        // Cambia a findBySellerId para obtener las compras donde el usuario es el vendedor
        return purchaseDao.findBySellerId(userId, pageRequest);
    }


    @Override
    public void deletePurchase(Long purchaseId) throws InstanceNotFoundException {
        Purchase purchase = purchaseDao.findById(purchaseId)
                .orElseThrow(() -> new InstanceNotFoundException("project.entities.purchase", purchaseId));

        // Borrar todas las notificaciones asociadas
        List<Notification> notifications = notificationService.getNotificationsByPurchaseId(purchaseId);
        for (Notification notification : notifications) {
            notificationService.deleteNotification(notification.getId());
        }

        purchaseDao.delete(purchase);
    }


    // NOTIFICATIONS ==========================================================

    @Override
    public void notifySeller(Purchase purchase) throws InstanceNotFoundException {
        User user = userDao.findById(purchase.getBuyer().getId())
                .orElseThrow(() -> new InstanceNotFoundException("project.entities.user", purchase.getBuyer().getId()));

        List<PurchaseItem> purchaseItems = purchaseItemDao.findByPurchaseId(purchase.getId());
        if (purchaseItems.isEmpty()) {
            throw new InstanceNotFoundException("project.entities.purchaseItem", purchase.getId());
        }

        for (PurchaseItem purchaseItem : purchaseItems) {
            Product product = purchaseItem.getProduct();
            int quantity = purchaseItem.getQuantity();

            String formattedAmount = String.format("%.2f €", purchase.getAmount());

            String message = "El usuario " + user.getUserName()
                    + " ha realizado una compra de x" + quantity + " " + (quantity == 1 ? "unidad del producto " : "unidades del producto ")
                    + product.getName() + " por un total de " + formattedAmount;

            notificationService.createNotification(purchase.getId(), message);
        }
    }

}