# Database Documentation

## Entity Relationship Diagram

The database follows a Poly-Hierarchical model to create a hierarchy of categories and articles, conceptual connections between articles, and connections between articles and projects:

- **Tree Structure:** Categories self-reference via parent_id. All Categories can contain Categories and Articles.

    This diagram illustrates the primary connections between categories, articles, and projects. The ArticleConnections table allows for an article to be background material for (or build upon) zero to many other articles. Some non-relational fields are omitted for clarity:

    ```mermaid
    ---
    config:
        layout: elk
    ---
    erDiagram
        direction LR
        Categories ||--o{ Categories : "parents"
        Categories |o--o{ Categories : "topic for"
        Categories ||--o{ Articles : "contains"
        Articles ||--o{ ArticleConnections : "builds on"
        Articles ||--o{ ArticleConnections : "background for"
        Projects |o--|| Articles : "links to"

        Categories {
            int8 id PK
            text title
            int8 parent_id FK
            boolean topic
            int8 topic_id FK
        }

        Articles {
            int8 id PK
            text title
            int8 category_id FK
        }

        Projects {
            int8 id PK
            text name
            int8 article_id FK
        }
    ```

- **Article Connections:** Articles are nodes; article_connections are directed edges used to indicate conceptual relationships between Articles. 

    ```mermaid
    graph TB
        subgraph Knowledge Graph
            A[Article A] -- background for --> B[Article B]
            A -- background for --> C[Article C]
        end
        
        subgraph Database Implementation
            A_Node[Articles] --> AC[ArticleConnections]
            AC --> B_Node[Articles]
        end
    ```

- **Project-Related Articles:** Projects can link to Articles for further details.

## Data Dictionary

### Table: public.Categories

Defines the organizational structure.

| Column | Type | Description |
|---|---|---|
| id | int8 | Primary Key (Identity). |
| title | text | Display name of the category. |
| parent_id | int8 | Self-reference for hierarchical nesting. |
| published | bool | Published status. |
| order | int8 | Order for display on website. |
| topic | bool | Flag to trigger the "Topic Sidebar" UI component. |
| topic_id | int8 | Pointer to the root topic category for context inheritance. |

### Table: public.Articles

The primary content nodes.

| Column | Type | Description |
|---|---|---|
| id | int8 | Primary Key (Identity). |
| title | text | Article heading. |
| content | jsonb | Structured document data. |
| category_id |int8 | The parent category for breadcrumb generation. |
| published | bool | Visibility toggle for the public frontend. |
| order | int8 | Order for display on website. |

### Table: public.ArticleConnections

Creates conceptual connections between articles.

| Column | Type | Description |
|---|---|---|
| source_id | int8 | The article that "requires" or "refers to" another. |
| target_id | int8 | The article being referred to (the prerequisite). |

### Table: public.Projects

Holds information on projects.

| Column | Type | Description |
|---|---|---|
| id | int8 | Primary Key (Identity). |
| name | text | Project name. |
| github_url | text | Link to project's GitHub page. |
| demo_url | text | Link to demo for the project. |
| tech_stack | text | Technologies used for the project. |
| article_id | int8 | ID of the project's associated article. |
| description | text | Short description of the project. |
| order | int8 | Order for display on website. |

## JSONB Content Schema

The articles.content field follows a structured JSON format to ensure compatibility between the Article Editor and the Web Client.

{
  "type": "doc",
  "content": [
    {
      "type": "paragraph",
      "content": [
        { "type": "text", "text": "Example content..." }
      ]
    }
  ]
}


## Row Level Security (RLS) Policies

| Table | Policy Name | Role | Access |
|---|---|---|---|
| articles | Public Read | anon/auth | SELECT where published = true |
| articles | Editor Access | auth | ALL (Insert/Update/Delete) |
| connections | Public Read | anon/auth | SELECT all |

## Critical Queries

Fetching the Topic Sidebar Tree

```
WITH RECURSIVE topic_tree AS (
    SELECT id, title, parent_id, is_topic FROM categories WHERE id = :target_topic_id
    UNION ALL
    SELECT c.id, c.title, c.parent_id, c.is_topic FROM categories c
    INNER JOIN topic_tree tt ON c.parent_id = tt.id
)
SELECT * FROM topic_tree;
```

Fetching Prerequisites for Sidebar

```
SELECT 
    target.id, 
    target.title 
FROM article_connections conn
JOIN articles target ON conn.target_id = target.id
WHERE conn.source_id = :current_article_id;
```