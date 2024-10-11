package udc.fic.webapp.rest.dto;

public class PaypalDto {

    private String method;
    private String amount;
    private String currency;
    private String description;

    public PaypalDto() {
    }

    public PaypalDto(String method, String amount, String currency, String description) {
        this.method = method;
        this.amount = amount;
        this.currency = currency;
        this.description = description;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public String getAmount() {
        return amount;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

}
