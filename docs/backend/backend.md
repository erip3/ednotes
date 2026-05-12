# Backend Documentation

## Functional Requirements

### Reader Functionality

- **Hierarchical Discovery**: Retrieve categories by `parent_id` to allow standard folder-style browsing. This is the primary way users find content.

- **Topic Sidebar**:
  - When a user enters a category or article where `topic = true` (or an ancestor is a topic), the UI renders a recursive tree.
  - For every article in the tree, the backend checks for "Background Connections" and includes them as children in the tree payload.

- **Article Viewing**:
  - For each article, return a list of foundational articles that the current article builds upon.
  - Calculate the hierarchical path from the absolute root (`parent_id IS NULL`) to the current article.

- **Project Listing**: Fetch a list of projects sorted by `order` for the personal page.

### Editor Functionality

- **Content Manipulation**: Create/Update articles using raw JSON content.

- **Hierarchy Management**: Create/Move categories and manage the `parent_id` chain.

- **Connection Management**: Link articles together for the background system.

- **Topic Promotion**: Toggle the `topic` flag to turn any folder.

## Directory Structure

    wiki.ednotes.server
    ├── article
    │   ├── Article.java
    │   ├── ArticleConnection.java
    │   ├── ArticleConnectionId.java     <-- Composite PK for prerequisites
    │   ├── ArticleRepository.java
    │   ├── ArticleConnectionRepository.java
    │   ├── ArticleService.java
    │   ├── ArticleController.java       <-- Reader API
    │   ├── ArticleEditorController.java <-- Editor API
    │   └── ArticleConnectionController.java
    ├── category
    │   ├── Category.java
    │   ├── CategoryRepository.java
    │   ├── CategoryService.java
    │   └── CategoryController.java      <-- Editor API
    ├── project
    │   ├── Project.java
    │   ├── ProjectRepository.java
    │   ├── ProjectService.java
    │   ├── ProjectController.java       <-- Reader API
    │   └── ProjectEditorController.java <-- Editor API
    ├── navigation
    │   ├── NavigationService.java       <-- Unified navigation logic
    │   ├── NavigationController.java    <-- Reader API
    │   └── dto/
    │       ├── CategorySummary.java
    │       ├── ArticleSummary.java
    │       ├── ArticleContent.java
    │       ├── FolderContent.java
    │       └── SidebarNode.java
    ├── config
    │   └── CorsConfig.java
    └── ServerApplication.java

## Domain Model Summaries

- **Category** (wiki.ednotes.server.category)
  - Manages the hierarchical tree and topic-locking context.

  - Fields: id, title, parentId, topicId (link to root topic), topic (boolean flag), published (boolean), order.

  - Constraints: order is a reserved SQL keyword; use @Column(name = "\"order\"").

- **Article** (wiki.ednotes.server.article)
  - The core content nodes of the system.

  - Fields: id, title, content (JSONB), categoryId, published, order.

- **ArticleConnection** (wiki.ednotes.server.article)
  - The Directed Acyclic Graph (DAG) edges defining prerequisites.

  - Fields: sourceId (The dependent article), targetId (The prerequisite).

- **Project** (wiki.ednotes.server.project)

## Data Transfer Objects

- **CategorySummary**: Used in breadcrumb lists and folder browsing.
  - `Long id`
  - `String title`

- **ArticleSummary**: Leaf node for sidebars and search results.
  - `Long id`, `String title`, `boolean published`

- **FolderContent**: Standard browsing folder view.

- **SidebarNode**
  - `Long id`, `String title`
  - `List\<SidebarNode\> children`
  - `List\<ArticleSummary\> articles`

- **ArticleContent**
  - `Article article` (The core content)
  - `List\<CategorySummary\> breadcrumbs` (The path to home)
  - `List\<ArticleSummary\> backgroundArticles` (Graph connections)

## Service Logic

