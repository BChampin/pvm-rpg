<template>
  <q-dialog v-model="showDialog">
    <q-card class="my-br" style="min-width: 70vw">
      <q-card-section>
        <div class="flex justify-between item-center">
          <div class="flex items-center">
            <q-avatar color="primary" text-color="secondary">{{
              props.player.name.slice(0, 1)
            }}</q-avatar>
            <div class="text-h4 q-ml-md">{{ props.player.name }}</div>
          </div>
          <div class="flex items-center">
            <div class="text-weight-medium text-nowrap">
              {{ totalMedals }} / {{ store.maps.length * 4 }}
            </div>
            <MedalGroup />
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row text-h6">Overall fame</div>
        <div class="row justify-around">
          <q-card v-for="[lvl, fame] of Object.entries(player.fames)" :key="lvl">
            <q-card-section>
              <div class="flex column text-center">
                {{ lvl }}
              </div>
              <FameChip :fame="fame" />
              <div class="flex items-center">
                <MedalComponent :level="getLevel(lvl)" />
                <div class="text-weight-medium text-nowrap">
                  {{ fame.level }} / {{ store.maps.length }}
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row text-h6">{{ i18n('players.times') }}</div>
        <q-expansion-item
          v-for="cat of categorizedDoneMaps"
          :key="cat.grade.level"
          expand-separator
          :label="`${cat.grade.label} - ${cat.categoryTimes.length} / ${cat.nbPerGrade}`"
          group="playerLvlGroup"
        >
          <div v-if="cat.missingMaps.length" class="row text-h6">{{ i18n('players.times') }}</div>
          <div class="row">
            <div v-for="(obj, i) of cat.categoryTimes" :key="i" class="col-6 col-sm-4">
              <div class="flex items-center no-wrap q-gutter-x-sm">
                <a :href="obj.map.exchange.link ?? 'https://trackmania.exchange/'" class="link">
                  {{ obj.map.label }}
                </a>
                <span>-</span>
                <span>{{ timeNumberToStr(obj.playerMapTime.time) }}</span>
              </div>
              <MedalGroup :map="obj.map" :time="obj.playerMapTime.time" />
            </div>
          </div>
          <template v-if="cat.missingMaps.length">
            <div class="row text-h6">{{ i18n('players.missing') }}</div>
            <div class="row">
              <div v-for="(map, i) of cat.missingMaps" :key="i" class="col-6 col-sm-4">
                <div class="flex items-center no-wrap q-gutter-x-sm">
                  <a :href="map.exchange.link ?? 'https://trackmania.exchange/'" class="link">
                    {{ map.label }}
                  </a>
                </div>
              </div>
            </div>
          </template>
        </q-expansion-item>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useSheetStore } from 'src/stores/sheet'
import { computed, ref } from 'vue'
import type { Map, MapGrade, Player, TimeRecord } from 'src/types/Sheet'
import { getLevel } from 'src/types/Sheet'
import MedalGroup from 'components/theme/MedalGroup.vue'
import MedalComponent from 'components/theme/MedalComponent.vue'
import FameChip from 'components/theme/FameChip.vue'
import { useLocalization } from 'src/composables/useLocalization'
import { timeNumberToStr } from 'src/utils'

const store = useSheetStore()
const { i18n } = useLocalization()

const props = defineProps<{
  player: Player
}>()

const showDialog = ref(true)

const totalMedals = computed(
  () =>
    (props.player.fames.alien?.level ?? 0) +
    (props.player.fames.player?.level ?? 0) +
    (props.player.fames.intermediate?.level ?? 0) +
    (props.player.fames.noob?.level ?? 0),
)

const categorizedDoneMaps = computed(() => {
  const playerTimeRecords = store.timeRecords.filter(
    (timeRecord) => timeRecord.playerId === props.player.id,
  )

  const categorizedDoneMaps: {
    grade: MapGrade
    nbPerGrade: number
    categoryTimes: { map: Map; playerMapTime: TimeRecord }[]
    missingMaps: Map[]
  }[] = []

  store.maps.forEach((map) => {
    const playerMapTime = playerTimeRecords.find((ptr) => ptr.mapId === map.exchange.id)
    let gradeIndex = categorizedDoneMaps.findIndex((cdm) => cdm.grade.level === map.grade.level)

    // Init category
    if (gradeIndex < 0) {
      categorizedDoneMaps.push({
        grade: map.grade,
        nbPerGrade: store.maps.filter((sm) => sm.grade.level === map.grade.level).length,
        categoryTimes: [],
        missingMaps: [],
      })
    }
    gradeIndex = categorizedDoneMaps.findIndex((cdm) => cdm.grade.level === map.grade.level)

    if (playerMapTime) {
      categorizedDoneMaps[gradeIndex]?.categoryTimes?.push({
        map,
        playerMapTime,
      })
    } else {
      categorizedDoneMaps[gradeIndex]?.missingMaps.push(map)
    }
  })
  return categorizedDoneMaps
})
</script>
