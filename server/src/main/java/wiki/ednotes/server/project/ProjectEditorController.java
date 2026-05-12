package wiki.ednotes.server.project;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Controller for managing projects (editor API).
 */
@RestController
@RequestMapping("/api/editor/projects")
public class ProjectEditorController {
    private final ProjectService projectService;

    /**
     * Constructor for ProjectEditorController.
     * @param projectService the project service
     */
    public ProjectEditorController(ProjectService projectService) {
        this.projectService = projectService;
    }

    /**
     * Create a new project.
     * @param project the project to create
     * @return the created project
     */
    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        return ResponseEntity.ok(projectService.create(project));
    }

    /**
     * Delete a project by its ID.
     * @param id the ID of the project to delete
     * @return a response indicating the result of the deletion
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        if (projectService.delete(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
