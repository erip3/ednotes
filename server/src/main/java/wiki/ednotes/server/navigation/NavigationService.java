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
    private final CategoryRepository categoryRepository; // Repository for category data
    private final ArticleRepository articleRepository; // Repository for article data

    /**
     * Constructor for NavigationService.
     * @param categoryRepository
     * @param articleRepository
     */
    public NavigationService(CategoryRepository categoryRepository, ArticleRepository articleRepository) {
        this.categoryRepository = categoryRepository;
        this.articleRepository = articleRepository;
    }

    /**
     * Get the navigation tree structure.
     * @return A list of root categories with their subcategories and articles.
     */
    public List<CategoryTreeNode> getNavigationTree() {
        List<Category> allCategories = categoryRepository.findAll();
        List<Article> allArticles = articleRepository.findAll();

        // Map categoryId -> list of articles
        Map<Integer, List<ArticleSummary>> articlesByCategory = allArticles.stream()
                .collect(Collectors.groupingBy(
                        a -> a.getCategoryId() != null ? a.getCategoryId() : null,
                        Collectors.mapping(a -> new ArticleSummary(a.getId(), a.getTitle(), a.getIsPublished() != null && a.getIsPublished()), Collectors.toList())));

        // Map categoryId -> list of child categories
        Map<Integer, List<Category>> childrenByParent = allCategories.stream()
                .filter(c -> c.getParentId() != null)
                .collect(Collectors.groupingBy(Category::getParentId));

        // Build tree recursively
        List<CategoryTreeNode> roots = allCategories.stream()
                .filter(c -> c.getParentId() == null)
                .map(c -> buildNode(c, childrenByParent, articlesByCategory))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        return roots;
    }

    /**
     * 
     * @param categoryId
     * @return
     */
    public List<ArticleSummary> getArticleSummariesByCategory(Integer categoryId) {
        List<Article> articles = articleRepository.findByCategoryIdOrderByOrderInCategoryAsc(categoryId);
        return articles.stream()
                .map(a -> new ArticleSummary(a.getId(), a.getTitle(), a.getIsPublished() != null && a.getIsPublished()))
                .collect(Collectors.toList());
    }

    /**
     * Get the article summaries for a specific category.
     * @param cat
     * @param childrenByParent
     * @param articlesByCategory
     * @return CategoryTreeNode
     */
    private CategoryTreeNode buildNode(Category cat, Map<Integer, List<Category>> childrenByParent,
        Map<Integer, List<ArticleSummary>> articlesByCategory) {
        if (cat.isComingSoon()) {
                return null; // Skip "coming soon" categories
        }
        CategoryTreeNode node = new CategoryTreeNode();
        node.setId(cat.getId());
        node.setName(cat.getName());
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