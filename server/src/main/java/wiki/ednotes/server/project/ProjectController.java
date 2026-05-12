package wiki.ednotes.server.project;

import java.util.List;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for reading projects (reader API).
 */
@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    private final ProjectService projectService;

    /**
     * Constructor for ProjectController.
     * @param projectService the project service
     */
    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    /**
     * Get all projects sorted by order.
     * @return list of all projects
     */
    @GetMapping
    public List<Project> getAllProjects() {
        return projectService.findAll();
    }
}
