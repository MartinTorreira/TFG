package udc.fic.webapp.model.services;

import com.paypal.orders.Order;
import com.paypal.orders.OrderRequest;
import com.paypal.orders.OrdersCaptureRequest;
import com.paypal.core.PayPalHttpClient;
import com.paypal.http.HttpResponse;
import com.paypal.http.exceptions.HttpException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import udc.fic.webapp.model.entities.*;
import udc.fic.webapp.model.exceptions.InstanceNotFoundException;
import udc.fic.webapp.rest.dto.PurchaseDto;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

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

    @Override
    public Purchase createPurchase(Long buyerId, Long sellerId, List<Long> productIds, List<Integer> quantities, Double amount, String paymentMethod, String orderId) throws InstanceNotFoundException {
        System.out.println("Received createPurchase request with orderId: " + orderId);

        User buyer = userDao.findById(buyerId)
                .orElseThrow(() -> new InstanceNotFoundException("project.entities.user", buyerId));

        User seller = userDao.findById(sellerId)
                .orElseThrow(() -> new InstanceNotFoundException("project.entities.user", sellerId));

        Purchase purchase = new Purchase();
        purchase.setBuyer(buyer);
        purchase.setSeller(seller);
        purchase.setAmount(amount);
        purchase.setPurchaseDate(new Date());

        // Use the orderId provided by PayPal
        if (orderId == null || orderId.isEmpty()) {
            throw new IllegalArgumentException("orderId must be provided by PayPal");
        }
        purchase.setOrderId(orderId);

        Purchase.PaymentMethod paymentMethodValue;
        try {
            paymentMethodValue = Purchase.PaymentMethod.valueOf(paymentMethod.toUpperCase());
            purchase.setPaymentMethod(paymentMethodValue);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid payment method: " + paymentMethod);
        }

        purchase = purchaseDao.save(purchase);

        for (int i = 0; i < productIds.size(); i++) {
            Long productId = productIds.get(i);
            Integer quantity = quantities.get(i);

            Product product = productDao.findById(productId)
                    .orElseThrow(() -> new InstanceNotFoundException("project.entities.product", productId));

            PurchaseItem purchaseItem = new PurchaseItem();
            purchaseItem.setPurchase(purchase);
            purchaseItem.setProduct(product);
            purchaseItem.setQuantity(quantity);

            purchaseItemDao.save(purchaseItem);
        }

        System.out.println("Purchase created with orderId: " + purchase.getOrderId());
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

        Optional<PurchaseItem> purchaseItem = purchaseItemDao.findByPurchaseId(purchase.getId());
        if (purchaseItem.isPresent()) {
            return purchaseItem.get().getProduct();
        } else {
            throw new InstanceNotFoundException("project.entities.product", orderId);
        }
    }

    @Override
    public PurchaseDto getPurchaseByProductId(Long productId) throws InstanceNotFoundException {
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

        return purchaseDto;
    }


}