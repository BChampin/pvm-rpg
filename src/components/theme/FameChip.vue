<template>
  <q-chip
    v-if="props.fame"
    size="md"
    :label="props.fame.label"
    :class="`bg-${props.fame.color ?? 'white'} text-${props.fame.text ?? 'black'}`"
  />
</template>

<script setup lang="ts">
import type { Fame } from 'src/types/Sheet'

const props = defineProps<{
  fame: Fame
}>()
</script>
