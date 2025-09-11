package wiki.ednotes.server.project;

import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    private final ProjectRepository projectRepository;

    /**
     * Constructor for ProjectController.
     * @param projectRepository Project repository for CRUD operations
     */
    public ProjectController(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    /**
     * Get all projects.
     * @return List of all projects
     */
    @GetMapping
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }
}
