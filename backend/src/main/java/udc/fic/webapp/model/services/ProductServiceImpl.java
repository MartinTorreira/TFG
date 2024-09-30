package udc.fic.webapp.model.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import udc.fic.webapp.model.entities.*;
import udc.fic.webapp.model.exceptions.InstanceNotFoundException;
import udc.fic.webapp.rest.dto.ProductConversor;
import udc.fic.webapp.rest.dto.ProductDto;


import java.util.List;
import java.util.stream.Collectors;


@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    @Autowired
    private UserDao userDao;

    @Autowired
    private CategoryDao categoryDao;

    @Autowired
    private ProductDao productDao;

    @Override
    public Product addProduct(Long userId, Long categoryId, String name, String description, double price, int quantity, List<String> images)
            throws InstanceNotFoundException {

        User user = userDao.findById(userId)
                .orElseThrow(() -> new InstanceNotFoundException("project.entities.user", userId));

        Category category = categoryDao.findById(categoryId)
                .orElseThrow(() -> new InstanceNotFoundException("project.entities.category", categoryId));

        // Comprobar si la categoría tiene subcategorías
        if (categoryDao.existsByParentCategoryId(categoryId)) {
            throw new IllegalArgumentException("project.entities.category.hasSubcategories");
        }


        // Crear el producto sin imágenes
        Product product = new Product(name, description, price, quantity, null, user, category);
        product = productDao.save(product);

        // Convertir lista de imágenes en una lista de objetos Product_Images
        Product finalProduct = product;
        List<Product_Images> productImages = images.stream()
                .map(image -> new Product_Images(finalProduct, image))
                .collect(Collectors.toList());

        // Asignar las imágenes al producto y guardar de nuevo
        product.setImage(productImages);
        return productDao.save(product);
    }

    @Override
    public Page<Product> getLatestProducts(int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        return productDao.findAll(pageRequest);
    }

    @Override
    public List<Category> getCategories() {
        return categoryDao.findAll();
    }

    @Override
    public Product findProductById(Long id) throws InstanceNotFoundException {
        Product product = productDao.findById(id)
                .orElseThrow(() -> new InstanceNotFoundException("project.entities.product", id));
        return product;
    }


}
