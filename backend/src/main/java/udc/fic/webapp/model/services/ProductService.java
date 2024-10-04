package udc.fic.webapp.model.services;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import udc.fic.webapp.model.entities.Category;
import udc.fic.webapp.model.entities.Product;
import udc.fic.webapp.model.exceptions.InstanceNotFoundException;

import java.util.List;

@Service
public interface ProductService {

    Product addProduct(Long userId, Long categoryId, String name, String description, double price, int quantity, String quality, List<String> images)
            throws InstanceNotFoundException;

    Product updateProduct(Long userId, Long productId, Long categoryId, String name, String description, double price, int quantity, String quality, List<String> images)
            throws InstanceNotFoundException;

    void deleteProduct(Long userId, Long productId) throws InstanceNotFoundException;

    Page<Product> getLatestProducts(int page, int size);

    List<Category> getCategories();

    Product findProductById(Long id) throws InstanceNotFoundException;

    Page<Product> getProductsByUserId(Long userId, int page, int size) throws InstanceNotFoundException;

    void changeProductImages(Long userId, Long productId, List<String> images) throws InstanceNotFoundException;

}
