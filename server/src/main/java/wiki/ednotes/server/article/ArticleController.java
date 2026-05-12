package wiki.ednotes.server.article;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import wiki.ednotes.server.navigation.NavigationService;
import wiki.ednotes.server.navigation.dto.ArticleContent;

/**
 * Controller for reading articles (reader API).
 */
@RestController
@RequestMapping("/api/articles")
public class ArticleController {
    private final NavigationService navigationService;

    /**
     * Constructor for ArticleController.
     * @param navigationService the navigation service
     */
    public ArticleController(NavigationService navigationService) {
        this.navigationService = navigationService;
    }

    /**
     * Get an article with its breadcrumbs and background references.
     * @param id the ID of the article
     * @return ArticleContent containing article, breadcrumbs, and background articles
     */
    @GetMapping("/{id}")
    public ResponseEntity<ArticleContent> getArticleById(@PathVariable Long id) {
        return navigationService.getArticleContent(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
