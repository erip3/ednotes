package wiki.ednotes.server.article;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * Controller for managing articles.
 */
@RestController
@RequestMapping("/api/articles")
public class ArticleController {
    private final ArticleRepository articleRepository; // Article repository for CRUD operations

    /**
     * Constructor for ArticleController.
     * @param articleRepository Article repository for CRUD operations
     */
    public ArticleController(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    /**
     * Get all articles.
     * @return a list of all articles
     */
    @GetMapping
    public List<Article> getAllArticles() {
        return articleRepository.findAll();
    }

    /**
     * Get an article by it's ID.
     * @param id the ID of the article
     * @return the article with the specified ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Article> getArticleById(@PathVariable Integer id) {
        return articleRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get articles by category ID.
     * @param categoryId the ID of the category
     * @return a list of articles in the specified category
     */
    @GetMapping("/category/{categoryId}")
    public List<Article> getArticlesByCategoryId(@PathVariable Integer categoryId) {
        return articleRepository.findByCategoryIdOrderByOrderInCategoryAsc(categoryId);
    }

    /**
     * Create a new article.
     * @param article the article to create
     * @return the created article
     */
    @PostMapping
    public Article createArticle(@RequestBody Article article) {
        return articleRepository.save(article);
    }

    /**
     * Update an existing article.
     * @param id the ID of the article to update
     * @param article the updated article
     * @return the updated article
     */
    @PutMapping("/{id}")
    public ResponseEntity<Article> updateArticle(@PathVariable Integer id, @RequestBody Article article) {
        if (!articleRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        article.setId(id);
        return ResponseEntity.ok(articleRepository.save(article));
    }

    /**
     * Delete an article by its ID.
     * @param id the ID of the article to delete
     * @return a response indicating the result of the deletion
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArticle(@PathVariable Integer id) {
        if (!articleRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        articleRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
