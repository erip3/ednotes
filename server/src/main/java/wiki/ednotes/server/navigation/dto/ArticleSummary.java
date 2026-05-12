package wiki.ednotes.server.navigation.dto;

public class ArticleSummary {
    private Long id;
    private String title;
    private boolean published;


    public ArticleSummary() {
    }

    public ArticleSummary(Long id, String title, boolean published) {
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

    public boolean getPublished() {
        return published;
    }

    public void setPublished(boolean published) {
        this.published = published;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
