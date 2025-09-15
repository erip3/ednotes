package wiki.ednotes.server.category;

import jakarta.persistence.*;

/**
 * Entity representing a category.
 */
@Entity
@Table(name = "categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "parent_id")
    private Integer parentId;

    @Column(name = "published", nullable = false)
    private boolean published;

    @Column(name = "order")
    private Integer order;

    @Column(name = "is_topic", nullable = false)
    private boolean isTopic;

    @Column(name = "topic_id")
    private Integer topicId;

    protected Category() {}

    public Category(Integer id, String title, Integer parentId, boolean published, Integer order, boolean isTopic) {
        this.id = id;
        this.title = title;
        this.parentId = parentId;
        this.published = published;
        this.order = order;
        this.isTopic = isTopic;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getParentId() {
        return parentId;
    }

    public void setParentId(Integer parentId) {
        this.parentId = parentId;
    }

    public boolean isPublished() {
        return published;
    }

    public void setPublished(boolean published) {
        this.published = published;
    }

    public Integer getOrder() {
        return order;
    }

    public void setOrder(Integer order) {
        this.order = order;
    }

    public boolean isTopic() {
        return isTopic;
    }

    public boolean setIsTopic() {
        return isTopic;
    }

    public Integer getTopicId() {
        return topicId;
    }

    public void setTopicId(Integer topicId) {
        this.topicId = topicId;
    }
}
