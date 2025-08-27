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
    private Long id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Column(name = "parent_id")
    private Long parentId;

    @Column(name = "coming_soon", nullable = false)
    private boolean comingSoon;

    @Column(name = "order_in_parent")
    private Integer orderInParent;

    @Column(name = "is_topic", nullable = false)
    private boolean isTopic;

    @Column(name = "topic_id")
    private Long topicId;

    protected Category() {}

    public Category(Long id, String name, Long parentId, boolean comingSoon, Integer orderInParent, boolean isTopic) {
        this.id = id;
        this.name = name;
        this.parentId = parentId;
        this.comingSoon = comingSoon;
        this.orderInParent = orderInParent;
        this.isTopic = isTopic;
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

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public boolean isComingSoon() {
        return comingSoon;
    }

    public void setComingSoon(boolean comingSoon) {
        this.comingSoon = comingSoon;
    }

    public Integer getOrderInParent() {
        return orderInParent;
    }

    public void setOrderInParent(Integer orderInParent) {
        this.orderInParent = orderInParent;
    }

    public boolean isTopic() {
        return isTopic;
    }

    public boolean setIsTopic() {
        return isTopic;
    }

    public Long getTopicId() {
        return topicId;
    }

    public void setTopicId(Long topicId) {
        this.topicId = topicId;
    }
}
