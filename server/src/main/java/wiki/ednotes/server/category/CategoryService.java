package wiki.ednotes.server.category;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {
	private final CategoryRepository categoryRepository;

	public CategoryService(CategoryRepository categoryRepository) {
		this.categoryRepository = categoryRepository;
	}

	public List<Category> findAll() {
		return categoryRepository.findAll();
	}

	public Optional<Category> findById(Long id) {
		return categoryRepository.findById(id);
	}

	public List<Category> findChildren(Long parentId) {
		return categoryRepository.findByParentIdOrderByOrderAsc(parentId);
	}

	public Optional<Category> findParent(Long id) {
		return categoryRepository.findById(id)
				.flatMap(category -> category.getParentId() == null
						? Optional.empty()
						: categoryRepository.findById(category.getParentId()));
	}

	public List<Category> findTopLevel(boolean includeComingSoon) {
		if (includeComingSoon) {
			return categoryRepository.findByParentIdOrderByOrderAsc(null);
		}
		return categoryRepository.findByParentIdAndPublishedIsTrueOrderByOrderAsc(null);
	}

	@Transactional
	public Category create(Category category) {
		return categoryRepository.save(category);
	}

	@Transactional
	public Optional<Category> update(Long id, Category category) {
		return categoryRepository.findById(id).map(existing -> {
			category.setId(id);
			return categoryRepository.save(category);
		});
	}

	@Transactional
	public boolean delete(Long id) {
		if (!categoryRepository.existsById(id)) {
			return false;
		}
		categoryRepository.deleteById(id);
		return true;
	}
}
