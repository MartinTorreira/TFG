package udc.fic.webapp.model.services;

import com.paypal.api.payments.*;
import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.PayPalRESTException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class PaypalService {

    private final APIContext apiContext;

    public Payment createPayment(
            Double total,
            String currency,
            String method,
            String intent,
            String description,
            String cancelUrl,
            String successUrl
    ) throws PayPalRESTException {
        Amount amount = new Amount();
        amount.setCurrency(currency.replaceAll("%0A", ""));
        amount.setTotal(String.format(Locale.forLanguageTag(currency.replaceAll("%0A", "")), "%.2f", total));

        Transaction transaction = new Transaction();
        transaction.setDescription(description.replaceAll("%0A", ""));
        transaction.setAmount(amount);

        List<Transaction> transactions = new ArrayList<>();
        transactions.add(transaction);

        Payer payer = new Payer();
        payer.setPaymentMethod(method.replaceAll("%0A", ""));


        Payment payment = new Payment();
        payment.setIntent(intent.replaceAll("%0A", ""));
        payment.setPayer(payer);
        payment.setTransactions(transactions);

        RedirectUrls redirectUrls = new RedirectUrls();
        redirectUrls.setCancelUrl(cancelUrl.replaceAll("%0A", ""));
        redirectUrls.setReturnUrl(successUrl.replaceAll("%0A", ""));

        payment.setRedirectUrls(redirectUrls);

        return payment.create(apiContext);
    }

    public Payment executePayment(String paymentId, String payerId) throws PayPalRESTException {
        Payment payment = new Payment();
        payment.setId(paymentId.replaceAll("%0A", ""));

        PaymentExecution paymentExecution = new PaymentExecution();
        paymentExecution.setPayerId(payerId.replaceAll("%0A", ""));

        return payment.execute(apiContext, paymentExecution);
    }
}
