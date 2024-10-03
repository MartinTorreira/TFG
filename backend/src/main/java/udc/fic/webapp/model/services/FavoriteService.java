package udc.fic.webapp.model.services;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import udc.fic.webapp.model.entities.Category;
import udc.fic.webapp.model.entities.Favorite;
import udc.fic.webapp.model.entities.Product;
import udc.fic.webapp.model.exceptions.InstanceNotFoundException;
import udc.fic.webapp.rest.dto.ProductDto;

import java.time.LocalDateTime;
import java.util.List;

@Service
public interface FavoriteService {

    Favorite addFavorite(Long userId, Long productId, LocalDateTime favoritedAt) throws InstanceNotFoundException;

    Page<Favorite> getLatestFavorites(int page, int size);

    Page<Favorite> getFavoritesByUserId(Long userId, int page, int size) throws InstanceNotFoundException;

    Favorite findFavoriteById(Long id) throws InstanceNotFoundException;

    void removeFavorite(Long userId, Long productId) throws InstanceNotFoundException;

}
