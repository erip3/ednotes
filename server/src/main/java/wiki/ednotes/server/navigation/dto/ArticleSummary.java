package wiki.ednotes.server.navigation.dto;

public class ArticleSummary {
    private Long id;
    private String title;

    public ArticleSummary() {
    }

    public ArticleSummary(Long id, String title) {
        this.id = id;
        this.title = title;
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
}
