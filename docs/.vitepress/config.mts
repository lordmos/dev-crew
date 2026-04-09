import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'DevCrew',
  description: 'AI-powered dev team orchestration framework',
  base: '/devcrew/',
  head: [
    ['link', { rel: 'icon', href: '/devcrew/logo.svg', type: 'image/svg+xml' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;700&display=swap',
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
        ],
      },
    },
  },

  themeConfig: {
    logo: '/logo.svg',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/lordmos/devcrew' },
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
})
