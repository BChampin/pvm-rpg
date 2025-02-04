<template>
  <a :href="props.map.exchange.link ?? 'https://trackmania.exchange/'" target="_blank">
    <q-card class="my-br map-card">
      <q-img
        :src="props.map.exchange.thumbnail"
        style="height: 100%"
        placeholder-src="../../assets/images/home_bg_1.jpg"
      >
        <div
          class="absolute-top flex items-center justify-between no-wrap"
          style="padding-top: 4px; padding-bottom: 4px"
        >
          <GradeChip :grade="props.map.grade" />
          <MedalGroup :map="props.map" />
        </div>
        <div class="absolute-bottom flex items-center justify-between">
          <div class="text-subtitle1 text-weight-bold">
            {{ props.map.label }}
          </div>
          <div class="text-body2 text-grey-5">
            {{ props.map.exchange.author?.name }}
          </div>
        </div>
      </q-img>
    </q-card>
  </a>
</template>

<script setup lang="ts">
import type { Map } from 'src/types/Sheet'
import GradeChip from 'components/theme/GradeChip.vue'
import MedalGroup from 'components/theme/MedalGroup.vue'

const props = defineProps<{
  map: Map
}>()
</script>

<style lang="scss" scoped>
.map-card {
  width: 100%;
  height: 300px;
  @media (max-width: $breakpoint-xs-max) {
    height: 150px;
  }
}
</style>
