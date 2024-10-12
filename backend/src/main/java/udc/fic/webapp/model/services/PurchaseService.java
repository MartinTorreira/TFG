package udc.fic.webapp.model.services;

import com.paypal.orders.Order;
import org.springframework.stereotype.Service;
import udc.fic.webapp.model.entities.Purchase;
import udc.fic.webapp.model.exceptions.InstanceNotFoundException;

import java.io.IOException;
import java.util.List;

@Service
public interface PurchaseService {

    Purchase createPurchase(Long buyerId, Long sellerId, List<Long> productIds, List<Integer> quantities, Double amount, String paymentMethod, String orderId) throws InstanceNotFoundException;

    Order executePayment(String orderId) throws IOException;

    Long getPurchaseIdFromOrderId(String orderId) throws InstanceNotFoundException;

    void completePurchase(Long purchaseId) throws InstanceNotFoundException;
}