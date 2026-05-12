package wiki.ednotes.server.project;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service for managing projects.
 */
@Service
public class ProjectService {
    private final ProjectRepository projectRepository;

    /**
     * Constructor for ProjectService.
     * @param projectRepository the project repository
     */
    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    /**
     * Get all projects ordered by order field.
     * @return list of projects
     */
    public List<Project> findAll() {
        return projectRepository.findAllByOrderByOrderAsc();
    }

    /**
     * Get a project by its ID.
     * @param id the project ID
     * @return the project if found
     */
    public Optional<Project> findById(Long id) {
        return projectRepository.findById(id);
    }

    /**
     * Create a new project.
     * @param project the project to create
     * @return the created project
     */
    @Transactional
    public Project create(Project project) {
        return projectRepository.save(project);
    }

    /**
     * Delete a project by its ID.
     * @param id the project ID
     * @return true if deleted, false if not found
     */
    @Transactional
    public boolean delete(Long id) {
        if (!projectRepository.existsById(id)) {
            return false;
        }
        projectRepository.deleteById(id);
        return true;
    }
}
