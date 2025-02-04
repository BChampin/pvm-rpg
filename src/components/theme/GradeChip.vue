<template>
  <q-chip
    size="md"
    :label="props.grade.label"
    :class="`bg-${props.grade.background ?? 'white'} text-${props.grade.text ?? 'black'}`"
  />
</template>

<script setup lang="ts">
import type { MapGrade } from 'src/types/Sheet'

const props = defineProps<{
  grade: MapGrade
}>()
</script>
