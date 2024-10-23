package udc.fic.webapp.model.entities;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Optional;

public interface NotificationDao extends PagingAndSortingRepository<Notification, Long> {

    Page<Notification> findByUserId(Long userId, Pageable pageable);

}
