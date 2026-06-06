import './theme.css'
import './style.css'
import { renderApp } from './router.js'

renderApp()

window.addEventListener('hashchange', renderApp)