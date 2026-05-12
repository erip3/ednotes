package wiki.ednotes.server.navigation;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wiki.ednotes.server.navigation.dto.SidebarNode;
import wiki.ednotes.server.navigation.dto.ArticleSummary;
import wiki.ednotes.server.navigation.dto.CategorySummary;
import wiki.ednotes.server.navigation.dto.FolderContent;
import java.util.List;

/**
 * Controller for navigation-related endpoints (reader APIs).
 */
@RestController
@RequestMapping("/api/navigation")
public class NavigationController {
    private final NavigationService navigationService;

    /**
     * Constructor for NavigationController.
     * @param navigationService the navigation service
     */
    public NavigationController(NavigationService navigationService) {
        this.navigationService = navigationService;
    }

    /**
     * Get root categories with their articles.
     * @return FolderContent containing root categories and articles
     */
    @GetMapping("/roots")
    public ResponseEntity<FolderContent> getRoots() {
        return ResponseEntity.ok(navigationService.getRoots());
    }

    /**
     * Get a category's contents: child categories and articles.
     * @param id the category ID
     * @return FolderContent containing sub-categories and articles
     */
    @GetMapping("/categories/{id}")
    public ResponseEntity<FolderContent> getCategory(@PathVariable Long id) {
        return ResponseEntity.ok(navigationService.getCategoryContent(id));
    }

    /**
     * Get the navigation tree starting from a specific topic.
     * @param topicId the topic category ID
     * @return list of SidebarNode representing the tree structure
     */
    @GetMapping("/tree/{topicId}")
    public ResponseEntity<List<SidebarNode>> getNavigationTree(@PathVariable Long topicId) {
        List<SidebarNode> tree = navigationService.getNavigationTree(topicId);
        return ResponseEntity.ok(tree);
    }

    /**
     * Search for published articles.
     * @return list of published ArticleSummary
     */
    @GetMapping("/search")
    public ResponseEntity<List<ArticleSummary>> search() {
        return ResponseEntity.ok(navigationService.search());
    }

    /**
     * Get the breadcrumb path for a category.
     * @param catId the category ID
     * @return list of CategorySummary from root to the category
     */
    @GetMapping("/path/{catId}")
    public ResponseEntity<List<CategorySummary>> getBreadcrumbs(@PathVariable Long catId) {
        return ResponseEntity.ok(navigationService.getBreadcrumbs(catId));
    }

    /**
     * Get article summaries for a specific category.
     * @param categoryId the category ID
     * @return list of ArticleSummary
     */
    @GetMapping("/article-summaries/{categoryId}")
    public ResponseEntity<List<ArticleSummary>> getArticleSummary(@PathVariable Long categoryId) {
        List<ArticleSummary> articles = navigationService.getArticleSummariesByCategory(categoryId);
        return ResponseEntity.ok(articles);
    }
}