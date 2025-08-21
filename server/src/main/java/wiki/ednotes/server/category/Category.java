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

    protected Category() {
        // JPA requires a no-arg constructor
    }

    public Category(Long id, String name, Long parentId, boolean comingSoon) {
        this.id = id;
        this.name = name;
        this.parentId = parentId;
        this.comingSoon = comingSoon;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Long getParentId() {
        return parentId;
    }

    public boolean isComingSoon() {
        return comingSoon;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public void setComingSoon(boolean comingSoon) {
        this.comingSoon = comingSoon;
    }
}
