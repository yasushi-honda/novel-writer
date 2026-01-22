import DefaultTheme from 'vitepress/theme'
import './custom.css'
import type { Theme } from 'vitepress'

// Custom Layout
import Layout from './Layout.vue'

// Custom Components
import ScreenLayout from './components/ScreenLayout.vue'
import InteractiveTabs from './components/InteractiveTabs.vue'
import FeatureCard from './components/FeatureCard.vue'
import CardGrid from './components/CardGrid.vue'
import Accordion from './components/Accordion.vue'
import FaqItem from './components/FaqItem.vue'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    // Register global components
    app.component('ScreenLayout', ScreenLayout)
    app.component('InteractiveTabs', InteractiveTabs)
    app.component('FeatureCard', FeatureCard)
    app.component('CardGrid', CardGrid)
    app.component('Accordion', Accordion)
    app.component('FaqItem', FaqItem)
  }
} satisfies Theme
