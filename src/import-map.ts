import { computed, version as currentVersion, ref } from 'vue'

export function useVueImportMap(
  defaults: {
    runtimeDev?: string | (() => string)
    runtimeProd?: string | (() => string)
    serverRenderer?: string | (() => string)
    vueVersion?: string | null
    elementUiVersion?: string | null
  } = {},
) {
  function normalizeDefaults(defaults?: string | (() => string)) {
    if (!defaults) return
    return typeof defaults === 'string' ? defaults : defaults()
  }

  const productionMode = ref(false)
  const vueVersion = ref<string | null>(defaults.vueVersion || null)
  const elementUiVersion = ref<string | null>(defaults.elementUiVersion || null)
  const importMap = computed<ImportMap>(() => {
    // TAG 以 CDN 的方式引入 Vue
    const vue =
      (!vueVersion.value &&
        normalizeDefaults(
          productionMode.value ? defaults.runtimeProd : defaults.runtimeDev,
        )) ||
      `https://cdn.jsdelivr.net/npm/vue@${vueVersion.value || '2.6.14'}/dist/vue.esm.browser.js`

    // const serverRenderer =
    //   (!vueVersion.value && normalizeDefaults(defaults.serverRenderer)) ||
    //   `https://cdn.jsdelivr.net/npm/@vue/server-renderer@${
    //     vueVersion.value || currentVersion
    //   }/dist/server-renderer.esm-browser.js`
    return {
      imports: {
        vue,
        // 'vue/server-renderer': serverRenderer,
      },
      dependencies: {
        vue: vueVersion.value!,
        'element-ui': elementUiVersion.value!,
      },
    }
  })

  return {
    productionMode,
    importMap,
    vueVersion,
    elementUiVersion,
    defaultVersion: currentVersion,
  }
}

export interface ImportMap {
  imports?: Record<string, string | undefined>
  scopes?: Record<string, Record<string, string>>
  dependencies?: Record<string, string>
}

export function mergeImportMap(a: ImportMap, b: ImportMap): ImportMap {
  return {
    imports: { ...a.imports, ...b.imports },
    scopes: { ...a.scopes, ...b.scopes },
    dependencies: { ...a.dependencies, ...b.dependencies },
  }
}
