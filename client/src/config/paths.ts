export const paths = {
  home: {
    path: '/',
    getHref: () => '/',
  },

  category: {
    path: '/categories/:categoryId',
    getHref: (categoryId: string) => `/categories/${categoryId}`,
  },

  article: {
    path: '/articles/:articleId',
    getHref: (articleId: string) => `/articles/${articleId}`,
  },

  personal: {
    path: '/personal',
    getHref: () => '/personal',

    projects: {
      list: {
        path: '/personal/projects',
        getHref: () => '/personal/projects',
      },
      detail: {
        path: '/personal/projects/:projectId',
        getHref: (projectId: string) => `/personal/projects/${projectId}`,
      },
    },
  },
} as const;
