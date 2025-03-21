package udc.fic.webapp.model.services;

import com.paypal.orders.Order;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import udc.fic.webapp.model.entities.Product;
import udc.fic.webapp.model.entities.Purchase;
import udc.fic.webapp.model.entities.PurchaseItem;
import udc.fic.webapp.model.exceptions.InstanceNotFoundException;
import udc.fic.webapp.rest.dto.PurchaseDto;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public interface PurchaseService {

    Purchase createPurchase(PurchaseDto dto) throws InstanceNotFoundException;

    Order executePayment(String orderId) throws IOException;

    PurchaseDto changePurchaseStatus(Long purchaseId, PurchaseDto purchaseDto) throws InstanceNotFoundException;

    Long getPurchaseIdFromOrderId(String orderId) throws InstanceNotFoundException;

    void completePurchase(Long purchaseId) throws InstanceNotFoundException;

    Product getProductByOrderId(String orderId) throws InstanceNotFoundException;

    PurchaseDto getPurchaseByProductId(Long productId) throws InstanceNotFoundException;

    Page<Purchase> getPurchasesByUserId(Long userId, int page, int size) throws InstanceNotFoundException;

    PurchaseDto getPurchaseById(Long purchaseId) throws InstanceNotFoundException;

    void completePurchase(Long purchaseId, String orderId) throws InstanceNotFoundException;

    Purchase getPurchaseByCaptureId(String captureId) throws InstanceNotFoundException;

    Page<Purchase> getSalesByUserId(Long userId, int page, int size) throws InstanceNotFoundException;

    void notifySeller(Purchase purchase) throws InstanceNotFoundException;

    void deletePurchase(Long purchaseId) throws InstanceNotFoundException;

    Long getSellerIdByPurchaseId(Long purchaseId) throws InstanceNotFoundException;

    List<PurchaseItem> getPurchaseItems(List<Product> products);

    }