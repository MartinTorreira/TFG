package udc.fic.webapp.model.entities;

import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;

public interface RatingDao extends PagingAndSortingRepository<Rating, Long> {

    List<Rating> findByUserId(Long userId);

}
