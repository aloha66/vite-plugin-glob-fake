import { list1, list2 } from '../../test/fixtures'
import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!

await Promise.all(Object.values(list1).map(i => i())).then((modules) => {
  app.textContent += JSON.stringify(modules)
})

await Promise.all(Object.values(list2).map(i => i())).then((modules) => {
  app.textContent += JSON.stringify(modules)
})
