import { list1, list2, list3 } from '../../test/fixtures'
import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!

await Promise.all(Object.values(list1).map(i => i())).then((modules) => {
  app.innerHTML += `${JSON.stringify(modules)}<br/>`
})

// await Promise.all(Object.values(list2).map(i => i())).then((modules) => {
//   app.innerHTML += JSON.stringify(modules)
// })

app.innerHTML += `${JSON.stringify(list2)}<br/>`
app.innerHTML += `${JSON.stringify(list3)}<br/>`
