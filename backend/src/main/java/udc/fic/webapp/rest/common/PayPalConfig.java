package udc.fic.webapp.rest.common;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.paypal.core.PayPalEnvironment;
import com.paypal.core.PayPalHttpClient;

@Configuration
public class PayPalConfig {

    @Bean
    public PayPalHttpClient payPalClient() {
        // Replace with your actual client ID and secret
        String clientId = "AfAuDL8Y-RaJ90kX1mAJfQy2mGGefCc1ovLwoVE74NKZCEmie7xnfiwP6om2MnAwAm0YhB6_zTfJSfWa";
        String clientSecret = "EMS3jRmLXBkyqhrlHmvv0bGulNtMRDFzV11FDuPaKJAqapuuQmfEfHmWkHN4mM-3XlV2kRjcNvltc2_2";

        PayPalEnvironment environment = new PayPalEnvironment.Sandbox(clientId, clientSecret);
        return new PayPalHttpClient(environment);
    }
}