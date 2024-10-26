package udc.fic.webapp.model.entities;

import org.springframework.data.repository.PagingAndSortingRepository;

public interface ChatMessageDao extends PagingAndSortingRepository<ChatMessage, Long> {

}