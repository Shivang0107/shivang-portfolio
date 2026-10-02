import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './styles/main.css'
import './styles/themes.css'
import './styles/repair.css'
import './styles/gravity.css'
createApp(App).use(createPinia()).mount('#app')
