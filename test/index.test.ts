import { resolve } from 'path'
// import { promises as fs } from 'fs'
import { describe, expect, it } from 'vitest'
import { parse } from 'acorn'

import { transform } from '../src/transform'
import code from './fixtures/index.ts?raw'

describe('should', async() => {
  const id = resolve(__dirname, './fixtures/index.ts')
  // const code = await fs.readFile(id, 'utf-8')

  it('transform', async() => {
    expect((await transform(code, id, parse))?.code).toMatchInlineSnapshot(`
      "import * as __vite_glob_next_2_0 from './modules/a.ts'
      import * as __vite_glob_next_2_1 from './modules/b.ts'
      import * as __vite_glob_next_1_0 from './modules/a.ts?raw'
      import * as __vite_glob_next_1_1 from './modules/b.ts?raw'
      export interface ModuleType {
        name: string
      }
      
      export const list1 = {
      \\"./modules/a.ts\\": () => import(\\"./modules/a.ts\\"),
      \\"./modules/b.ts\\": () => import(\\"./modules/b.ts\\"),
      \\"./modules/index.ts\\": () => import(\\"./modules/index.ts\\")
      }
      
      export const list2 = {
      './modules/a.ts':__vite_glob_next_1_0,
      './modules/b.ts':__vite_glob_next_1_1
      }
      
      export const list3 = {
      './modules/a.ts':__vite_glob_next_2_0,
      './modules/b.ts':__vite_glob_next_2_1
      }
      "
    `)
  })
})
