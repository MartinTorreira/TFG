package udc.fic.webapp.model.entities;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.PagingAndSortingRepository;
import udc.fic.webapp.model.entities.User;

public interface UserDao extends PagingAndSortingRepository<User, Long> {

    boolean existsByUserName(String userName);

    boolean existsByEmail(String email);

    Optional<User> findByUserName(String userName);

    List<User> findAll();

    Optional<User> findById(Long id);

}