package udc.fic.webapp.model.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import udc.fic.webapp.model.entities.*;
import udc.fic.webapp.model.exceptions.InstanceNotFoundException;

import java.util.Date;
import java.util.List;

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

    @Override
    public Purchase createPurchase(Long buyerId, Long sellerId, List<Long> productIds, List<Integer> quantities, Double amount, String paymentMethod) throws InstanceNotFoundException {

        User buyer = userDao.findById(buyerId)
                .orElseThrow(() -> new InstanceNotFoundException("project.entities.user", buyerId));

        User seller = userDao.findById(sellerId)
                .orElseThrow(() -> new InstanceNotFoundException("project.entities.user", sellerId));

        Purchase purchase = new Purchase();
        purchase.setBuyer(buyer);
        purchase.setSeller(seller);
        purchase.setAmount(amount);
        purchase.setPurchaseDate(new Date());


        Purchase.PaymentMethod paymentMethodValue;
        try {
            paymentMethodValue = Purchase.PaymentMethod.valueOf(paymentMethod.toUpperCase());
            purchase.setPaymentMethod(paymentMethodValue);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Método de pago no válido: " + paymentMethod);
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

    public List<Purchase> getAllPurchases() {
        return purchaseDao.findAll();
    }
}