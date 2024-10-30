package udc.fic.webapp.rest.dto;

import udc.fic.webapp.model.entities.Offer;
import udc.fic.webapp.model.entities.OfferItem;
import udc.fic.webapp.model.entities.Product;

public class OfferItemConversor {


    public static OfferItemDto toDto(OfferItem offerItem) {
            if (offerItem == null) {
                return null;
            }

            OfferItemDto dto = new OfferItemDto();
            dto.setId(offerItem.getId());
            dto.setProductId(offerItem.getProduct().getId());
            dto.setQuantity(offerItem.getQuantity());

            return dto;
    }

    public static OfferItem toEntity(OfferItemDto offerItemDto, Offer offer, Product product) {
        OfferItem offerItem = new OfferItem();
        offerItem.setId(offerItemDto.getId());
        offerItem.setOffer(offer);
        offerItem.setProduct(product);
        offerItem.setQuantity(offerItemDto.getQuantity());
        return offerItem;
    }
}