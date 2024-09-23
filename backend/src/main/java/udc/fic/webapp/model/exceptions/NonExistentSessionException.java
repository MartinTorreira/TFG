package udc.fic.webapp.model.exceptions;

public class NonExistentSessionException extends Exception{
    public NonExistentSessionException(String message){
        super(message);
    }
}