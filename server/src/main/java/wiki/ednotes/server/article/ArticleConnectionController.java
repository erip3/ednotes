package wiki.ednotes.server.article;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller for managing article connections (editor API).
 */
@RestController
@RequestMapping("/api/editor/connections")
public class ArticleConnectionController {
    private final ArticleConnectionRepository connectionRepository;

    /**
     * Constructor for ArticleConnectionController.
     * @param connectionRepository the article connection repository
     */
    public ArticleConnectionController(ArticleConnectionRepository connectionRepository) {
        this.connectionRepository = connectionRepository;
    }

    /**
     * Create a new article connection.
     * @param connection the article connection to create
     * @return the created connection
     */
    @PostMapping
    public ResponseEntity<ArticleConnection> createConnection(@RequestBody ArticleConnection connection) {
        ArticleConnection created = connectionRepository.save(connection);
        return ResponseEntity.ok(created);
    }

    /**
     * Delete an article connection.
     * @param sourceId the source article ID
     * @param targetId the target article ID
     * @return a response indicating the result of the deletion
     */
    @DeleteMapping
    public ResponseEntity<Void> deleteConnection(
            @RequestParam Long sourceId,
            @RequestParam Long targetId) {
        ArticleConnectionId id = new ArticleConnectionId();
        id.setSourceId(sourceId);
        id.setTargetId(targetId);
        
        if (connectionRepository.existsById(id)) {
            connectionRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
