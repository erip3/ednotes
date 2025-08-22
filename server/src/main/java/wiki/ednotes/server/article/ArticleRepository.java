package wiki.ednotes.server.article;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ArticleRepository extends JpaRepository<Article, Long> {
   List<Article> findByIsPublished(Boolean isPublished);
   List<Article> findByCategoryId(Long categoryId);
}