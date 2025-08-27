package wiki.ednotes.server.category;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/**
 * Repository interface for managing categories.
 */
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByParentIdOrderByOrderInParentAsc(Long parentId);
    List<Category> findByParentIdAndComingSoonIsFalseOrderByOrderInParentAsc(Long parentId);
}
