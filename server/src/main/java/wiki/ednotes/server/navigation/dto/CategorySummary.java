package wiki.ednotes.server.navigation.dto;

/**
 * DTO for category summaries used in breadcrumb lists and folder browsing.
 */
public class CategorySummary {
    private Long id;
    private String title;
    private Boolean published;

    public CategorySummary() {
    }

    public CategorySummary(Long id, String title) {
        this.id = id;
        this.title = title;
    }

    public CategorySummary(Long id, String title, Boolean published) {
        this.id = id;
        this.title = title;
        this.published = published;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Boolean getPublished() {
        return published;
    }

    public void setPublished(Boolean published) {
        this.published = published;
    }
}
