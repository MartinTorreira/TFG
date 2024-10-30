package udc.fic.webapp.rest.dto;

import udc.fic.webapp.model.entities.Offer;
import udc.fic.webapp.model.entities.Product;
import udc.fic.webapp.model.entities.User;

import java.util.List;
import java.util.stream.Collectors;

public class OfferConversor {

    public static OfferDto toDto(Offer offer) {
        if (offer == null) {
            return null;
        }

        OfferDto dto = new OfferDto();
        dto.setId(offer.getId());
        dto.setAmount(offer.getAmount());
        dto.setBuyerId(offer.getBuyer().getId());
        dto.setSellerId(offer.getSeller().getId());
        dto.setItems(offer.getItems().stream()
                .map(OfferItemConversor::toDto)
                .collect(Collectors.toList()));

        return dto;
    }

    public static Offer toEntity(OfferDto offerDto, User buyer, User seller, List<Product> products) {
        Offer offer = new Offer();
        offer.setId(offerDto.getId());
        offer.setBuyer(buyer);
        offer.setSeller(seller);
        offer.setAmount(offerDto.getAmount());
        offer.setItems(offerDto.getItems().stream()
                .map(offerItemDto -> {
                    Product product = products.stream()
                            .filter(p -> Long.valueOf(p.getId()).equals(offerItemDto.getProductId()))
                            .findFirst()
                            .orElseThrow(() -> new IllegalArgumentException("Product not found"));
                    return OfferItemConversor.toEntity(offerItemDto, offer, product);
                })
                .collect(Collectors.toList()));
        return offer;
    }
}