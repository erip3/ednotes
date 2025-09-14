package wiki.ednotes.server.category;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import wiki.ednotes.server.category.dto.CategoryWithChildrenResponse;

import java.util.List;
import java.util.Optional;

/**
 * Controller for managing categories.
 */
@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    private final CategoryRepository categoryRepository; // Category repository for database operations

    /**
     * Constructor for CategoryController.
     * 
     * @param categoryRepository the category repository
     */
    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    /**
     * Get all categories.
     * 
     * @return a list of categories
     */
    @GetMapping
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    /**
     * Get a category by its ID.
     * 
     * @param id the ID of the category
     * @return the category, if found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Integer id) {
        return categoryRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get all child categories of a specific category.
     * 
     * @param id the ID of the parent category
     * @return a list of child categories
     */
    @GetMapping("/{id}/children")
    public List<Category> getChildCategories(@PathVariable Integer id) {
        return categoryRepository.findByParentIdOrderByOrderInParentAsc(id);
    }

    /**
     * Get the parent category of a specific category.
     * 
     * @param id the ID of the category
     * @return the parent category, if found
     */
    @GetMapping("/{id}/parent")
    public ResponseEntity<Optional<Category>> getParentCategory(@PathVariable Integer id) {
        return categoryRepository.findById(id)
                .map(category -> categoryRepository.findById(category.getParentId()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get all top-level categories.
     * 
     * @return a list of top-level categories
     */
    @GetMapping("/top-level")
    public List<Category> getTopLevelCategories(@RequestParam(defaultValue = "true") boolean includeComingSoon) {
        if (includeComingSoon) {
            return categoryRepository.findByParentIdOrderByOrderInParentAsc(null);
        }
        return categoryRepository.findByParentIdAndComingSoonIsFalseOrderByOrderInParentAsc(null);
    }

    /**
     * Create a new category.
     * 
     * @param category the category to create
     * @return the created category
     */
    @PostMapping
    public Category createCategory(@RequestBody Category category) {
        return categoryRepository.save(category);
    }

    /**
     * Update an existing category.
     * 
     * @param id       the ID of the category to update
     * @param category the updated category data
     * @return the updated category, if found
     */
    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Integer id, @RequestBody Category category) {
        if (!categoryRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        category.setId(id);
        return ResponseEntity.ok(categoryRepository.save(category));
    }

    /**
     * Delete a category by its ID.
     * 
     * @param id the ID of the category to delete
     * @return a response indicating the result of the deletion
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Integer id) {
        if (!categoryRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        categoryRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get a category and its children in a single response.
     * 
     * @param id the ID of the parent category
     * @return the parent category and its children
     */
    @GetMapping("/{id}/with-children")
    public ResponseEntity<CategoryWithChildrenResponse> getCategoryWithChildren(@PathVariable Integer id) {
        return categoryRepository.findById(id)
                .map(parent -> {
                    List<Category> children = categoryRepository.findByParentIdOrderByOrderInParentAsc(id);
                    return ResponseEntity.ok(new CategoryWithChildrenResponse(parent, children));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
