package udc.fic.webapp.model.exceptions;

@SuppressWarnings("serial")
public class PermissionException extends Exception {
    public PermissionException(String message) {
        super(message);
    }
}