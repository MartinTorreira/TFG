package udc.fic.webapp.model.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import udc.fic.webapp.model.entities.*;
import udc.fic.webapp.model.exceptions.InstanceNotFoundException;

import java.util.List;


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


        Product product = new Product(name, description, price, quantity, images, user, category);

        return productDao.save(product);

    }


}
