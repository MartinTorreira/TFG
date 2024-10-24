package udc.fic.webapp.model.entities;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NotificationDao extends PagingAndSortingRepository<Notification, Long> {

    @Query("SELECT n FROM Notification n WHERE n.purchase.seller.id = :userId")
    Page<Notification> findByUserId(@Param("userId") Long userId, Pageable pageable);

    List<Notification> findByPurchaseId(Long purchaseId);

}
