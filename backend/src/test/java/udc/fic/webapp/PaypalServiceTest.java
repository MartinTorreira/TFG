package udc.fic.webapp;

import com.paypal.core.PayPalHttpClient;
import com.paypal.http.Headers;
import com.paypal.http.HttpResponse;
import com.paypal.http.exceptions.HttpException;
import com.paypal.orders.OrdersCaptureRequest;
import com.paypal.orders.OrdersCreateRequest;
import com.paypal.payments.CapturesRefundRequest;
import com.paypal.payments.Refund;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import udc.fic.webapp.model.services.PaypalService;
import com.paypal.orders.Order;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class PaypalServiceTest {

    private static final String ORDER_ID = "ORDER_ID";
    private static final String CAPTURED_ORDER_ID = "CAPTURED_ORDER_ID";
    private static final String REFUND_ID = "REFUND_ID";


    @Mock
    private PayPalHttpClient payPalClient;

    @InjectMocks
    private PaypalService paypalService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCreateOrder() throws IOException {
        Double amount = 10.0;
        String currency = "USD";
        String description = "Test Order";
        String cancelUrl = "http://example.com/cancel";
        String successUrl = "http://example.com/success";

        Order mockOrder = new Order();
        mockOrder.id(ORDER_ID);

        HttpResponse<Order> mockResponse = mock(HttpResponse.class);
        when(mockResponse.result()).thenReturn(mockOrder);

        when(payPalClient.execute(any(OrdersCreateRequest.class))).thenReturn(mockResponse);

        Order order = paypalService.createOrder(amount, currency, description, cancelUrl, successUrl);
        assertNotNull(order);
        assertNotNull(order.id());
    }

    @Test
    public void testCreateOrderThrowsHttpException() throws IOException {
        Double amount = 10.0;
        String currency = "USD";
        String description = "Test Order";
        String cancelUrl = "http://example.com/cancel";
        String successUrl = "http://example.com/success";

        when(payPalClient.execute(any(OrdersCreateRequest.class))).thenThrow(new HttpException("Error creating order", 500, new Headers()));

        assertThrows(IOException.class, () -> paypalService.createOrder(amount, currency, description, cancelUrl, successUrl));
    }


    @Test
    public void testCaptureOrder() throws IOException {
        Order mockOrder = new Order();
        mockOrder.id(CAPTURED_ORDER_ID);

        HttpResponse<Order> mockResponse = mock(HttpResponse.class);
        when(mockResponse.result()).thenReturn(mockOrder);

        when(payPalClient.execute(any(OrdersCaptureRequest.class))).thenReturn(mockResponse);

        Order capturedOrder = paypalService.captureOrder(ORDER_ID);
        assertNotNull(capturedOrder);
        assertNotNull(capturedOrder.id());
    }

    @Test
    public void testCaptureOrderThrowsHttpException() throws IOException {
        when(payPalClient.execute(any(OrdersCaptureRequest.class))).thenThrow(new HttpException("Error capturing order", 500, new Headers()));
        assertThrows(IOException.class, () -> paypalService.captureOrder(ORDER_ID));
    }


    @Test
    public void testRefundOrder() throws IOException {

        Double amount = 10.0;
        String currency = "USD";

        Refund mockRefund = new Refund();
        mockRefund.id(REFUND_ID);

        HttpResponse<Refund> mockResponse = mock(HttpResponse.class);
        when(mockResponse.result()).thenReturn(mockRefund);

        when(payPalClient.execute(any(CapturesRefundRequest.class))).thenReturn(mockResponse);

        Refund refund = paypalService.refundOrder(CAPTURED_ORDER_ID, amount, currency);
        assertNotNull(refund);
        assertNotNull(refund.id());
    }


    @Test
    public void testRefundOrderThrowsHttpException() throws IOException {
        Double amount = 10.0;
        String currency = "USD";

        when(payPalClient.execute(any(CapturesRefundRequest.class))).thenThrow(new HttpException("Error refunding order", 500, new Headers()));

        assertThrows(IOException.class, () -> paypalService.refundOrder(CAPTURED_ORDER_ID, amount, currency));
    }


}

