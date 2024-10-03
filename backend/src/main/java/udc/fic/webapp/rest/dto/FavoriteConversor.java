package udc.fic.webapp.rest.dto;

import udc.fic.webapp.model.entities.Favorite;

public class FavoriteConversor {

    private FavoriteConversor() {}

    public final static FavoriteDto toDto(Favorite favorite) {
        return new FavoriteDto(favorite.getId(), UserConversor.toUserDto(favorite.getUser()), ProductConversor.toDto(favorite.getProduct()), favorite.getFavoritedAt());
    }

    public final static Favorite toEntity(FavoriteDto favoriteDto) {
        return new Favorite(UserConversor.toUser(favoriteDto.getUserDto()), ProductConversor.toEntity(favoriteDto.getProductDto()), favoriteDto.getFavoritedAt());
    }


}
