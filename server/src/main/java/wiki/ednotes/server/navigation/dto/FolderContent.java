package wiki.ednotes.server.navigation.dto;

import java.util.List;

/**
 * DTO for folder browsing containing sub-categories and articles.
 */
public class FolderContent {
    private List<CategorySummary> subCategories;
    private List<ArticleSummary> articles;

    public FolderContent() {
    }

    public FolderContent(List<CategorySummary> subCategories, List<ArticleSummary> articles) {
        this.subCategories = subCategories;
        this.articles = articles;
    }

    public List<CategorySummary> getSubCategories() {
        return subCategories;
    }

    public void setSubCategories(List<CategorySummary> subCategories) {
        this.subCategories = subCategories;
    }

    public List<ArticleSummary> getArticles() {
        return articles;
    }

    public void setArticles(List<ArticleSummary> articles) {
        this.articles = articles;
    }
}
