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

@Service
public class NavigationService {
    private final CategoryRepository categoryRepository;
    private final ArticleRepository articleRepository;

    public NavigationService(CategoryRepository categoryRepository, ArticleRepository articleRepository) {
        this.categoryRepository = categoryRepository;
        this.articleRepository = articleRepository;
    }

    public List<CategoryTreeNode> getNavigationTree() {
        List<Category> allCategories = categoryRepository.findAll();
        List<Article> allArticles = articleRepository.findAll();

        // Map categoryId -> list of articles
        Map<Long, List<ArticleSummary>> articlesByCategory = allArticles.stream()
                .collect(Collectors.groupingBy(
                        a -> a.getCategoryId() != null ? a.getCategoryId() : null,
                        Collectors.mapping(a -> new ArticleSummary(a.getId(), a.getTitle()), Collectors.toList())));

        // Map categoryId -> list of child categories
        Map<Long, List<Category>> childrenByParent = allCategories.stream()
                .filter(c -> c.getParentId() != null)
                .collect(Collectors.groupingBy(Category::getParentId));

        // Build tree recursively
        List<CategoryTreeNode> roots = allCategories.stream()
                .filter(c -> c.getParentId() == null)
                .map(c -> buildNode(c, childrenByParent, articlesByCategory))
                .collect(Collectors.toList());

        return roots;
    }

    private CategoryTreeNode buildNode(Category cat, Map<Long, List<Category>> childrenByParent,
            Map<Long, List<ArticleSummary>> articlesByCategory) {
        CategoryTreeNode node = new CategoryTreeNode();
        node.setId(cat.getId());
        node.setName(cat.getName());
        node.setChildren(
                childrenByParent.getOrDefault(cat.getId(), Collections.emptyList())
                        .stream()
                        .map(child -> buildNode(child, childrenByParent, articlesByCategory))
                        .collect(Collectors.toList()));
        node.setArticles(articlesByCategory.getOrDefault(cat.getId(), Collections.emptyList()));
        return node;
    }
}