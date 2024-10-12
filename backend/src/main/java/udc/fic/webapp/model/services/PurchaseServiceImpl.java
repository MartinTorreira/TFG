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

import java.io.IOException;
import java.util.Date;
import java.util.List;
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

        User buyer = userDao.findById(buyerId)
                .orElseThrow(() -> new InstanceNotFoundException("project.entities.user", buyerId));

        User seller = userDao.findById(sellerId)
                .orElseThrow(() -> new InstanceNotFoundException("project.entities.user", sellerId));

        Purchase purchase = new Purchase();
        purchase.setBuyer(buyer);
        purchase.setSeller(seller);
        purchase.setAmount(amount);
        purchase.setPurchaseDate(new Date());

        // Generate a unique orderId if not provided
        if (orderId == null || orderId.isEmpty()) {
            orderId = UUID.randomUUID().toString();
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
    public Long getPurchaseIdFromOrderId(String orderId) throws InstanceNotFoundException {
        Purchase purchase = purchaseDao.findByOrderId(orderId)
                .orElseThrow(() -> new InstanceNotFoundException("project.entities.purchase", orderId));
        return purchase.getId();
    }

    @Override
    public void completePurchase(Long purchaseId) throws InstanceNotFoundException {
        Purchase purchase = purchaseDao.findById(purchaseId)
                .orElseThrow(() -> new InstanceNotFoundException("project.entities.purchase", purchaseId));
       // purchase.setCompleted(true);
        purchaseDao.save(purchase);
    }
}