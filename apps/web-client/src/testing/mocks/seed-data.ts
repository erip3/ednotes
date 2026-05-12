/**
 * Creates a realistic hierarchical tree structure of categories and articles
 * for the mock database. Ensures proper parent-child relationships and
 * top-level categories are accessible.
 *
 * Structure:
 * - Top-level categories (parentId = null)
 * - Child categories (parentId = top-level category id)
 * - Articles (categoryId = category id)
 */

import { db } from './db';
export const SEED_VERSION = '2025-12-21.1';

export const seedDatabase = () => {
  // Clear existing data
  db.category.deleteMany({ where: {} });
  db.article.deleteMany({ where: {} });
  db.project.deleteMany({ where: {} });

  // Top-level categories (no parent)
  const personal = db.category.create({
    id: 1,
    title: 'Personal',
    parentId: null,
    published: true,
    order: 1,
    topicId: null,
    topic: false,
  });

  const mathematics = db.category.create({
    id: 2,
    title: 'Mathematics',
    parentId: null,
    published: true,
    order: 2,
    topicId: null,
    topic: true,
  });

  const computerScience = db.category.create({
    id: 3,
    title: 'Computer Science',
    parentId: null,
    published: true,
    order: 3,
    topicId: null,
    topic: true,
  });

  // Personal subcategories
  const personalsub = db.category.create({
    id: 10,
    title: 'More Stuff',
    parentId: personal.id,
    published: true,
    order: 1,
    topicId: null,
    topic: false,
  });

  // Math subcategories
  const calculus = db.category.create({
    id: 20,
    title: 'Calculus',
    parentId: mathematics.id,
    published: true,
    order: 1,
    topicId: mathematics.id,
    topic: false,
  });

  const linearAlgebra = db.category.create({
    id: 21,
    title: 'Linear Algebra',
    parentId: mathematics.id,
    published: true,
    order: 2,
    topicId: mathematics.id,
    topic: false,
  });

  // CS subcategories
  const algorithms = db.category.create({
    id: 30,
    title: 'Algorithms',
    parentId: computerScience.id,
    published: true,
    order: 1,
    topicId: computerScience.id,
    topic: false,
  });

  const dataStructures = db.category.create({
    id: 31,
    title: 'Data Structures',
    parentId: computerScience.id,
    published: true,
    order: 2,
    topicId: computerScience.id,
    topic: false,
  });

  // Article for More Stuff
  db.article.create({
    id: 100,
    title: 'My Personal Journey',
    content: JSON.stringify([
      {
        type: 'paragraph',
        content:
          'Data structures are formats used for the storage of data. They are used for the efficient organization and management of data. Choosing the right data structure for a particular task can greatly benefit the performance and complexity of solutions. Data structures can be broadly grouped into four categories: Sequential, Hierarchical, Network, and Associative',
      },
      {
        type: 'header',
        level: 1,
        content: 'Derivatives',
      },
    ]),
    categoryId: personalsub.id,
    published: true,
    order: 1,
  });

  // Articles for Calculus
  db.article.create({
    id: 200,
    title: 'Introduction to Derivatives',
    content: JSON.stringify([
      {
        type: 'header',
        level: 1,
        content: 'Derivatives',
      },
      {
        type: 'paragraph',
        content: 'A derivative represents the rate of change of a function...',
      },
    ]),
    categoryId: calculus.id,
    published: true,
    order: 1,
  });

  db.article.create({
    id: 201,
    title: 'Integration Techniques',
    content: JSON.stringify([
      {
        type: 'header',
        level: 1,
        content: 'Integration',
      },
      {
        type: 'paragraph',
        content: 'Integration is the reverse process of differentiation...',
      },
    ]),
    categoryId: calculus.id,
    published: true,
    order: 2,
  });

  // Articles for Algorithms
  db.article.create({
    id: 300,
    title: 'Big O Notation',
    content: JSON.stringify([
      {
        type: 'header',
        level: 1,
        content: 'Time Complexity',
      },
      {
        type: 'paragraph',
        content: 'Big O notation describes the performance of algorithms...',
      },
    ]),
    categoryId: algorithms.id,
    published: true,
    order: 1,
  });

  db.article.create({
    id: 301,
    title: 'Sorting Algorithms',
    content: JSON.stringify([
      {
        type: 'header',
        level: 1,
        content: 'Sorting',
      },
      {
        type: 'paragraph',
        content:
          'Common sorting algorithms include bubble sort, merge sort, and quicksort...',
      },
    ]),
    categoryId: algorithms.id,
    published: true,
    order: 2,
  });

  db.article.create({
    id: 302,
    title: 'Dynamic Programming',
    content: JSON.stringify([
      {
        type: 'header',
        level: 1,
        content: 'Dynamic Programming',
      },
      {
        type: 'paragraph',
        content: 'Break down complex problems into simpler subproblems...',
      },
    ]),
    categoryId: algorithms.id,
    published: true,
    order: 3,
  });

  // Articles for Linear Algebra
  db.article.create({
    id: 210,
    title: 'Vectors and Matrices',
    content: JSON.stringify([
      {
        type: 'header',
        level: 1,
        content: 'Linear Algebra Basics',
      },
      {
        type: 'paragraph',
        content: 'Vectors and matrices are fundamental...',
      },
    ]),
    categoryId: linearAlgebra.id,
    published: true,
    order: 1,
  });

  // Articles for Data Structures
  db.article.create({
    id: 310,
    title: 'Linked Lists',
    content: JSON.stringify([
      {
        type: 'header',
        level: 1,
        content: 'Linked Lists',
      },
      {
        type: 'paragraph',
        content: 'A linked list is a linear data structure...',
      },
    ]),
    categoryId: dataStructures.id,
    published: true,
    order: 1,
  });

  db.article.create({
    id: 311,
    title: 'Binary Trees',
    content: JSON.stringify([
      {
        level: 1,
        type: 'heading',
        content: 'Trees',
      },
      {
        type: 'paragraph',
        content: 'Binary trees are hierarchical data structures...',
      },
    ]),
    categoryId: dataStructures.id,
    published: true,
    order: 2,
  });

  // Articles for Projects
  db.article.create({
    id: 400,
    title: 'Binary Trees',
    content: JSON.stringify([
      {
        level: 1,
        type: 'heading',
        content: 'Trees',
      },
      {
        type: 'paragraph',
        content: 'Binary trees are hierarchical data structures...',
      },
    ]),
    categoryId: personal.id,
    published: true,
    order: 2,
  });

  // Projects
  db.project.create({
    id: 1,
    name: 'EdNotes',
    description: 'A personal knowledge base and note-taking application',
    githubUrl: 'https://github.com/yourusername/ednotes',
    demoUrl: 'https://ednotes.example.com',
    techStack: 'React, TypeScript, Spring Boot, PostgreSQL',
    imageUrl: undefined,
    articleId: undefined,
    order: 1,
  });

  db.project.create({
    id: 2,
    name: 'Algorithm Visualizer',
    description: 'Interactive visualization of sorting and graph algorithms',
    githubUrl: 'https://github.com/yourusername/algo-viz',
    demoUrl: undefined,
    techStack: 'React, D3.js, Canvas API',
    imageUrl: undefined,
    articleId: 400,
    order: 2,
  });

  db.project.create({
    id: 3,
    name: 'Algorithm Visualizer',
    description: 'Interactive visualization of sorting and graph algorithms',
    githubUrl: 'https://github.com/yourusername/algo-viz',
    demoUrl: undefined,
    techStack: 'React, D3.js, Canvas API',
    imageUrl: undefined,
    articleId: 401,
    order: 2,
  });

  db.project.create({
    id: 4,
    name: 'Algorithm Visualizer',
    description: 'Interactive visualization of sorting and graph algorithms',
    githubUrl: 'https://github.com/yourusername/algo-viz',
    demoUrl: undefined,
    techStack: 'React, D3.js, Canvas API',
    imageUrl: undefined,
    articleId: 401,
    order: 2,
  });

  console.log('Mock database seeded with hierarchical data');
};
