package wiki.ednotes.server.category.dto;

import wiki.ednotes.server.category.Category;
import java.util.List;

public class CategoryWithChildrenResponse {
    private Category parent;
    private List<Category> children;

    public CategoryWithChildrenResponse(Category parent, List<Category> children) {
        this.parent = parent;
        this.children = children;
    }

    public Category getParent() {
        return parent;
    }

    public void setParent(Category parent) {
        this.parent = parent;
    }

    public List<Category> getChildren() {
        return children;
    }

    public void setChildren(List<Category> children) {
        this.children = children;
    }
}