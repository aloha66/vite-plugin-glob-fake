export interface ModuleType {
  name: string
}

export const list1 = import.meta.myGlob<ModuleType>('./modules/*.ts')

export const list2 = import.meta.myGlob<ModuleType>([
  './modules/*.ts',
  // './modules2/*.ts',
  '!**/index.ts',
], { eager: true, as: 'raw' })

export const list3 = import.meta.myGlob<ModuleType>([
  './modules/*.ts',
  // './modules2/*.ts',
  '!**/index.ts',
], { eager: true })
