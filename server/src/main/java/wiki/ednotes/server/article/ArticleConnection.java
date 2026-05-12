package wiki.ednotes.server.article;

import jakarta.persistence.Entity;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Table;

/**
 * Entity representing a conceptual connection between multiple articles.
 */
@Entity
@Table(name = "ArticleConnections")
public class ArticleConnection {
	@EmbeddedId
	private ArticleConnectionId id;

	public ArticleConnectionId getId() {
		return id;
	}

	public void setId(ArticleConnectionId id) {
		this.id = id;
	}

	public Long getSourceId() {
		return id != null ? id.getSourceId() : null;
	}

	public void setSourceId(Long sourceId) {
		if (id == null) {
			id = new ArticleConnectionId();
		}
		id.setSourceId(sourceId);
	}

	public Long getTargetId() {
		return id != null ? id.getTargetId() : null;
	}

	public void setTargetId(Long targetId) {
		if (id == null) {
			id = new ArticleConnectionId();
		}
		id.setTargetId(targetId);
	}
}
