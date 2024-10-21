package udc.fic.webapp.rest.controllers;

import com.paypal.orders.Order;
import com.paypal.payments.Refund;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import udc.fic.webapp.model.entities.Purchase;
import udc.fic.webapp.model.entities.PurchaseDao;
import udc.fic.webapp.model.exceptions.InstanceNotFoundException;
import udc.fic.webapp.model.services.PaypalService;
import udc.fic.webapp.model.services.ProductService;
import udc.fic.webapp.model.services.PurchaseService;
import udc.fic.webapp.rest.dto.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/purchase")
public class PurchaseController {

    private static final Logger logger = LoggerFactory.getLogger(PurchaseController.class);

    @Autowired
    private PurchaseService purchaseService;

    @Autowired
    private PaypalService paypalService;

    @Autowired
    private ProductService productService;

    @Autowired
    private PurchaseDao purchaseDao;


    @PostMapping("/create")
    public ResponseEntity<?> createPurchase(@RequestBody PurchaseDto dto) {
        String cancelUrl = "http://localhost:8080/purchase/cancel";
        String successUrl = "http://localhost:8080/purchase/success?orderId=" + dto.getOrderId();

        try {
            // Crear la orden en PayPal
            Order order = paypalService.createOrder(
                    dto.getAmount(),
                    dto.getCurrency(),
                    "Descripcion",
                    cancelUrl,
                    successUrl
            );

            // Obtener el URL de aprobación de PayPal
            String approvalUrl = order.links().stream()
                    .filter(link -> "approve".equals(link.rel()))
                    .findFirst()
                    .map(link -> link.href())
                    .orElse("");

            // Crear la compra en la base de datos
            Purchase purchase = purchaseService.createPurchase(
                    dto.getBuyerId(),
                    dto.getSellerId(),
                    dto.getProductIds(),
                    dto.getQuantities(),
                    dto.getAmount(),
                    dto.getPaymentMethod(),
                    order.id(),
                    dto.getPurchaseStatus()
            );

            // Crear la respuesta
            Map<String, Object> response = new HashMap<>();
            response.put("orderId", order.id());
            response.put("approvalUrl", approvalUrl);
            response.put("purchase", purchase);

            return ResponseEntity.ok(response);
        } catch (IOException e) {
            logger.error("Error occurred:: ", e);
        } catch (InstanceNotFoundException e) {
            throw new RuntimeException(e);
        }

        // En caso de error, devolver una respuesta con error
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                Map.of("error", "Error creating order")
        );
    }


    @PostMapping("/execute")
    public ResponseEntity<Map<String, String>> executePayment(@RequestParam("orderId") String orderId) {
        Map<String, String> response = new HashMap<>();
        try {
            Order order = paypalService.captureOrder(orderId);
            if ("COMPLETED".equals(order.status())) {
                Long purchaseId = purchaseService.getPurchaseIdFromOrderId(orderId);
                String captureId = order.purchaseUnits().get(0).payments().captures().get(0).id();
                purchaseService.completePurchase(purchaseId, captureId); // Pass captureId here
                response.put("message", "Payment successful");
                response.put("captureId", captureId);
                return ResponseEntity.ok(response);
            }
        } catch (IOException | InstanceNotFoundException e) {
            logger.error("Error occurred:: ", e);
        }
        response.put("message", "Payment execution failed");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    @GetMapping("/success")
    public String paymentSuccess(
            @RequestParam("orderId") String orderId
    ) {
        return "paymentSuccess";
    }

    @GetMapping("/cancel")
    public String paymentCancel() {
        return "paymentCancel";
    }



    @GetMapping("/{productId}")
    public ResponseEntity<PurchaseDto> getPurchaseByProductId(@PathVariable Long productId) throws InstanceNotFoundException {
        PurchaseDto purchaseDto = purchaseService.getPurchaseByProductId(productId);
        return ResponseEntity.ok(purchaseDto);
    }

    @GetMapping("/{userId}/getUserPurchases")
    public ResponseEntity<Page<PurchaseDto>> getPurchasesByUserId(@PathVariable Long userId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "9") int size) throws InstanceNotFoundException {

        Page<PurchaseDto> purchases = purchaseService.getPurchasesByUserId(userId, page, size).map(PurchaseConversor::toDto);

        return ResponseEntity.ok(purchases);

    }

    @GetMapping("/{purchaseId}/getProducts")
    public ResponseEntity<List<ProductDto>> getProductsByPurchaseId(@PathVariable Long purchaseId) throws InstanceNotFoundException {
        return ResponseEntity.ok(productService.getProductsByPurchaseId(purchaseId));
    }


    @GetMapping("/{purchaseId}/getPurchase")
    public ResponseEntity<PurchaseDto> getPurchaseById(@PathVariable Long purchaseId) throws InstanceNotFoundException {
        return ResponseEntity.ok(purchaseService.getPurchaseById(purchaseId));
    }

    @PostMapping("/refund")
    public ResponseEntity<?> refundPurchase(@RequestBody RefundRequestDto refundRequest) {
        try {
            // Verify the currency matches the original transaction's currency
            Purchase purchase = purchaseService.getPurchaseByCaptureId(refundRequest.getCaptureId());
            if (purchase == null) {
                logger.error("Purchase not found for captureId: " + refundRequest.getCaptureId());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Purchase not found for captureId: " + refundRequest.getCaptureId()));
            }
            Refund refund = paypalService.refundOrder(refundRequest.getCaptureId(), refundRequest.getAmount(), refundRequest.getCurrency());

            // Verify the refund status
            if ("COMPLETED".equals(refund.status())) {
                return ResponseEntity.ok(Map.of("message", "Refund successful", "refundId", refund.id()));
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Refund failed", "status", refund.status()));
            }
        } catch (InstanceNotFoundException e) {
            logger.error("Purchase not found for captureId: " + refundRequest.getCaptureId(), e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Purchase not found for captureId: " + refundRequest.getCaptureId()));
        } catch (IOException e) {
            logger.error("Error refunding order: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Error refunding order: " + e.getMessage(), "exception", e.toString()));
        }
    }


    @PutMapping("/{purchaseId}/changeRefundStatus")
    public ResponseEntity<PurchaseDto> changeRefundStatus(@PathVariable Long purchaseId, @RequestBody PurchaseDto purchaseDto) throws InstanceNotFoundException {

        Purchase purchase = purchaseDao.findById(purchaseId)
                .orElseThrow(() -> new InstanceNotFoundException("project.entities.purchase", purchaseId));

        purchase.setIsRefunded(purchaseDto.getIsRefunded());

        return ResponseEntity.ok(PurchaseConversor.toDto(purchaseDao.save(purchase)));
    }


    @PutMapping("/{purchaseId}/changePurchaseStatus")
    public ResponseEntity<PurchaseDto> changePurchaseStatus(@PathVariable Long purchaseId, @RequestBody PurchaseDto purchaseDto) throws InstanceNotFoundException {

        Purchase purchase = purchaseDao.findById(purchaseId)
                .orElseThrow(() -> new InstanceNotFoundException("project.entities.purchase", purchaseId));

        purchase.setPurchaseStatus(Purchase.PurchaseStatus.valueOf(purchaseDto.getPurchaseStatus()));

        return ResponseEntity.ok(PurchaseConversor.toDto(purchaseDao.save(purchase)));
    }




}