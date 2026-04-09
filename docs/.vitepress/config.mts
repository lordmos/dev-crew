import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(defineConfig({
  title: 'DevCrew',
  description: 'AI-powered dev team orchestration framework',
  base: '/dev-crew/',
  head: [
    ['link', { rel: 'icon', href: '/dev-crew/dev-crew.png', type: 'image/png' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;700&display=swap',
      },
    ],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
        integrity: 'sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==',
        crossorigin: 'anonymous',
        referrerpolicy: 'no-referrer',
      },
    ],
  ],

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      themeConfig: {
        nav: [
          { text: '指南', link: '/guide' },
          { text: '专家', link: '/specialists' },
        ],
        sidebar: [
          {
            text: '开始使用',
            items: [
              { text: '快速开始', link: '/quick-start' },
              { text: '使用指南', link: '/guide' },
            ],
          },
          {
            text: '深入了解',
            items: [
              { text: '核心概念', link: '/concepts' },
              { text: '领域专家', link: '/specialists' },
              { text: '使用场景', link: '/scenarios' },
            ],
          },
          {
            text: '最佳实践',
            items: [
              { text: '从零构建 Todo App', link: '/examples/01-greenfield-todo-app' },
              { text: '中途接入已有项目', link: '/examples/02-midway-join-project' },
            ],
          },
        ],
      },
    },
    en: {
      label: 'English',
      lang: 'en-US',
      themeConfig: {
        nav: [
          { text: 'Guide', link: '/en/guide' },
          { text: 'Specialists', link: '/en/specialists' },
        ],
        sidebar: [
          {
            text: 'Getting Started',
            items: [
              { text: 'Quick Start', link: '/en/quick-start' },
              { text: 'Guide', link: '/en/guide' },
            ],
          },
          {
            text: 'Learn More',
            items: [
              { text: 'Core Concepts', link: '/en/concepts' },
              { text: 'Specialists', link: '/en/specialists' },
              { text: 'Use Cases', link: '/en/scenarios' },
            ],
          },
          {
            text: 'Best Practices',
            items: [
              { text: 'Greenfield Todo App', link: '/en/examples/01-greenfield-todo-app' },
              { text: 'Join Existing Project', link: '/en/examples/02-midway-join-project' },
            ],
          },
        ],
      },
    },
  },

  themeConfig: {
    logo: '/dev-crew.png',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/lordmos/dev-crew' },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Built with <a href="https://github.com/lordmos/meridian">Meridian</a>',
    },
    search: {
      provider: 'local',
    },
  },

  vite: {
    resolve: {
      preserveSymlinks: true,
    },
  },

  markdown: {
    breaks: true,
  },

  ignoreDeadLinks: true,
}))
