package udc.fic.webapp.model.entities;

import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryDao extends PagingAndSortingRepository<Category, Long> {

    boolean existsByName(String name);

    Optional<Category> findByName(String name);

    List<Category> findAll();

    Optional<Category> findById(Long id);

}
