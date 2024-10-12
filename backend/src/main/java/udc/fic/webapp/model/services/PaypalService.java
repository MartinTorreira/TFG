package udc.fic.webapp.model.services;

import com.paypal.orders.*;
import com.paypal.core.PayPalHttpClient;
import com.paypal.http.HttpResponse;
import com.paypal.http.exceptions.HttpException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class PaypalService {

    @Autowired
    private PayPalHttpClient payPalClient;

    public Order createOrder(Double amount, String currency, String description, String cancelUrl, String successUrl) throws IOException {
        // Format the amount to ensure it uses a dot as the decimal separator
        String formattedAmount = String.format(Locale.US, "%.2f", amount);

        OrderRequest orderRequest = new OrderRequest();
        orderRequest.checkoutPaymentIntent("CAPTURE");

        ApplicationContext applicationContext = new ApplicationContext()
                .cancelUrl(cancelUrl)
                .returnUrl(successUrl);
        orderRequest.applicationContext(applicationContext);

        List<PurchaseUnitRequest> purchaseUnits = new ArrayList<>();
        PurchaseUnitRequest purchaseUnitRequest = new PurchaseUnitRequest()
                .description(description)
                .amountWithBreakdown(new AmountWithBreakdown()
                        .currencyCode(currency)
                        .value(formattedAmount));
        purchaseUnits.add(purchaseUnitRequest);
        orderRequest.purchaseUnits(purchaseUnits);

        OrdersCreateRequest request = new OrdersCreateRequest().requestBody(orderRequest);

        try {
            HttpResponse<Order> response = payPalClient.execute(request);
            return response.result();
        } catch (HttpException e) {
            throw new IOException("Error creating order: " + e.getMessage(), e);
        }
    }


    public Order captureOrder(String orderId) throws IOException {
        OrdersCaptureRequest request = new OrdersCaptureRequest(orderId);
        request.requestBody(new OrderRequest());

        try {
            HttpResponse<Order> response = payPalClient.execute(request);
            return response.result();
        } catch (HttpException e) {
            throw new IOException("Error capturing order: " + e.getMessage(), e);
        }
    }

    private OrderRequest buildRequestBody(Double total, String currency, String description, String cancelUrl, String successUrl) {
        OrderRequest orderRequest = new OrderRequest();
        orderRequest.checkoutPaymentIntent("CAPTURE");

        ApplicationContext applicationContext = new ApplicationContext()
                .cancelUrl(cancelUrl)
                .returnUrl(successUrl);
        orderRequest.applicationContext(applicationContext);

        List<PurchaseUnitRequest> purchaseUnits = new ArrayList<>();
        PurchaseUnitRequest purchaseUnitRequest = new PurchaseUnitRequest()
                .description(description)
                .amountWithBreakdown(new AmountWithBreakdown().currencyCode(currency).value(String.format("%.2f", total)));
        purchaseUnits.add(purchaseUnitRequest);
        orderRequest.purchaseUnits(purchaseUnits);

        return orderRequest;
    }
}