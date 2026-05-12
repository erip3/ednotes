package wiki.ednotes.server.navigation.dto;

import java.util.ArrayList;
import java.util.List;

public class SidebarNode {
    private Long id;
    private String name;
    private List<SidebarNode> children;
    private List<ArticleSummary> articles;
    private boolean published;

    public SidebarNode() {
        this.children = new ArrayList<>();
        this.articles = new ArrayList<>();
        this.published = false;
    }

    public SidebarNode(Long id, String name) {
        this.id = id;
        this.name = name;
        this.children = new ArrayList<>();
        this.articles = new ArrayList<>();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<SidebarNode> getChildren() {
        return children;
    }

    public void setChildren(List<SidebarNode> children) {
        this.children = children;
    }

    public List<ArticleSummary> getArticles() {
        return articles;
    }

    public void setArticles(List<ArticleSummary> articles) {
        this.articles = articles;
    }

    public boolean isPublished() {
        return published;
    }

    public void setPublished(boolean published) {
        this.published = published;
    }
}