package wiki.ednotes.server.navigation.dto;

import wiki.ednotes.server.article.Article;
import java.util.List;

/**
 * DTO for article viewing containing the article, breadcrumbs, and background references.
 */
public class ArticleContent {
    private Article article;
    private List<CategorySummary> breadcrumbs;
    private List<ArticleSummary> backgroundArticles;

    public ArticleContent() {
    }

    public ArticleContent(Article article, List<CategorySummary> breadcrumbs, List<ArticleSummary> backgroundArticles) {
        this.article = article;
        this.breadcrumbs = breadcrumbs;
        this.backgroundArticles = backgroundArticles;
    }

    public Article getArticle() {
        return article;
    }

    public void setArticle(Article article) {
        this.article = article;
    }

    public List<CategorySummary> getBreadcrumbs() {
        return breadcrumbs;
    }

    public void setBreadcrumbs(List<CategorySummary> breadcrumbs) {
        this.breadcrumbs = breadcrumbs;
    }

    public List<ArticleSummary> getBackgroundArticles() {
        return backgroundArticles;
    }

    public void setBackgroundArticles(List<ArticleSummary> backgroundArticles) {
        this.backgroundArticles = backgroundArticles;
    }
}
