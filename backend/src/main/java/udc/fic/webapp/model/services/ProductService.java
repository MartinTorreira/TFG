package udc.fic.webapp.model.services;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import udc.fic.webapp.model.entities.Category;
import udc.fic.webapp.model.entities.Product;
import udc.fic.webapp.model.exceptions.InstanceNotFoundException;
import udc.fic.webapp.rest.dto.ProductDto;

import java.util.List;

@Service
public interface ProductService {

    Product addProduct(Long userId, Long categoryId, String name, String description, double price, int quantity, List<String> images)
            throws InstanceNotFoundException;

    Page<Product> getLatestProducts(int page, int size);

    List<Category> getCategories();


}
