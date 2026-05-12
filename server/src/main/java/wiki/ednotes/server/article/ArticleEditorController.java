package wiki.ednotes.server.article;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Controller for managing articles (editor API).
 */
@RestController
@RequestMapping("/api/editor/articles")
public class ArticleEditorController {
    private final ArticleService articleService;

    /**
     * Constructor for ArticleEditorController.
     * @param articleService Article service for business logic
     */
    public ArticleEditorController(ArticleService articleService) {
        this.articleService = articleService;
    }

    /**
     * Get an article by its ID (includes unpublished articles).
     * @param id the ID of the article
     * @return the article with the specified ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Article> getArticleById(@PathVariable Long id) {
        return articleService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create a new article.
     * @param article the article to create
     * @return the created article
     */
    @PostMapping
    public ResponseEntity<Article> createArticle(@RequestBody Article article) {
        Article createdArticle = articleService.create(article);
        return ResponseEntity.ok(createdArticle);
    }

    /**
     * Update an existing article.
     * @param id the ID of the article to update
     * @param article the updated article
     * @return the updated article
     */
    @PutMapping("/{id}")
    public ResponseEntity<Article> updateArticle(@PathVariable Long id, @RequestBody Article article) {
        return articleService.update(id, article)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Delete an article by its ID.
     * @param id the ID of the article to delete
     * @return a response indicating the result of the deletion
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArticle(@PathVariable Long id) {
        if (articleService.delete(id)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
