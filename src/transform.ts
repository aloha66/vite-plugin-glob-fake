import { dirname } from 'path'
import fg from 'fast-glob'
import MagicString from 'magic-string'
import type { ArrayExpression, Literal, ObjectExpression } from 'estree'
import type { TransformPluginContext } from 'rollup'

const importGlobRE = /\bimport\.meta\.myGlob(?:<\w+>)?\(([\s\S]*?)\)/g
const importPrefix = '__vite_glob_next_'

export async function transform(
  code: string,
  id: string,
  parse: TransformPluginContext['parse']) {
  const matchs = Array.from(code.matchAll(importGlobRE))
  if (!matchs.length) return

  const s = new MagicString(code)
  let num = 0 // 解决模块引用不冲突
  for (const match of matchs) {
    const argumentsString = `[${match[1]}]` // 获取分组内容  圆括号形成openBlock
    // 把匹配到的代码片段解析成ast
    // 提取字符串片段转成数组
    // @ts-expect-error let me do it
    const ast = parse(argumentsString, { ecmaVersion: 'latest' }).body[0].expression as ArrayExpression
    // console.log('ast',ast)

    // args就是myGlob的参数
    const args1 = ast.elements[0]! as Literal | ArrayExpression
    const globs: string[] = []
    if (args1.type === 'ArrayExpression') {
      for (const element of args1.elements) {
        if (element.type === 'Literal')
          globs.push(element.value as string)
      }
    }
    else {
      globs.push(args1.value as string)
    }

    const options: GlobOptions<boolean> = {}
    const args2 = ast.elements[1] as ObjectExpression |undefined

    if (args2) {
      for (const property of args2.properties)
      // @ts-expect-error let me do it
        options[property.key.name] = property.value.value
    }

    console.log('options', options)

    // dirname(id)
    // 绝对路径 返回当前id的父目录
    // .../playground/src
    // 获取匹配到文件相对路径
    const files = await fg(globs, { dot: true, cwd: dirname(id) })
    console.log({ globs, files })
    // 重新拼接code 匹配到之前的内容 + 自定义内容 + 匹配结果长度的内容
    const start = match.index! //  匹配的结果的开始位置
    const end = start + match[0].length // 匹配结果的长度
    const query = options.as ? `?${options.as}` : '' // 如果as存在 就拼接上as参数
    // 构造自定义内容
    // const modules = {
    //   './dir/foo.js': () => import('./dir/foo.js'),
    //   './dir/bar.js': () => import('./dir/bar.js')
    // }
    if (options.eager) {
      // import * as __vite_glob_next_0 from './modules/a.ts?raw'
      const imports = files.map((file, idx) => `import * as ${importPrefix}${num}_${idx} from '${file}${query}'`).join('\n')
      // 追加到头部
      s.prepend(`${imports}\n`)
      // 改成同步的形式
      const repalcement = `{\n${files.map((file, idx) => `'${file}':${importPrefix}${num}_${idx}`).join(',\n')}\n}`

      s.overwrite(start, end, repalcement)
    }
    else {
      const repalcement = `{\n${files.map(i => `"${i}": () => import("${i}${query}")`).join(',\n')}\n}`
      // 将myGlob内容替换成自定义内容
      s.overwrite(start, end, repalcement)
    }

    num += 1
  }

  return { code: s.toString(), map: s.generateDecodedMap() }
}
