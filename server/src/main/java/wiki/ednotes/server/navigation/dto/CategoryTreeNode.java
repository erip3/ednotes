package wiki.ednotes.server.navigation.dto;

import java.util.ArrayList;
import java.util.List;

public class CategoryTreeNode {
    private Integer id;
    private String name;
    private List<CategoryTreeNode> children;
    private List<ArticleSummary> articles;
    private boolean comingSoon;

    public CategoryTreeNode() {
        this.children = new ArrayList<>();
        this.articles = new ArrayList<>();
        this.comingSoon = false;
    }

    public CategoryTreeNode(Integer id, String name) {
        this.id = id;
        this.name = name;
        this.children = new ArrayList<>();
        this.articles = new ArrayList<>();
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<CategoryTreeNode> getChildren() {
        return children;
    }

    public void setChildren(List<CategoryTreeNode> children) {
        this.children = children;
    }

    public List<ArticleSummary> getArticles() {
        return articles;
    }

    public void setArticles(List<ArticleSummary> articles) {
        this.articles = articles;
    }

    public boolean isComingSoon() {
        return comingSoon;
    }

    public void setComingSoon(boolean comingSoon) {
        this.comingSoon = comingSoon;
    }
}