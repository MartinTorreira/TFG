package udc.fic.webapp.model.exceptions;

@SuppressWarnings("serial")
public class DuplicateEmailException extends InstanceException {

    public DuplicateEmailException(String name, Object key) {
        super(name, key);
    }

}