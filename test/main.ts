/* eslint-disable @typescript-eslint/prefer-ts-expect-error */
import { createApp, h, onMounted, ref, watchEffect } from 'vue'
import { type OutputModes, Repl, useStore, useVueImportMap } from '../src'
// @ts-ignore
import MonacoEditor from '../src/editor/MonacoEditor.vue'
// @ts-ignore
import CodeMirrorEditor from '../src/editor/CodeMirrorEditor.vue'
import Header from '../src/Header.vue'
import parseScript from '../src/utils/parseScript'

console.log(parseScript(''))

const window = globalThis.window as any
window.process = { env: {} }

const setVH = () => {
  document.documentElement.style.setProperty('--vh', window.innerHeight + `px`)
}
window.addEventListener('resize', setVH)
setVH()

const App = {
  setup() {
    const query = new URLSearchParams(location.search)
    const {
      importMap: builtinImportMap,
      vueVersion,
      elementUiVersion,
    } = useVueImportMap({
      // runtimeDev: import.meta.env.PROD
      //   ? undefined
      //   : `${location.origin}/src/vue-dev-proxy`,
      // serverRenderer: import.meta.env.PROD
      //   ? undefined
      //   : `${location.origin}/src/vue-server-renderer-dev-proxy`,
      // runtimeDev:
      //   'https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.esm.browser.js',
      vueVersion: '2.6.14',
      elementUiVersion: '2.15.14',
    })
    const store = (window.store = useStore(
      {
        builtinImportMap,
        vueVersion,
        elementUiVersion,
        showOutput: ref(query.has('so')),
        outputMode: ref((query.get('om') as OutputModes) || 'preview'),
      },
      location.hash,
    ))
    console.info(store)

    watchEffect(() => history.replaceState({}, '', store.serialize()))

    // setTimeout(() => {
    //   store.setFiles(
    //     {
    //       'src/index.html': '<h1>yo</h1>',
    //       'src/main.js': 'document.body.innerHTML = "<h1>hello</h1>"',
    //       'src/foo.js': 'document.body.innerHTML = "<h1>hello</h1>"',
    //       'src/bar.js': 'document.body.innerHTML = "<h1>hello</h1>"',
    //       'src/baz.js': 'document.body.innerHTML = "<h1>hello</h1>"',
    //     },
    //     'src/index.html',
    //   )
    // }, 1000)

    const replRef = ref()
    function reloadPage() {
      replRef.value?.reload()
    }

    // store.vueVersion = vueVersion.value
    // store.elementUiVersion = elementUiVersion.value
    const theme = ref<'light' | 'dark'>('dark')
    function toggleTheme(isDark: boolean) {
      theme.value = isDark ? 'dark' : 'light'
    }
    window.theme = theme
    const previewTheme = ref(false)
    window.previewTheme = previewTheme

    onMounted(() => {
      const cls = document.documentElement.classList
      toggleTheme(cls.contains('dark'))
    })

    return () => {
      return h(
        'div',
        {
          style: {},
        },
        [
          h(Header, {
            store,
            // ssr: useSSRMode
            // @toggle-prod="toggleProdMode"
            // @toggle-ssr="toggleSSR"
            onReloadPage: reloadPage,
            onToggleTheme: toggleTheme,
          }),
          h(Repl, {
            ref: replRef,
            store,
            theme: theme.value,
            previewTheme: previewTheme.value,
            editor: MonacoEditor,
            // layout: 'vertical',
            ssr: false,
            sfcOptions: {
              script: {
                // inlineTemplate: false
              },
            },
            showTsConfig: false,
            // showCompileOutput: false,
            showImportMap: false,
          }),
        ],
      )
    }
  },
}

createApp(App).mount('#app')
