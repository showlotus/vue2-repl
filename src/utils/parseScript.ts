import htmlCode from './demo.html?raw'

export default function parseScript(html: string) {
  const scriptRegex = /<script([^>]+)><\/script>/g
  const srcPropRegex = /src="([^"]+)/
  const list = (html || htmlCode).match(scriptRegex)
  const sourceList = [] as string[]
  list?.forEach((str) => {
    const src = str.match(srcPropRegex)?.[1]
    if (src) {
      sourceList.push(src.replace(/^\.\//, ''))
    }
  })
  return sourceList
}
