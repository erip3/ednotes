package wiki.ednotes.server.navigation;

import org.springframework.stereotype.Service;
import wiki.ednotes.server.category.Category;
import wiki.ednotes.server.category.CategoryRepository;
import wiki.ednotes.server.article.Article;
import wiki.ednotes.server.article.ArticleRepository;
import wiki.ednotes.server.navigation.dto.CategoryTreeNode;
import wiki.ednotes.server.navigation.dto.ArticleSummary;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for managing navigation-related operations.
 */
@Service
public class NavigationService {
    private final CategoryRepository categoryRepository;
    private final ArticleRepository articleRepository;

    /**
     * Constructor for NavigationService.
     */
    public NavigationService(CategoryRepository categoryRepository, ArticleRepository articleRepository) {
        this.categoryRepository = categoryRepository;
        this.articleRepository = articleRepository;
    }

    /**
     * Get the navigation tree structure (all root categories).
     * 
     * @return A list of root categories with their subcategories and articles.
     */
    public List<CategoryTreeNode> getNavigationTree() {
        List<Category> allCategories = categoryRepository.findAll();
        List<Article> allArticles = articleRepository.findAll();

        // Map categoryId -> list of articles
        Map<Integer, List<ArticleSummary>> articlesByCategory = allArticles.stream()
                .collect(Collectors.groupingBy(
                        a -> a.getCategoryId() != null ? a.getCategoryId() : null,
                        Collectors.mapping(
                                a -> new ArticleSummary(a.getId(), a.getTitle(),
                                        a.getPublished() != null
                                                && a.getPublished()),
                                Collectors.toList())));

        // Map parentId -> list of child categories
        Map<Integer, List<Category>> childrenByParent = allCategories.stream()
                .filter(c -> c.getParentId() != null)
                .collect(Collectors.groupingBy(Category::getParentId));

        // Build tree recursively for all root categories
        return allCategories.stream()
                .filter(c -> c.getParentId() == null)
                .map(c -> buildNode(c, childrenByParent, articlesByCategory))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    /**
     * Get the navigation tree structure starting from a specific category.
     * 
     * @param categoryId The root category ID (nullable).
     * @return A list with the specified category as the root, or all root
     *         categories if null.
     */
    public List<CategoryTreeNode> getNavigationTree(Integer categoryId) {
        List<Category> allCategories = categoryRepository.findAll();
        List<Article> allArticles = articleRepository.findAll();

        Map<Integer, List<ArticleSummary>> articlesByCategory = allArticles.stream()
                .collect(Collectors.groupingBy(
                        a -> a.getCategoryId() != null ? a.getCategoryId() : null,
                        Collectors.mapping(
                                a -> new ArticleSummary(a.getId(), a.getTitle(),
                                        a.getPublished() != null
                                                && a.getPublished()),
                                Collectors.toList())));

        Map<Integer, List<Category>> childrenByParent = allCategories.stream()
                .filter(c -> c.getParentId() != null)
                .collect(Collectors.groupingBy(Category::getParentId));

        if (categoryId != null) {
            // Find the category by ID
            Optional<Category> rootOpt = allCategories.stream()
                    .filter(c -> c.getId().equals(categoryId))
                    .findFirst();
            if (rootOpt.isPresent()) {
                CategoryTreeNode node = buildNode(rootOpt.get(), childrenByParent, articlesByCategory);
                return node != null ? List.of(node) : List.of();
            } else {
                return List.of(); // Not found
            }
        } else {
            // Original behavior: all root categories
            return allCategories.stream()
                    .filter(c -> c.getParentId() == null)
                    .map(c -> buildNode(c, childrenByParent, articlesByCategory))
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
        }
    }

    /**
     * Get the article summaries for a specific category.
     * 
     * @param categoryId The category ID.
     * @return List of ArticleSummary.
     */
    public List<ArticleSummary> getArticleSummariesByCategory(Integer categoryId) {
        List<Article> articles = articleRepository.findByCategoryIdOrderByOrderAsc(categoryId);
        return articles.stream()
                .map(a -> new ArticleSummary(a.getId(), a.getTitle(),
                        a.getPublished() != null && a.getPublished()))
                .collect(Collectors.toList());
    }

    /**
     * Build a CategoryTreeNode recursively.
     * 
     * @param cat                The category.
     * @param childrenByParent   Map of parentId to child categories.
     * @param articlesByCategory Map of categoryId to articles.
     * @return CategoryTreeNode or null if not published.
     */
    private CategoryTreeNode buildNode(
            Category cat,
            Map<Integer, List<Category>> childrenByParent,
            Map<Integer, List<ArticleSummary>> articlesByCategory) {
        if (!cat.isPublished()) {
            return null; // Skip "coming soon" categories
        }
        CategoryTreeNode node = new CategoryTreeNode();
        node.setId(cat.getId());
        node.setName(cat.getTitle());
        node.setChildren(
                childrenByParent.getOrDefault(cat.getId(), Collections.emptyList())
                        .stream()
                        .map(child -> buildNode(child, childrenByParent, articlesByCategory))
                        .filter(Objects::nonNull)
                        .collect(Collectors.toList()));
        node.setArticles(articlesByCategory.getOrDefault(cat.getId(), Collections.emptyList()));
        node.setComingSoon(false);
        return node;
    }
}