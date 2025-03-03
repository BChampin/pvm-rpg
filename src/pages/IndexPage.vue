<template>
  <q-page>
    <div class="row justify-center text-center bg-image">
      <div class="column q-pt-xl q-mt-xl">
        <div class="text-h4 text-weight-medium">
          {{ i18n('home.welcome') }}
        </div>
        <h1
          class="text-primary text-no-wrap text-weight-medium q-mt-xs"
          :class="$q.screen.lt.md ? 'text-h2' : 'text-h1'"
        >
          PVM-RPG
        </h1>
      </div>
      <div class="row full-width justify-evenly text-center q-mb-xl text-secondary">
        <q-card class="my-br bg-primary">
          <q-card-section :class="$q.screen.lt.md ? 'q-pa-md' : 'q-pa-lg'">
            <LoadingComponent v-if="store.loading.maps" />
            <div v-else class="text-weight-bold" :class="$q.screen.lt.md ? 'text-h3' : 'text-h2'">
              {{ store.maps.length }}
            </div>
            <div>{{ i18n('nav.maps') }}</div>
          </q-card-section>
        </q-card>
        <q-card class="my-br bg-primary">
          <q-card-section :class="$q.screen.lt.md ? 'q-pa-md' : 'q-pa-lg'">
            <LoadingComponent v-if="store.loading.players" />
            <div v-else class="text-weight-bold" :class="$q.screen.lt.md ? 'text-h3' : 'text-h2'">
              {{ store.players.length }}
            </div>
            <div>{{ i18n('nav.players') }}</div>
          </q-card-section>
        </q-card>
        <q-card class="my-br bg-primary">
          <q-card-section :class="$q.screen.lt.md ? 'q-pa-md' : 'q-pa-lg'">
            <LoadingComponent v-if="store.loading.timeRecords" />
            <div v-else class="text-weight-bold" :class="$q.screen.lt.md ? 'text-h3' : 'text-h2'">
              {{ store.timeRecords.length }}
            </div>
            <div>{{ i18n('nav.records') }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="text-primary flex justify-center q-pa-lg">
      <div class="container container-large">
        <div class="flex items-center q-gutter-md">
          <q-icon name="ion-information-circle-outline" size="lg" />
          <div class="text-h6">{{ i18n('home.intro.title') }}</div>
        </div>
        <q-separator class="q-my-sm" />
        <div>
          <p>{{ i18n('home.intro.p1') }}</p>
          <p>{{ i18n('home.intro.p2') }}</p>
        </div>
      </div>
    </div>

    <div class="bg-primary text-secondary flex justify-center q-pa-lg">
      <div class="container container-large">
        <div class="flex items-center q-gutter-md">
          <q-icon name="ion-map" size="lg" />
          <div class="text-h6">{{ i18n('home.objective.title') }}</div>
        </div>
        <q-separator class="q-my-sm" />
        <div>
          <p>{{ i18n('home.objective.p1') }}</p>
          <p>{{ i18n('home.objective.p2') }}</p>
        </div>
      </div>
    </div>

    <div class="text-primary flex justify-center q-pa-lg">
      <div class="container container-large">
        <div class="flex items-center q-gutter-md">
          <q-icon name="ion-help" size="lg" />
          <div class="text-h6">{{ i18n('home.howto.title') }}</div>
        </div>
        <q-separator class="q-my-sm" />
        <div>
          <p class="text-subtitle2 q-mb-md">
            {{ i18n('home.howto.categories.title') }}
          </p>
          <ul>
            <li class="q-mb-sm">{{ i18n('home.howto.categories.p1') }}</li>
            <li class="q-mb-sm">{{ i18n('home.howto.categories.p2') }}</li>
            <li class="q-mb-sm">{{ i18n('home.howto.categories.p3') }}</li>
          </ul>
        </div>
        <q-separator class="q-my-sm" />
        <div>
          <p class="text-subtitle2 q-mb-md">
            {{ i18n('home.howto.times.title') }}
          </p>
          <ul>
            <li class="q-mb-sm">{{ i18n('home.howto.times.p1') }}</li>
            <li class="q-mb-sm">{{ i18n('home.howto.times.p2') }}</li>
            <li class="q-mb-sm">
              {{ i18n('home.howto.times.p3') }}
              <span class="text-weight-bold">Name</span>
              {{ i18n('home.howto.times.p4') }}
            </li>
            <li class="q-mb-sm">{{ i18n('home.howto.times.p5') }}</li>
            <li class="q-mb-sm">{{ i18n('home.howto.times.p6') }}</li>
            <li class="q-mb-sm">{{ i18n('home.howto.times.p7') }}</li>
          </ul>
        </div>
        <q-separator class="q-my-sm" />
        <div>
          <p class="text-subtitle2 q-mb-md">
            {{ i18n('home.howto.tips.title') }}
          </p>
          <p>
            {{ i18n('home.howto.tips.p1') }}
            <span class="text-weight-bold">/list</span>
            {{ i18n('home.howto.tips.p2') }}
          </p>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import LoadingComponent from 'components/ui/LoadingComponent.vue'
import { useSheetStore } from 'src/stores/sheet'
import { useLocalization } from 'src/composables/useLocalization'
const store = useSheetStore()
const { i18n } = useLocalization()
</script>

<style scoped>
.bg-image {
  position: relative;
  z-index: 1;
}

.bg-image:before {
  background-image: url(./images/home_bg_1.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  content: ' ';
  position: absolute;
  z-index: -1;
  opacity: 0.4;
  width: 100%;
  height: 100%;
}
</style>
