# Database Documentation

## Overview

EdNotes utilizes a Hybrid Knowledge Graph & Poly-Hierarchical Data Model hosted on PostgreSQL / Supabase:

1. **Strict Tree Hierarchy (Categories):** Folder-style browsing organized with self-referencing `parent_id` pointers.
2. **Directed Acyclic Graph (Article Connections):** Articles act as graph nodes linked by directed edges (`ArticleConnections`) to map prerequisite and foundational knowledge.
3. **Contextual Topic Flow:** Major categories are designated as topics (`topic = true`), enabling recursive sidebar navigation where prerequisites are dynamically surfaced.
4. **Project Links:** Portfolio projects link directly into articles.

## Entity Relationship Diagram

The database follows a poly-hierarchical model to create a hierarchy of categories and articles, conceptual connections between articles, and connections between articles and projects:

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

```
[
  { "type": "header", "level": 1, "content": "Introduction to Convex Optimization" },
  { "type": "paragraph", "content": "This article discusses **gradient descent** and convex cost functions." },
  { "type": "equation", "content": "f(x) \\ge f(x_0) + \\nabla f(x_0)^T (x - x_0)", "caption": "First-order condition" },
  { "type": "code", "language": "python", "content": "def gradient_step(x, lr, grad):\n    return x - lr * grad" },
  { "type": "note", "style": "info", "content": "Learning rates must satisfy the Wolfe conditions for convergence." },
  { "type": "figure", "src": "/images/convex-hull.png", "caption": "Figure 1: Convex Set" },
  { "type": "list", "ordered": false, "items": ["Convex sets", "Convex functions", "Dual problems"] },
  {
    "type": "tabs",
    "defaultValue": "python",
    "tabs": [
      {
        "value": "python",
        "label": "Python",
        "blocks": [{ "type": "code", "language": "python", "content": "print('hello')" }]
      }
    ]
  },
  { "type": "demo", "demoType": "convolution", "args": {} }
]
```