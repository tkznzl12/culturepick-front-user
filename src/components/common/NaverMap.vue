<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { loadNaverMap } from '@/utils/loadNaverMap'

interface Props {
  latitude: number
  longitude: number
  venueName?: string
}

const props = defineProps<Props>()

const mapContainer = ref<HTMLDivElement | null>(null)

let map: any = null
let marker: any = null

function createPosition(latitude: number, longitude: number) {
  return new window.naver.maps.LatLng(latitude, longitude)
}

async function initMap() {
  if (!mapContainer.value) return
  if (!Number.isFinite(props.latitude) || !Number.isFinite(props.longitude)) return

  await loadNaverMap()

  const position = createPosition(props.latitude, props.longitude)
  map = new window.naver.maps.Map(mapContainer.value, {
    center: position,
    zoom: 16,
  })

  marker = new window.naver.maps.Marker({
    position,
    map,
    title: props.venueName ?? '',
  })
}

watch(
  () => [props.latitude, props.longitude, props.venueName] as const,
  ([latitude, longitude, venueName]) => {
    if (!map || !marker) return
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return

    const nextPosition = createPosition(latitude, longitude)
    map.setCenter(nextPosition)
    marker.setPosition(nextPosition)
    marker.setTitle(venueName ?? '')
  },
)

onMounted(() => {
  void initMap()
})

onBeforeUnmount(() => {
  if (marker) {
    marker.setMap(null)
    marker = null
  }

  map = null
})
</script>

<template>
  <div ref="mapContainer" class="naver-map" />
</template>

<style scoped>
.naver-map {
  width: 100%;
  height: 320px;
  border-radius: 16px;
  overflow: hidden;
}
</style>
