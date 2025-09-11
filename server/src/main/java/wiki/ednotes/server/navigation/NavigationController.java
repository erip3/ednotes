package wiki.ednotes.server.navigation;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wiki.ednotes.server.navigation.dto.CategoryTreeNode;
import wiki.ednotes.server.navigation.dto.ArticleSummary;
import java.util.List;

@RestController
@RequestMapping("/api/navigation")
public class NavigationController {
    private final NavigationService navigationService;

    public NavigationController(NavigationService navigationService) {
        this.navigationService = navigationService;
    }

    @GetMapping("/tree")
    public ResponseEntity<List<CategoryTreeNode>> getNavigationTree() {
        List<CategoryTreeNode> tree = navigationService.getNavigationTree();
        return ResponseEntity.ok(tree);
    }

    @GetMapping("/article-summaries/{categoryId}")
    public ResponseEntity<List<ArticleSummary>> getArticleSummary(@PathVariable Integer categoryId) {
        List<ArticleSummary> articles = navigationService.getArticleSummariesByCategory(categoryId);
        return ResponseEntity.ok(articles);
    }
}