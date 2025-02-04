<template>
  <component :is="props.inner ? 'q-inner-loading' : 'div'" showing>
    <img class="logo-spinner" src="~assets/images/logo_tm_round.png" loading="eager" alt="i" />
  </component>
</template>

<script setup lang="ts">
const props = defineProps({
  inner: {
    type: Boolean,
    default: false,
  },
})
</script>

<style lang="sass" scoped>
@keyframes rotateAndScale
  0%,100%
    opacity: 0.8
  25%,75%
    opacity: 1

  0%
    transform: scale(1)
  15%
    transform: scale(1)

  25%
    transform: scale(0.9)
  35%
    transform: scale(0.9)
  65%
    transform: scale(0.9) rotate(360deg)
  75%
    transform: scale(0.9) rotate(360deg)

  85%
    transform: scale(1) rotate(360deg)
  100%
    transform: scale(1) rotate(360deg)

.logo-spinner
  width: 3rem
  height: auto
  animation: rotateAndScale 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite
</style>
