<script setup lang="ts">
import { onMounted, ref } from 'vue'

const expanded = ref(false)
const versions = ref<string[]>()

const version = defineModel()
const props = defineProps<{
  pkg: string
  label: string
}>()

async function toggle() {
  expanded.value = !expanded.value
  if (!versions.value) {
    // versions.value = await fetchVersions()
    versions.value = await fetchMirrorVersions()
  }
}

async function fetchMirrorVersions(): Promise<string[]> {
  const mirrorRegistry = 'https://registry.npmmirror.com'
  const { versions } = (await fetch(`${mirrorRegistry}/${props.pkg}`).then(
    (res) => res.json(),
  )) as { versions: string[] }
  let filterRule = (v: string) => true
  if (props.pkg === 'element-ui') {
    filterRule = (v) => !v.includes('-') && /^2\.1[0-5]/.test(v)
  } else if (props.pkg === 'vue') {
    filterRule = (v) =>
      !v.includes('-') && (v.startsWith('2.7') || v.startsWith('2.6'))
  }
  const sortVersion = (a: string, b: string) => {
    const aVersions = a.split('.').map(Number)
    const bVersions = b.split('.').map(Number)
    for (let i = 0; i < 3; i++) {
      if (aVersions[i] > bVersions[i]) {
        return -1
      } else if (aVersions[i] < bVersions[i]) {
        return 1
      }
    }
    return 0
  }
  const filteredVersions = Object.keys(versions)
    .filter(filterRule)
    .sort(sortVersion)
  return filteredVersions
}

// @ts-expect-error
async function fetchVersions(): Promise<string[]> {
  console.log(await fetchMirrorVersions())
  const res = await fetch(
    `https://data.jsdelivr.com/v1/package/npm/${props.pkg}`,
  )
  const { versions } = (await res.json()) as { versions: string[] }

  if (props.pkg === 'vue') {
    // if the latest version is a pre-release, list all current pre-releases
    // otherwise filter out pre-releases
    // let isInPreRelease = versions[0].includes('-')
    const filteredVersions: string[] = []
    for (const v of versions) {
      if (!v.includes('-') && (v.startsWith('2.7') || v.startsWith('2.6'))) {
        filteredVersions.push(v)
        continue
      }

      // if (v.includes('-')) {
      //   if (isInPreRelease) {
      //     filteredVersions.push(v)
      //   }
      // } else {
      //   filteredVersions.push(v)
      //   isInPreRelease = false
      // }
      // if (filteredVersions.length >= 30 || v === '3.0.10') {
      //   break
      // }
    }
    return filteredVersions
  } else if (props.pkg === 'typescript') {
    return versions.filter((v) => !v.includes('dev') && !v.includes('insiders'))
  } else if (props.pkg === 'element-ui') {
    return versions.filter((v) => !v.includes('-') && /^2\.1[0-5]/.test(v))
  }
  return versions
}

function setVersion(v: string) {
  version.value = v
  expanded.value = false
}

onMounted(() => {
  window.addEventListener('click', () => {
    expanded.value = false
  })
  window.addEventListener('blur', () => {
    if (document.activeElement?.tagName === 'IFRAME') {
      expanded.value = false
    }
  })
})
</script>

<template>
  <div class="version" @click.stop>
    <span class="active-version" @click="toggle">
      {{ label }}
      <span class="number">{{ version }}</span>
    </span>

    <ul class="versions" :class="{ expanded }">
      <li v-if="!versions"><a>loading versions...</a></li>
      <li v-for="ver of versions" :class="{ active: ver === version }">
        <a @click="setVersion(ver)">v{{ ver }}</a>
      </li>
      <div @click="expanded = false">
        <slot />
      </div>
    </ul>
  </div>
</template>

<style>
.version {
  margin-right: 12px;
  position: relative;
}

.active-version {
  cursor: pointer;
  position: relative;
  display: inline-flex;
  place-items: center;
}

.active-version .number {
  color: var(--green);
  margin-left: 4px;
}

.active-version::after {
  content: '';
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 6px solid #aaa;
  margin-left: 8px;
}

.versions .active a {
  color: var(--green);
}
</style>
