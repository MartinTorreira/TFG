package udc.fic.webapp.model.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import udc.fic.webapp.model.entities.*;
import udc.fic.webapp.model.exceptions.InstanceNotFoundException;

import java.time.LocalDateTime;

@Service
@Transactional
public class FavoriteServiceImpl implements FavoriteService {

    @Autowired
    private UserDao userDao;

    @Autowired
    private ProductDao productDao;

    @Autowired
    private FavoriteDao favoriteDao;


    @Override
    public Favorite addFavorite(Long userId, Long productId, LocalDateTime favoritedAt) throws InstanceNotFoundException {
        User user = userDao.findById(userId)
                .orElseThrow(() -> new InstanceNotFoundException("User", userId));

        Product product = productDao.findById(productId)
                .orElseThrow(() -> new InstanceNotFoundException("Product", productId));

        // Check if the user has already favorited the product
        if (favoriteDao.findByUserIdAndProductId(userId, productId).isPresent()) {
            throw new IllegalArgumentException("User has already added the product to favorites");
        }

        // Check if the product is from the user
        if (product.getUser().getId() == userId) {
            throw new IllegalArgumentException("User cannot add to favorites their own product");
        }

        Favorite favorite = new Favorite(user, product, favoritedAt);
        return favoriteDao.save(favorite);
    }


    @Override
    public Page<Favorite> getLatestFavorites(int page, int size) {
        return favoriteDao.findAll(PageRequest.of(page, size, Sort.by(Sort.Order.desc("favoritedAt"))));
    }

    @Override
    public Favorite findFavoriteById(Long id) throws InstanceNotFoundException {
        return favoriteDao.findById(id).orElseThrow(() -> new InstanceNotFoundException("Favorite", id));
    }


    @Override
    public Page<Favorite> getFavoritesByUserId(Long userId, int page, int size) throws InstanceNotFoundException{
        User user = userDao.findById(userId)
                .orElseThrow(() -> new InstanceNotFoundException("User", userId));

        return favoriteDao.findByUserId(userId, PageRequest.of(page, size, Sort.by(Sort.Order.desc("favoritedAt"))));
    }


    @Override
    public void removeFavorite(Long userId, Long productId) throws InstanceNotFoundException {
        Favorite favorite = favoriteDao.findByUserIdAndProductId(userId, productId)
                .orElseThrow(() -> new InstanceNotFoundException("Favorite", userId));

        favoriteDao.delete(favorite);
    }



}
