<template>
  <q-page class="bg-grey-2 q-pa-md">
    <div class="row">
      <q-table
        :rows="sortedMaps"
        :columns="columns"
        row-key="name"
        :grid="viewToggle"
        :filter="filter"
        dense
        :loading="store.loading.maps"
        hide-pagination
        flat
        class="bg-grey-2 fit"
        :pagination="{
          rowsPerPage: 0,
        }"
      >
        <template #loading>
          <LoadingComponent />
        </template>
        <template #top>
          <div class="flex full-width items-center justify-between q-py-md">
            <div class="text-h4 text-primary text-weight-bold">
              {{ i18n('nav.maps') }}
            </div>
            <div>Total : {{ store.maps.length }} {{ i18n('nav.maps') }}</div>
            <q-input v-model="filter" outlined dense debounce="300" placeholder="Search">
              <template #append>
                <q-icon name="search" />
              </template>
            </q-input>
            <div class="flex">
              <q-toggle v-model="viewToggle" />
              <q-select
                v-model="sortMethod"
                :options="sortOptions"
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
          <q-tr :props="props">
            <q-td key="label" :props="props" class="text-weight-bold">
              {{ props.row.label }}
            </q-td>
            <q-td key="grade.label" :props="props">
              <GradeChip :grade="props.row.grade" />
            </q-td>
            <q-td key="times.alien" :props="props">
              {{ timeNumberToStr(props.row.times.alien) }}
            </q-td>
            <q-td key="times.player" :props="props">
              {{ timeNumberToStr(props.row.times.player) }}
            </q-td>
            <q-td key="times.intermediate" :props="props">
              {{ timeNumberToStr(props.row.times.intermediate) }}
            </q-td>
            <q-td key="times.noob" :props="props">
              {{ timeNumberToStr(props.row.times.noob) }}
            </q-td>
            <q-td key="exchange.author.name" :props="props">
              {{ props.row.exchange?.author?.name ?? 'Author not found' }}
            </q-td>
            <q-td key="exchange.link" :props="props">
              <a
                v-if="props.row?.exchange?.link !== undefined"
                :href="props.row.exchange.link"
                target="_blank"
                class="flex items-center text-primary link"
              >
                <q-icon name="ion-link" size="sm" class="q-mr-xs" />
                <div>TMX</div>
              </a>
              <span v-else> Link not found :/ </span>
            </q-td>
          </q-tr>
        </template>
        <template #item="props">
          <div class="col-6 col-md-4 col-lg-3 q-pa-sm">
            <MapCard :map="props.row" />
          </div>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useSheetStore } from 'src/stores/sheet'
import LoadingComponent from 'components/ui/LoadingComponent.vue'
import { timeNumberToStr } from 'src/utils'
import GradeChip from 'components/theme/GradeChip.vue'
import MapCard from 'components/theme/MapCard.vue'
import { useLocalization } from 'src/composables/useLocalization'
import type { QTableColumn } from 'quasar'

const { i18n } = useLocalization()
const store = useSheetStore()

const columns: QTableColumn[] = [
  { name: 'label', field: 'label', label: 'Map', sortable: true, align: 'left' },
  { name: 'grade.label', field: 'grade.label', label: 'Grade', sortable: true, align: 'left' },
  { name: 'times.alien', field: 'times.alien', label: 'Alien', sortable: true, align: 'left' },
  { name: 'times.player', field: 'times.player', label: 'Player', sortable: true, align: 'left' },
  {
    name: 'times.intermediate',
    field: 'times.intermediate',
    label: 'Intermediate',
    sortable: true,
    align: 'left',
  },
  { name: 'times.noob', field: 'times.noob', label: 'Noob', sortable: true, align: 'left' },
  {
    name: 'exchange.author.name',
    field: 'exchange.author.name',
    label: 'Author',
    sortable: true,
    align: 'left',
  },
  { name: 'exchange.link', field: 'exchange.link', label: 'Link', sortable: true, align: 'right' },
]
const filter = ref('')

const sortMethod = ref('grade.ascending')
const sortOptions = [
  {
    label: i18n('maps.sort.grade.asc'),
    value: 'grade.ascending',
  },
  {
    label: i18n('maps.sort.grade.desc'),
    value: 'grade.descending',
  },
  {
    label: i18n('maps.sort.alphabetical.asc'),
    value: 'alphabetical.ascending',
  },
  {
    label: i18n('maps.sort.alphabetical.desc'),
    value: 'alphabetical.descending',
  },
  {
    label: i18n('maps.sort.duration.asc'),
    value: 'duration.ascending',
  },
  {
    label: i18n('maps.sort.duration.desc'),
    value: 'duration.descending',
  },
]
const sortedMaps = computed(() => {
  const copyFrom = [...store.maps]
  switch (sortMethod.value) {
    case 'grade.ascending':
      return copyFrom.sort((a, b) => a.grade.level - b.grade.level)
    case 'grade.descending':
      return copyFrom.sort((a, b) => b.grade.level - a.grade.level)
    case 'alphabetical.ascending':
      return copyFrom.sort((a, b) => a.label.localeCompare(b.label))
    case 'alphabetical.descending':
      return copyFrom.sort((a, b) => b.label.localeCompare(a.label))
    case 'duration.ascending':
      return copyFrom.sort((a, b) => a.times.alien - b.times.alien)
    case 'duration.descending':
      return copyFrom.sort((a, b) => b.times.alien - a.times.alien)
  }
  return copyFrom
})
const viewToggle = ref(true)
</script>
