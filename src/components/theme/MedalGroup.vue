<template>
  <div v-if="props.map" class="q-pa-md absolute">
    <MedalComponent
      v-for="(medal, index) of cptMedals"
      :key="index"
      :level="medal"
      :map="props.map"
      :style="`position: absolute; right: -${index * 20}px;`"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Map } from 'src/types/Sheet'
import { getLevel } from 'src/types/Sheet'
import MedalComponent from 'components/theme/MedalComponent.vue'

const props = defineProps<{
  map?: Map
  time?: number
}>()

const cptMedals = computed(() => {
  let medals = ['noob', 'intermediate', 'challenger', 'player', 'alien', 'wr']

  if (props.map && props.time) {
    medals = []
    if (props.map.times.noob > props.time) medals.push('noob')
    if (props.map.times.intermediate > props.time) medals.push('intermediate')
    if (props.map.times.challenger > props.time) medals.push('challenger')
    if (props.map.times.player > props.time) medals.push('player')
    if (props.map.times.alien > props.time) medals.push('alien')
    if (props.map.times.wr > props.time) medals.push('wr')
  }
  return medals.map((str) => getLevel(str))
})
</script>
