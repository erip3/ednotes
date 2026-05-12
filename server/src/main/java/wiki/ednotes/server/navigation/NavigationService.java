package wiki.ednotes.server.navigation;

import org.springframework.stereotype.Service;
import wiki.ednotes.server.category.Category;
import wiki.ednotes.server.category.CategoryRepository;
import wiki.ednotes.server.article.Article;
import wiki.ednotes.server.article.ArticleRepository;
import wiki.ednotes.server.navigation.dto.SidebarNode;
import wiki.ednotes.server.navigation.dto.ArticleSummary;
import wiki.ednotes.server.navigation.dto.CategorySummary;
import wiki.ednotes.server.navigation.dto.FolderContent;
import wiki.ednotes.server.navigation.dto.ArticleContent;

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
     * Get root categories with their immediate articles.
     * 
     * @return FolderContent containing root categories and their articles.
     */
    public FolderContent getRoots() {
        List<Category> roots = categoryRepository.findByParentIdOrderByOrderAsc(null);
        
        List<CategorySummary> subCategories = roots.stream()
            .map(c -> new CategorySummary(c.getId(), c.getTitle(), c.getPublished()))
                .collect(Collectors.toList());
        
        List<ArticleSummary> articles = roots.stream()
                .flatMap(cat -> articleRepository.findByCategoryIdOrderByOrderAsc(cat.getId()).stream())
                .map(a -> new ArticleSummary(a.getId(), a.getTitle(), 
                        a.getPublished() != null && a.getPublished()))
                .collect(Collectors.toList());
        
        return new FolderContent(subCategories, articles);
    }

    /**
     * Get a category's contents: its child categories and articles.
     * 
     * @param categoryId The category ID.
     * @return FolderContent containing sub-categories and articles.
     */
    public FolderContent getCategoryContent(Long categoryId) {
        List<Category> children = categoryRepository.findByParentIdOrderByOrderAsc(categoryId);
        
        List<CategorySummary> subCategories = children.stream()
            .map(c -> new CategorySummary(c.getId(), c.getTitle(), c.getPublished()))
                .collect(Collectors.toList());
        
        List<ArticleSummary> articles = articleRepository.findByCategoryIdOrderByOrderAsc(categoryId).stream()
                .map(a -> new ArticleSummary(a.getId(), a.getTitle(), 
                        a.getPublished() != null && a.getPublished()))
                .collect(Collectors.toList());
        
        return new FolderContent(subCategories, articles);
    }

    /**
     * Get the breadcrumb path from root to a specific category.
     * 
     * @param categoryId The category ID.
     * @return List of CategorySummary from root to the category.
     */
    public List<CategorySummary> getBreadcrumbs(Long categoryId) {
        List<CategorySummary> breadcrumbs = new ArrayList<>();
        Long current = categoryId;
        
        while (current != null) {
            Optional<Category> cat = categoryRepository.findById(current);
            if (cat.isPresent()) {
                breadcrumbs.add(0, new CategorySummary(cat.get().getId(), cat.get().getTitle(), cat.get().getPublished()));
                current = cat.get().getParentId();
            } else {
                break;
            }
        }
        
        return breadcrumbs;
    }

    /**
     * Search for published articles.
     * 
     * @return List of published ArticleSummary.
     */
    public List<ArticleSummary> search() {
        return articleRepository.findAll().stream()
                .filter(a -> a.getPublished() != null && a.getPublished())
                .map(a -> new ArticleSummary(a.getId(), a.getTitle(), true))
                .collect(Collectors.toList());
    }

    /**
     * Get article content with breadcrumbs and background articles.
     * 
     * @param articleId The article ID.
     * @return ArticleContent or empty Optional if not found.
     */
    public Optional<ArticleContent> getArticleContent(Long articleId) {
        return articleRepository.findById(articleId).map(article -> {
            List<CategorySummary> breadcrumbs = new ArrayList<>();
            if (article.getCategoryId() != null) {
                breadcrumbs = getBreadcrumbs(article.getCategoryId());
            }
            
            // For now, no background articles (would require ArticleConnection logic)
            List<ArticleSummary> backgroundArticles = new ArrayList<>();
            
            return new ArticleContent(article, breadcrumbs, backgroundArticles);
        });
    }

    /**
     * Get the navigation tree structure (all root categories).
     * 
     * @return A list of root categories with their subcategories and articles.
     */
    public List<SidebarNode> getNavigationTree() {
        List<Category> allCategories = categoryRepository.findAll();
        List<Article> allArticles = articleRepository.findAll();

        // Map categoryId -> list of articles
        Map<Long, List<ArticleSummary>> articlesByCategory = allArticles.stream()
                .collect(Collectors.groupingBy(
                        a -> a.getCategoryId() != null ? a.getCategoryId() : null,
                        Collectors.mapping(
                                a -> new ArticleSummary(a.getId(), a.getTitle(),
                                        a.getPublished() != null
                                                && a.getPublished()),
                                Collectors.toList())));

        // Map parentId -> list of child categories
        Map<Long, List<Category>> childrenByParent = allCategories.stream()
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
    public List<SidebarNode> getNavigationTree(Long categoryId) {
        List<Category> allCategories = categoryRepository.findAll();
        List<Article> allArticles = articleRepository.findAll();

        Map<Long, List<ArticleSummary>> articlesByCategory = allArticles.stream()
                .collect(Collectors.groupingBy(
                        a -> a.getCategoryId() != null ? a.getCategoryId() : null,
                        Collectors.mapping(
                                a -> new ArticleSummary(a.getId(), a.getTitle(),
                                        a.getPublished() != null
                                                && a.getPublished()),
                                Collectors.toList())));

        Map<Long, List<Category>> childrenByParent = allCategories.stream()
                .filter(c -> c.getParentId() != null)
                .collect(Collectors.groupingBy(Category::getParentId));

        if (categoryId != null) {
            // Find the category by ID
            Optional<Category> rootOpt = allCategories.stream()
                    .filter(c -> c.getId().equals(categoryId))
                    .findFirst();
            if (rootOpt.isPresent()) {
                SidebarNode node = buildNode(rootOpt.get(), childrenByParent, articlesByCategory);
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
    public List<ArticleSummary> getArticleSummariesByCategory(Long categoryId) {
        List<Article> articles = articleRepository.findByCategoryIdOrderByOrderAsc(categoryId);
        return articles.stream()
                .map(a -> new ArticleSummary(a.getId(), a.getTitle(),
                        a.getPublished() != null && a.getPublished()))
                .collect(Collectors.toList());
    }

    /**
     * Build a SidebarNode recursively.
     * 
     * @param cat                The category.
     * @param childrenByParent   Map of parentId to child categories.
     * @param articlesByCategory Map of categoryId to articles.
     * @return SidebarNode or null if not published.
     */
    private SidebarNode buildNode(
            Category cat,
            Map<Long, List<Category>> childrenByParent,
            Map<Long, List<ArticleSummary>> articlesByCategory) {
        if (!cat.getPublished()) {
            return null; // Skip "coming soon" categories
        }
        SidebarNode node = new SidebarNode();
        node.setId(cat.getId());
        node.setName(cat.getTitle());
        node.setChildren(
                childrenByParent.getOrDefault(cat.getId(), Collections.emptyList())
                        .stream()
                        .map(child -> buildNode(child, childrenByParent, articlesByCategory))
                        .filter(Objects::nonNull)
                        .collect(Collectors.toList()));
        node.setArticles(articlesByCategory.getOrDefault(cat.getId(), Collections.emptyList()));
        node.setPublished(true);
        return node;
    }
}