package udc.fic.webapp.rest.controllers;

import com.paypal.api.payments.*;
import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.PayPalRESTException;
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

import java.util.*;

@RestController
@RequestMapping("/purchase")
public class PurchaseController {

    private static final Logger logger = LoggerFactory.getLogger(PurchaseController.class);

    @Autowired
    private PurchaseService purchaseService;

    @Autowired
    private APIContext apiContext;

    @Autowired
    private PaypalService paypalService;

    @PostMapping("/create")
    public ResponseEntity<Map<String, String>> createPurchase(@RequestBody PurchaseDto dto) throws InstanceNotFoundException {

        String cancelUrl = "http://localhost:8080/payment/cancel";
        String successUrl = "http://localhost:8080/payment/success";

        Purchase purchase = purchaseService.createPurchase(
                dto.getBuyerId(),
                dto.getSellerId(),
                dto.getProductIds(),
                dto.getQuantities(),
                dto.getAmount(),
                dto.getPaymentMethod()
        );

        try {

            // Crear el pago utilizando el servicio de PayPal
            Payment payment = paypalService.createPayment(
                    Double.valueOf(dto.getAmount()),
                    dto.getCurrency(),
                    dto.getPaymentMethod(),
                    "sale",
                    "Descripcion",
                    cancelUrl,
                    successUrl
            );

            // Retornar el ID de la orden a la respuesta
            String approvalUrl = "";
            for (Links links : payment.getLinks()) {
                if (links.getRel().equals("approval_url")) {
                    approvalUrl = links.getHref();
                    break;
                }
            }

            // Retornar tanto el ID de pago como la URL de aprobación
            Map<String, String> response = new HashMap<>();
            response.put("paymentId", payment.getId());
            response.put("approvalUrl", approvalUrl);
            return ResponseEntity.ok(response);
        } catch (PayPalRESTException e) {
            logger.error("Error occurred:: ", e);
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                Map.of("error", "Error creating payment")
        );
    }

    private String createPaypalPayment(PurchaseDto dto) throws PayPalRESTException {
        Amount amount = new Amount();
        amount.setCurrency(dto.getCurrency().replaceAll("%0A", ""));
        amount.setTotal(String.format(Locale.US, "%.2f", dto.getAmount()));

        Transaction transaction = new Transaction();
        transaction.setDescription(dto.getPaymentMethod().replaceAll("%0A", ""));
        transaction.setAmount(amount);

        List<Transaction> transactions = new ArrayList<>();
        transactions.add(transaction);

        Payer payer = new Payer();
        payer.setPaymentMethod(dto.getPaymentMethod().replaceAll("%0A", ""));

        Payment payment = new Payment();
        payment.setIntent("sale");
        payment.setPayer(payer);
        payment.setTransactions(transactions);

        RedirectUrls redirectUrls = new RedirectUrls();
        redirectUrls.setCancelUrl("http://localhost:8080/payment/cancel");
        redirectUrls.setReturnUrl("http://localhost:8080/payment/execute");
        payment.setRedirectUrls(redirectUrls);

        logger.info("Creating PayPal payment with details: {}", payment);

        Payment createdPayment = payment.create(apiContext);

        logger.info("Created PayPal payment: {}", createdPayment);

        return createdPayment.getLinks().stream()
                .filter(link -> link.getRel().equals("approval_url"))
                .findFirst()
                .map(Links::getHref)
                .orElseThrow(() -> new RuntimeException("Approval URL not found"));
    }
}