package wiki.ednotes.server.article;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ArticleConnectionRepository extends JpaRepository<ArticleConnection, ArticleConnectionId> {
    List<ArticleConnection> findByIdSourceId(Long sourceId);
    List<ArticleConnection> findByIdTargetId(Long targetId);
}