package udc.fic.webapp.model.services;

import udc.fic.webapp.model.exceptions.InstanceNotFoundException;
import udc.fic.webapp.model.entities.User;

public interface PermissionChecker {

    void checkUserExists(Long userId) throws InstanceNotFoundException;

    User checkUser(Long userId) throws InstanceNotFoundException;
}


