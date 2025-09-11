package wiki.ednotes.server.article;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ArticleRepository extends JpaRepository<Article, Integer> {
   List<Article> findByIsPublishedOrderByOrderInCategoryAsc(Boolean isPublished);
   List<Article> findByCategoryIdOrderByOrderInCategoryAsc(Integer categoryId);
}