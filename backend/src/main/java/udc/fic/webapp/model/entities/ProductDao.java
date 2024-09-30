package udc.fic.webapp.model.entities;

import org.springframework.data.repository.PagingAndSortingRepository;
import udc.fic.webapp.rest.dto.ProductDto;

import java.util.Optional;

public interface ProductDao extends PagingAndSortingRepository<Product, Long> {

    Product findProductById(Long id);

}
