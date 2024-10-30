package udc.fic.webapp.rest.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import udc.fic.webapp.model.entities.*;
import udc.fic.webapp.model.exceptions.InstanceNotFoundException;
import udc.fic.webapp.model.services.OfferService;
import udc.fic.webapp.model.services.ProductService;
import udc.fic.webapp.rest.dto.OfferConversor;
import udc.fic.webapp.rest.dto.OfferDto;
import udc.fic.webapp.rest.dto.ProductDto;

import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/offer")
public class OfferController {

    @Autowired
    private OfferService offerService;

    @Autowired
    private UserDao userDao;

    @Autowired
    private OfferDao offerDao;

    @Autowired
    private ProductService productService;

    @PostMapping("/create")
    public ResponseEntity<OfferDto> createOffer(@RequestParam Long sellerId, @RequestBody OfferDto offerDto) throws InstanceNotFoundException {
        User seller = userDao.findById(sellerId)
                .orElseThrow(() -> new InstanceNotFoundException("User not found", sellerId));

        User buyer = userDao.findById(offerDto.getBuyerId())
                .orElseThrow(() -> new InstanceNotFoundException("User not found", offerDto.getBuyerId()));

        if (sellerId.equals(offerDto.getBuyerId())){
            throw new IllegalArgumentException("A user cannot create an offer to himself");
        }

        List<Product> products = offerDto.getItems().stream()
                .map(item -> {
                    try {
                        return productService.findProductById(item.getProductId());
                    } catch (InstanceNotFoundException e) {
                        throw new RuntimeException("Product not found", e);
                    }
                })
                .collect(Collectors.toList());

        // Check if the seller is the owner of the product
        if (!products.get(0).getUser().getId().equals(sellerId)){
            throw new IllegalArgumentException("The seller is not the owner of the product");
        }

        Offer offer = offerService.createOffer(OfferConversor.toEntity(offerDto, buyer, seller, products));
        OfferDto responseDto = OfferConversor.toDto(offer);
        return ResponseEntity.ok(responseDto);
    }

    @GetMapping("/{offerId}/get")
    public ResponseEntity<OfferDto> getOfferById(@PathVariable Long offerId) throws InstanceNotFoundException {
        Offer offer = offerService.getOffer(offerId);
        OfferDto responseDto = OfferConversor.toDto(offer);
        return ResponseEntity.ok(responseDto);
    }

    @PutMapping("/{id}/update")
    public ResponseEntity<OfferDto> updateOffer(@RequestParam Long userId, @PathVariable Long id, @RequestBody OfferDto offerDto) throws InstanceNotFoundException {
        User buyer = userDao.findById(userId)
                .orElseThrow(() -> new InstanceNotFoundException("User not found", userId));

        User seller = userDao.findById(offerDto.getSellerId())
                .orElseThrow(() -> new InstanceNotFoundException("User not found", offerDto.getSellerId()));

        List<Product> products = offerDto.getItems().stream()
                .map(item -> {
                    try {
                        return productService.findProductById(item.getProductId());
                    } catch (InstanceNotFoundException e) {
                        throw new RuntimeException("Product not found", e);
                    }
                })
                .collect(Collectors.toList());

        Offer offer = offerService.updateOffer(id, OfferConversor.toEntity(offerDto, buyer, seller, products));
        OfferDto responseDto = OfferConversor.toDto(offer);
        return ResponseEntity.ok(responseDto);
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<Void> deleteOffer(@RequestParam Long userId, @PathVariable Long id) throws InstanceNotFoundException {
        offerService.deleteOffer(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<OfferDto>> getAllOffers() {
        List<Offer> offers = offerService.getAllOffers();
        List<OfferDto> offerDtos = offers.stream()
                .map(OfferConversor::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(offerDtos);
    }

    @GetMapping("/buyer/{buyerId}")
    public ResponseEntity<List<OfferDto>> getOffersByBuyer(@PathVariable Long buyerId) {
        List<Offer> offers = offerService.getOffersByBuyerId(buyerId);
        List<OfferDto> offerDtos = offers.stream()
                .map(OfferConversor::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(offerDtos);
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<OfferDto>> getOffersBySeller(@PathVariable Long sellerId) {
        List<Offer> offers = offerService.getOffersBySellerId(sellerId);
        List<OfferDto> offerDtos = offers.stream()
                .map(OfferConversor::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(offerDtos);
    }
}