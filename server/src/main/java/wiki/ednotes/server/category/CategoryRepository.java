package wiki.ednotes.server.category;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/**
 * Repository interface for managing categories.
 */
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    List<Category> findByParentIdOrderByOrderAsc(Integer parentId);
    List<Category> findByParentIdAndPublishedIsTrueOrderByOrderAsc(Integer parentId);
}
