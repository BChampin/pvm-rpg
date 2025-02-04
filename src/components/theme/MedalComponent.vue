<template>
  <q-avatar size="48px">
    <img :src="`/images/${props.level.icon}.png`" />
    <q-tooltip>
      {{
        `${props.level.label}${props.map ? ` - ${timeNumberToStr(props.map.times[props.level.level])}` : ''}`
      }}
    </q-tooltip>
  </q-avatar>
</template>

<script setup lang="ts">
import { timeNumberToStr } from 'src/utils'
import type { Level, Map } from 'src/types/Sheet'

const props = defineProps<{
  map?: Map
  level: Level
}>()
</script>
