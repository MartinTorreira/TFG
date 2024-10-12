package udc.fic.webapp.rest.controllers;

import com.paypal.orders.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import udc.fic.webapp.model.entities.Purchase;
import udc.fic.webapp.model.exceptions.InstanceNotFoundException;
import udc.fic.webapp.model.services.PaypalService;
import udc.fic.webapp.model.services.PurchaseService;
import udc.fic.webapp.rest.dto.PurchaseDto;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/purchase")
public class PurchaseController {

    private static final Logger logger = LoggerFactory.getLogger(PurchaseController.class);

    @Autowired
    private PurchaseService purchaseService;

    @Autowired
    private PaypalService paypalService;

    @PostMapping("/create")
    public ResponseEntity<Map<String, String>> createPurchase(@RequestBody PurchaseDto dto) throws InstanceNotFoundException {
        String cancelUrl = "http://localhost:8080/purchase/cancel";
        String successUrl = "http://localhost:8080/purchase/success?orderId=" + dto.getOrderId();

        Purchase purchase = purchaseService.createPurchase(
                dto.getBuyerId(),
                dto.getSellerId(),
                dto.getProductIds(),
                dto.getQuantities(),
                dto.getAmount(),
                dto.getPaymentMethod(),
                dto.getOrderId()
        );

        try {
            Order order = paypalService.createOrder(
                    dto.getAmount(),
                    dto.getCurrency(),
                    "Descripcion",
                    cancelUrl,
                    successUrl
            );

            String approvalUrl = order.links().stream()
                    .filter(link -> "approve".equals(link.rel()))
                    .findFirst()
                    .map(link -> link.href())
                    .orElse("");

            Map<String, String> response = new HashMap<>();
            response.put("orderId", order.id());
            response.put("approvalUrl", approvalUrl);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            logger.error("Error occurred:: ", e);
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                Map.of("error", "Error creating order")
        );
    }

    @PostMapping("/execute")
    public ResponseEntity<String> executePayment(@RequestParam("orderId") String orderId) {
        try {
            Order order = paypalService.captureOrder(orderId);
            if ("COMPLETED".equals(order.status())) {
                Long purchaseId = purchaseService.getPurchaseIdFromOrderId(orderId);
                purchaseService.completePurchase(purchaseId);
                return ResponseEntity.ok("Payment successful");
            }
        } catch (IOException | InstanceNotFoundException e) {
            logger.error("Error occurred:: ", e);
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Payment execution failed");
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
}