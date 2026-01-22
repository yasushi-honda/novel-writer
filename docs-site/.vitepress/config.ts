import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(
  defineConfig({
    title: '小説らいたー',
    description: 'AI搭載の小説執筆支援アプリケーション',
    lang: 'ja-JP',
    base: '/novel-writer/',

    head: [
      ['link', { rel: 'icon', type: 'image/svg+xml', href: '/novel-writer/favicon.svg' }],
      ['meta', { name: 'theme-color', content: '#6366f1' }],
    ],

    themeConfig: {
      logo: '/logo.svg',
      siteTitle: '小説らいたー',

      nav: [
        { text: 'ホーム', link: '/' },
        { text: 'ユーザーガイド', link: '/user-guide/introduction' },
        { text: '開発者ガイド', link: '/developer-guide/architecture' },
        { text: 'リファレンス', link: '/reference/shortcuts' },
      ],

      sidebar: {
        '/user-guide/': [
          {
            text: 'はじめに',
            items: [
              { text: 'イントロダクション', link: '/user-guide/introduction' },
              { text: '最初の一歩', link: '/user-guide/getting-started' },
              { text: '画面の見方', link: '/user-guide/screen-layout' },
            ]
          },
          {
            text: '執筆機能',
            items: [
              { text: '本文を書く', link: '/user-guide/writing' },
              { text: 'キャラクターを作る', link: '/user-guide/characters' },
              { text: '世界観を作る', link: '/user-guide/worldbuilding' },
            ]
          },
          {
            text: '整理機能',
            items: [
              { text: 'ナレッジベース', link: '/user-guide/knowledge' },
              { text: 'プロット・タイムライン', link: '/user-guide/plot' },
            ]
          },
          {
            text: 'AI活用',
            items: [
              { text: 'AIアシスタント活用法', link: '/user-guide/ai-assistant' },
            ]
          },
          {
            text: 'その他',
            items: [
              { text: '書き出し', link: '/user-guide/export' },
              { text: 'よくある質問', link: '/user-guide/faq' },
            ]
          },
        ],
        '/developer-guide/': [
          {
            text: '技術仕様',
            items: [
              { text: 'システムアーキテクチャ', link: '/developer-guide/architecture' },
              { text: 'データモデル', link: '/developer-guide/data-models' },
              { text: '状態管理', link: '/developer-guide/state-management' },
              { text: 'AI API仕様', link: '/developer-guide/api-reference' },
              { text: 'コンポーネント', link: '/developer-guide/components' },
            ]
          },
        ],
        '/reference/': [
          {
            text: 'リファレンス',
            items: [
              { text: 'ショートカット', link: '/reference/shortcuts' },
              { text: '更新履歴', link: '/reference/changelog' },
            ]
          },
        ],
      },

      socialLinks: [
        { icon: 'github', link: 'https://github.com/yasushi-honda/novel-writer' }
      ],

      footer: {
        message: 'AI搭載の小説執筆支援アプリケーション',
        copyright: 'Copyright © 2026 Novel Writer Team'
      },

      search: {
        provider: 'local',
        options: {
          translations: {
            button: {
              buttonText: '検索',
              buttonAriaLabel: '検索'
            },
            modal: {
              noResultsText: '結果が見つかりませんでした',
              resetButtonTitle: 'リセット',
              footer: {
                selectText: '選択',
                navigateText: '移動',
                closeText: '閉じる'
              }
            }
          }
        }
      },

      outline: {
        label: '目次',
        level: [2, 3]
      },

      lastUpdated: {
        text: '最終更新',
        formatOptions: {
          dateStyle: 'short',
          timeStyle: 'short'
        }
      },

      docFooter: {
        prev: '前のページ',
        next: '次のページ'
      },
    },

    mermaid: {
      // ダークモード対応: VitePressのテーマと連動
      theme: 'default',
    },

    mermaidPlugin: {
      class: 'mermaid',
    },

    markdown: {
      lineNumbers: true
    }
  })
)
