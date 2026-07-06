// @ts-check
// Docusaurus site configuration for docs.oblikovati.org.
// Docs are served at the site root (this is a dedicated docs subdomain), the blog is
// disabled, versioning is enabled, and the theme mirrors website-oblikovati.org.

const { themes } = require('prism-react-renderer');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Oblikovati Docs',
  tagline: 'Open-source parametric, feature-based mechanical CAD',
  favicon: 'img/favicon.svg',

  url: 'https://docs.oblikovati.org',
  baseUrl: '/',

  organizationName: 'Oblikovati',
  projectName: 'docs.oblikovati.org',

  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  // English is the source of truth; pt-BR and es are scaffolded for translation.
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt-BR', 'es'],
    localeConfigs: {
      en: { label: 'English' },
      'pt-BR': { label: 'Português (Brasil)' },
      es: { label: 'Español' },
    },
  },

  // Load the same webfonts website-oblikovati.org uses so the brand type is identical.
  headTags: [
    {
      tagName: 'link',
      attributes: { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    },
    {
      tagName: 'link',
      attributes: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'true' },
    },
  ],
  stylesheets: [
    'https://fonts.googleapis.com/css2?family=Albert+Sans:wght@400;500;600;700;800&family=Newsreader:ital,wght@0,400;0,500;1,400&family=JetBrains+Mono:wght@400;500&display=swap',
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/Oblikovati/docs.oblikovati.org/tree/main/',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/logo.svg',
      colorMode: {
        defaultMode: 'dark',
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: 'Oblikovati',
        logo: { alt: 'Oblikovati logo', src: 'img/logo.svg' },
        items: [
          { type: 'docSidebar', sidebarId: 'docsSidebar', position: 'left', label: 'Docs' },
          { type: 'docsVersionDropdown', position: 'right' },
          { type: 'localeDropdown', position: 'right' },
          {
            href: 'https://github.com/Oblikovati',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              { label: 'Introduction', to: '/' },
              { label: 'Keyboard Shortcuts', to: '/reference/keyboard-shortcuts' },
            ],
          },
          {
            title: 'Project',
            items: [
              { label: 'Website', href: 'https://website-oblikovati.org' },
              { label: 'GitHub', href: 'https://github.com/Oblikovati' },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Oblikovati. Built with Docusaurus.`,
      },
      prism: {
        theme: themes.oneLight,
        darkTheme: themes.oneDark,
        additionalLanguages: ['lua'],
      },
    }),
};

module.exports = config;
