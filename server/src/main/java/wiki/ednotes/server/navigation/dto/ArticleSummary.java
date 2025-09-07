package wiki.ednotes.server.navigation.dto;

public class ArticleSummary {
    private Long id;
    private String title;
    private boolean isPublished;


    public ArticleSummary() {
    }

    public ArticleSummary(Long id, String title, boolean isPublished) {
        this.id = id;
        this.title = title;
        this.isPublished = isPublished;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public boolean getIsPublished() {
        return isPublished;
    }

    public void setIsPublished(boolean published) {
        isPublished = published;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
