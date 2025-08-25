package wiki.ednotes.server.navigation.dto;

import java.time.OffsetDateTime;

public class ArticleSummary {
    private Long id;
    private String title;
    private String author;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    private boolean isPublished;


    public ArticleSummary() {
    }

    public ArticleSummary(Long id, String title, String author, OffsetDateTime createdAt, OffsetDateTime updatedAt, boolean isPublished) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.isPublished = isPublished;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
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
