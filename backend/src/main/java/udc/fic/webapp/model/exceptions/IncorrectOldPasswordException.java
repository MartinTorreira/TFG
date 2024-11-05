package udc.fic.webapp.model.exceptions;

@SuppressWarnings("serial")
public class IncorrectOldPasswordException extends InstanceException {
    public IncorrectOldPasswordException(String name, Object key) {
        super(name, key);
    }
}
