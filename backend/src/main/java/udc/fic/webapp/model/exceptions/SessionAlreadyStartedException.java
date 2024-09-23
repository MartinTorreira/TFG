package udc.fic.webapp.model.exceptions;

public class SessionAlreadyStartedException extends Exception{
    public SessionAlreadyStartedException(String cause) {
        super(cause);

    }
}