- **ArticleService**: CRUD operations for articles.
  - `findById(Long id)`: Retrieve an article.
  - `findByCategory(Long categoryId)`: List articles in a category, ordered.
  - `create(Article)`: Persist a new article (transactional).
  - `update(Long id, Article)`: Update an existing article (transactional).
  - `delete(Long id)`: Remove an article (transactional).

- **CategoryService**: CRUD and hierarchy operations.
  - `findAll()`: Retrieve all categories.
  - `findById(Long id)`: Retrieve a category by ID.
  - `findChildren(Long parentId)`: List child categories ordered by `order`.
  - `findParent(Long id)`: Retrieve the parent category.
  - `findTopLevel(boolean includeComingSoon)`: List root categories, optionally filtered.
  - `create(Category)`: Persist a new category (transactional).
  - `update(Long id, Category)`: Update an existing category (transactional).
  - `delete(Long id)`: Remove a category (transactional).

- **NavigationService**: Unified navigation queries for reader APIs.
  - `getRoots()`: Get root categories with immediate articles.
  - `getCategoryContent(Long categoryId)`: Get child categories and articles.
  - `getBreadcrumbs(Long categoryId)`: Climb parentId chain to root.
  - `search()`: Return all published articles.
  - `getArticleContent(Long articleId)`: Get article with breadcrumbs and background articles.
  - `getNavigationTree(Long categoryId)`: Build recursive sidebar tree.
  - `getArticleSummariesByCategory(Long categoryId)`: Get article summaries for a category.

- **ProjectService**: CRUD for projects.
  - `findAll()`: Retrieve all projects ordered by `order`.
  - `findById(Long id)`: Retrieve a project by ID.
  - `create(Project)`: Persist a new project (transactional).
  - `delete(Long id)`: Remove a project (transactional).

## API Specification

### Reader Endpoints

| Endpoint                          | Method | Return Type             | Purpose                                                |
| --------------------------------- | ------ | ----------------------- | ------------------------------------------------------ |
| `/api/navigation/roots`           | GET    | FolderContent           | Fetches root categories with their articles.           |
| `/api/navigation/categories/{id}` | GET    | FolderContent           | Fetches child categories and articles for a folder.    |
| `/api/navigation/tree/{topicId}`  | GET    | List\<SidebarNode\>     | Full recursive tree for topic sidebars.                |
| `/api/navigation/search`          | GET    | List\<ArticleSummary\>  | Fetches all published articles.                        |
| `/api/navigation/path/{catId}`    | GET    | List\<CategorySummary\> | Breadcrumbs from root to category.                     |
| `/api/articles/{id}`              | GET    | ArticleContent          | Full article with breadcrumbs and background articles. |
| `/api/projects`                   | GET    | List\<Project\>         | All projects sorted by order.                          |

### Editor Endpoints

| Endpoint                      | Method | Return Type       | Purpose                                                              |
| ----------------------------- | ------ | ----------------- | -------------------------------------------------------------------- |
| `/api/editor/articles/{id}`   | GET    | Article           | Fetch raw article (includes unpublished).                            |
| `/api/editor/articles`        | POST   | Article           | Create a new article.                                                |
| `/api/editor/articles/{id}`   | PUT    | Article           | Update an article.                                                   |
| `/api/editor/articles/{id}`   | DELETE | (no content)      | Delete an article.                                                   |
| `/api/editor/categories`      | POST   | Category          | Create a new category.                                               |
| `/api/editor/categories/{id}` | PUT    | Category          | Update a category.                                                   |
| `/api/editor/categories/{id}` | DELETE | (no content)      | Delete a category.                                                   |
| `/api/editor/connections`     | POST   | ArticleConnection | Create an article connection.                                        |
| `/api/editor/connections`     | DELETE | (no content)      | Delete an article connection (via query params: sourceId, targetId). |
| `/api/editor/projects`        | POST   | Project           | Create a new project.                                                |
| `/api/editor/projects/{id}`   | DELETE | (no content)      | Delete a project.                                                    |
