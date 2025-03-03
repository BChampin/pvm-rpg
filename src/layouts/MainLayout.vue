<template>
  <q-layout view="lHh Lpr lFf" class="text-body1">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          class="lt-md"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title class="flex items-center">
          <router-link :to="{ name: 'home' }" class="flex items-center link cursor-pointer">
            <img src="/images/favicon.png" height="45" width="45" />
            <h1 class="text-h6 text-weight-bolder text-secondary q-ml-md">PVM-RPG</h1>
          </router-link>
        </q-toolbar-title>

        <div class="gt-sm flex">
          <q-item
            v-for="(link, i) of links"
            :key="i"
            :to="link.to ?? undefined"
            :href="link.href ?? undefined"
            :target="link.target ?? undefined"
            class="text-secondary flex items-center q-gutter-x-sm text-uppercase text-weight-bold"
          >
            <q-icon :name="link.icon" size="sm" />
            <div>
              {{ link.label }}
            </div>
          </q-item>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" class="bg-primary">
      <div class="flex items-center q-pl-md">
        <img src="/images/favicon.png" height="45" width="45" />
        <h1 class="text-h6 text-weight-bolder text-secondary q-ml-md">PVM-RPG</h1>
      </div>
      <q-list>
        <q-item
          v-for="(link, i) of links"
          :key="i"
          :to="link.to ?? undefined"
          :href="link.href ?? undefined"
          :target="link.target ?? undefined"
          class="text-secondary flex items-center q-gutter-x-sm text-uppercase text-weight-bold"
        >
          <q-icon :name="link.icon" size="sm" />
          <div>
            {{ link.label }}
          </div>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
    <FooterComponent />
  </q-layout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useSheetStore } from 'src/stores/sheet'
import FooterComponent from 'components/ui/FooterComponent.vue'

const store = useSheetStore()
onMounted(async () => {
  await store.init()
})

const links = [
  { to: { name: 'home' }, label: 'Home', icon: 'ion-home' },
  { to: { name: 'maps' }, label: 'Maps', icon: 'ion-flag' },
  { to: { name: 'players' }, label: 'Players', icon: 'ion-people' },
  { href: store.SHEET_URL_HTML, target: 'blank_', label: 'GSheet', icon: 'ion-link' },
]
const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
