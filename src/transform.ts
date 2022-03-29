import { dirname } from 'path'
import fg from 'fast-glob'
import MagicString from 'magic-string'

const importGlobRE = /\bimport\.meta\.globNext(?:<\w+>)?\((.*)\)/g

export async function transform(code: string, id: string) {
  const matchs = Array.from(code.matchAll(importGlobRE))
  if (!matchs.length) return

  const s = new MagicString(code)
  for (const match of matchs) {
    const glob = match[1].slice(1, -1) // 获取分组内容
    // dirname(id)
    // 绝对路径 返回当前id的父目录
    // .../playground/src
    // 获取匹配到文件相对路径
    const files = await fg(glob, { dot: true, cwd: dirname(id) })
    // 重新拼接code 匹配到之前的内容 + 自定义内容 + 匹配结果长度的内容
    const start = match.index! //  匹配的结果的开始位置
    const end = start + match[0].length // 匹配结果的长度
    // 构造自定义内容
    // const modules = {
    //   './dir/foo.js': () => import('./dir/foo.js'),
    //   './dir/bar.js': () => import('./dir/bar.js')
    // }
    const repalcement = `{${files.map(i => `"${i}": () => import("${i}")`).join(',')}}`
    // 将globNext内容替换成自定义内容
    s.overwrite(start, end, repalcement)
    // code = code.slice(0, start) + repalcement + code.slice(end)
  }

  return { code: s.toString(), map: s.generateDecodedMap() }
}
