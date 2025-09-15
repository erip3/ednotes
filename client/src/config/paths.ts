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
  },
} as const;
