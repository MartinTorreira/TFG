package udc.fic.webapp.model.exceptions;

@SuppressWarnings("serial")
public abstract class InstanceException extends Exception {

    private String name;
    private Object key;

    public InstanceException(String name, Object key) {

        this.name = name;
        this.key = key;

    }

    public String getName() {
        return name;
    }

    public Object getKey() {
        return key;
    }

}