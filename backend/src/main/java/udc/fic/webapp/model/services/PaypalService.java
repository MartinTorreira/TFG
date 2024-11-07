package udc.fic.webapp.model.services;

import com.paypal.payments.Money;
import com.paypal.payments.Refund;
import com.paypal.payments.CapturesRefundRequest;
import com.paypal.payments.RefundRequest;
import com.paypal.core.PayPalHttpClient;
import com.paypal.http.HttpResponse;
import com.paypal.http.exceptions.HttpException;
import com.paypal.orders.*;
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


    public Refund refundOrder(String captureId, Double amount, String currency) throws IOException {
        RefundRequest refundRequest = new RefundRequest();
        refundRequest.amount(new Money().currencyCode(currency).value(String.format(Locale.US, "%.2f", amount)));

        CapturesRefundRequest request = new CapturesRefundRequest(captureId);
        request.requestBody(refundRequest);

        try {
            HttpResponse<Refund> response = payPalClient.execute(request);
            return response.result();
        } catch (HttpException e) {
            throw new IOException("Error refunding order: " + e.getMessage(), e);
        }
    }


}