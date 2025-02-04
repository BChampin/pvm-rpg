<template>
  <q-page class="bg-grey-2 q-pa-md">
    <div class="row">
      <q-table
        :rows="cptPlayers"
        :columns="columns"
        row-key="name"
        :filter="filter"
        dense
        :loading="store.loading.maps"
        flat
        class="bg-grey-2 fit"
        :pagination="{
          rowsPerPage: 20,
        }"
      >
        <template #loading>
          <LoadingComponent />
        </template>
        <template #top>
          <div class="flex full-width items-center justify-between q-py-md">
            <div class="text-h4 text-primary text-weight-bold">
              {{ i18n('nav.players') }}
            </div>
            <div>Total : {{ store.players.length }} {{ i18n('nav.players') }}</div>
            <q-input v-model="filter" outlined dense debounce="300" placeholder="Search">
              <template #append>
                <q-icon name="search" />
              </template>
            </q-input>
            <div class="flex">
              <q-select
                v-model="categoryFilter"
                :options="categoryOptions"
                :label="i18n('nav.orderBy')"
                outlined
                map-options
                emit-value
                dense
              />
            </div>
          </div>
        </template>
        <template #body="props">
          <q-tr :props="props" class="cursor-pointer" @click="shownPlayer = props.row">
            <q-td key="name" :props="props" class="text-weight-bold">
              {{ props.row.name }}
            </q-td>
            <q-td key="category" :props="props">
              {{ props.row.category }}
            </q-td>
            <q-td key="fame" :props="props">
              <FameChip
                :fame="
                  [
                    props.row.fames?.alien,
                    props.row.fames?.player,
                    props.row.fames?.intermediate,
                    props.row.fames?.noob,
                  ]
                    .filter((f) => !!f)
                    .sort((a, b) => (a.level >= b?.level ? -1 : 1))[0]
                "
              />
            </q-td>
            <q-td key="mapsDone" :props="props">
              {{ props.row.nbRecords }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <PlayerDialog v-if="shownPlayer" :player="shownPlayer" @hide="shownPlayer = null" />
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useSheetStore } from 'src/stores/sheet'
import { useLocalization } from 'src/composables/useLocalization'
import type { QTableColumn } from 'quasar'
import FameChip from 'components/theme/FameChip.vue'
import PlayerDialog from 'components/theme/PlayerDialog.vue'

const store = useSheetStore()
const { i18n } = useLocalization()

const columns: QTableColumn[] = [
  {
    name: 'name',
    field: 'name',
    label: i18n('players.name').toUpperCase(),
    sortable: true,
    align: 'left',
  },
  {
    name: 'category',
    field: 'category',
    label: i18n('nav.category').toUpperCase(),
    sortable: true,
    align: 'left',
  },
  { name: 'fame', field: 'fame', label: 'Fame', sortable: true, align: 'left' },
  {
    name: 'mapsDone',
    field: 'mapsDone',
    label: i18n('players.times').toUpperCase(),
    sortable: true,
    align: 'right',
  },
]

const filter = ref('')
const categoryFilter = ref('all')
const categoryOptions = [
  {
    label: `All - ${store.players.length}`,
    value: 'all',
  },
  {
    label: `Alien - ${store.players.filter((player) => player.category === 'Alien').length}`,
    value: 'Alien',
  },
  {
    label: `Player - ${store.players.filter((player) => player.category === 'Player').length}`,
    value: 'Player',
  },
  {
    label: `Novice - ${store.players.filter((player) => player.category === 'Novice').length}`,
    value: 'Novice',
  },
]

const cptPlayers = computed(() => {
  if (categoryFilter.value === 'all') return store.players
  else return store.players.filter((p) => p.category === categoryFilter.value)
})

const shownPlayer = ref(null)
</script>
