package udc.fic.webapp.model.entities;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

public interface ProductDao extends PagingAndSortingRepository<Product, Long> {

    Product findProductById(Long id);

    @Query("SELECT p FROM Product p WHERE p.user.id = :userId")
    Page<Product> findByUserId(@Param("userId") Long userId, Pageable pageable);
}
