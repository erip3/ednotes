package wiki.ednotes.server.article;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ArticleService {
    private final ArticleRepository articleRepository;

    public ArticleService(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    public Optional<Article> findById(Long id) {
        return articleRepository.findById(id);
    }

    public List<Article> findByCategory(Long categoryId) {
        return articleRepository.findByCategoryIdOrderByOrderAsc(categoryId);
    }

    @Transactional
    public Article create(Article article) {
        return articleRepository.save(article);
    }

    @Transactional
    public Optional<Article> update(Long id, Article article) {
        return articleRepository.findById(id).map(existing -> {
            article.setId(id);
            return articleRepository.save(article);
        });
    }

    @Transactional
    public boolean delete(Long id) {
        if (!articleRepository.existsById(id))
            return false;
        articleRepository.deleteById(id);
        return true;
    }
}