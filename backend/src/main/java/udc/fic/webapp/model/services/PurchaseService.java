package udc.fic.webapp.model.services;

import com.paypal.orders.Order;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import udc.fic.webapp.model.entities.Product;
import udc.fic.webapp.model.entities.Purchase;
import udc.fic.webapp.model.exceptions.InstanceNotFoundException;
import udc.fic.webapp.rest.dto.PurchaseDto;

import java.io.IOException;
import java.util.List;

@Service
public interface PurchaseService {

    Purchase createPurchase(Long buyerId, Long sellerId, List<Long> productIds, List<Integer> quantities, Double amount, String paymentMethod, String orderId) throws InstanceNotFoundException;

    Order executePayment(String orderId) throws IOException;

    Long getPurchaseIdFromOrderId(String orderId) throws InstanceNotFoundException;

    void completePurchase(Long purchaseId) throws InstanceNotFoundException;

    Product getProductByOrderId(String orderId) throws InstanceNotFoundException;

    PurchaseDto getPurchaseByProductId(Long productId) throws InstanceNotFoundException;

    Page<Purchase> getPurchasesByUserId(Long userId, int page, int size) throws InstanceNotFoundException;

    PurchaseDto getPurchaseById(Long purchaseId) throws InstanceNotFoundException;

    void completePurchase(Long purchaseId, String orderId) throws InstanceNotFoundException;

    Purchase getPurchaseByCaptureId(String captureId) throws InstanceNotFoundException;
}