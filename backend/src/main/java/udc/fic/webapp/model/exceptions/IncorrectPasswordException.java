package udc.fic.webapp.model.exceptions;

@SuppressWarnings("serial")
public class IncorrectPasswordException extends InstanceException {

 public IncorrectPasswordException(String name, Object key) {
        super(name, key);
    }


}
