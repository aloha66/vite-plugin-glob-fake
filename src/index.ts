
import type { Plugin } from 'vite'
import { transform } from './transform'

// \b 划分单词边界
/**
 * myGlob转成匹配文件内容
 * 在代码中使用
 * import.meta.myGlob<T>('regex path')
 * @returns 返回一个对象 key是字符串，value是一个Promise
 */
export default function(): Plugin {
  return {
    name: 'vite-plugin-glob-fake',
    // 页面运行时才执行
     transform(code, id) {
      return transform(code, id)
    },
  }
}
