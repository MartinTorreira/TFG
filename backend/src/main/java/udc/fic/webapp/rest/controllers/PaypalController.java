package udc.fic.webapp.rest.controllers;

import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import udc.fic.webapp.model.services.PaypalService;
import udc.fic.webapp.rest.dto.PaypalDto;

import java.util.HashMap;
import java.util.Map;

@Controller
@RequiredArgsConstructor
@Slf4j
public class PaypalController {

    private final PaypalService paypalService;

    @PostMapping("/payment/create")
    public ResponseEntity<Map<String, String>> createPayment(@RequestBody PaypalDto paypalDto) {
        try {
            String cancelUrl = "http://localhost:8080/payment/cancel";
            String successUrl = "http://localhost:8080/payment/success";

            // Crear el pago utilizando el servicio de PayPal
            Payment payment = paypalService.createPayment(
                    Double.valueOf(paypalDto.getAmount()),
                    paypalDto.getCurrency(),
                    paypalDto.getMethod(),
                    "sale",
                    paypalDto.getDescription(),
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
            log.error("Error occurred:: ", e);
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                Map.of("error", "Error creating payment")
        );
    }

    @PostMapping("/payment/execute")
    public ResponseEntity<String> executePayment(@RequestParam("paymentId") String paymentId, @RequestParam("PayerID") String payerId) {
        try {
            Payment payment = paypalService.executePayment(paymentId, payerId);
            if (payment.getState().equals("approved")) {
                return ResponseEntity.ok("Payment successful");
            }
        } catch (PayPalRESTException e) {
            log.error("Error occurred:: ", e);
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Payment execution failed");
    }


    @GetMapping("/payment/success")
    public String paymentSuccess(
        @RequestParam("paymentId") String paymentId,
        @RequestParam("PayerID") String payerId
    ) {
        try {
            Payment payment = paypalService.executePayment(paymentId, payerId);
            if (payment.getState().equals("approved")) {
                return "paymentSuccess";
            }
        } catch (PayPalRESTException e) {
            log.error("Error occurred:: ", e);
        }
        return "paymentSuccess";
    }

    @GetMapping("/payment/cancel")
    public String paymentCancel() {
        return "paymentCancel";
    }

    @GetMapping("/payment/error")
    public String paymentError() {
        return "paymentError";
    }
}
