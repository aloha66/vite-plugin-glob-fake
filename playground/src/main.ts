import { list } from '../../test/fixtures'
import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!

await Promise.all(Object.values(list).map(i => i())).then((modules) => {
  app.textContent = JSON.stringify(modules)
})
