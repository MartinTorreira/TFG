package udc.fic.webapp.model.entities;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatMessageDao extends PagingAndSortingRepository<ChatMessage, Long> {

    @Query("SELECT cm FROM ChatMessage cm WHERE (cm.sender.id = :userId1 AND cm.receiver.id = :userId2) OR (cm.sender.id = :userId2 AND cm.receiver.id = :userId1) ORDER BY cm.timestamp ASC")
    List<ChatMessage> findMessagesBetweenUsers(@Param("userId1") Long userId1, @Param("userId2") Long userId2);

    @Query("SELECT DISTINCT CASE WHEN cm.sender.id = :userId THEN cm.receiver.id ELSE cm.sender.id END FROM ChatMessage cm WHERE cm.sender.id = :userId OR cm.receiver.id = :userId")
    List<Long> findChatParticipantsByUserId(@Param("userId") Long userId);

    @Query("SELECT cm FROM ChatMessage cm WHERE (cm.sender.id = :userId) OR (cm.receiver.id = :userId) ORDER BY cm.timestamp ASC")
    List<ChatMessage> findMessagesByUserId(@Param("userId") Long userId);

}