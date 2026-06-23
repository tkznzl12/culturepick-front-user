<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { loadKakaoMap } from '@/utils/loadKakaoMap'

interface Props {
  latitude: number
  longitude: number
}

const props = defineProps<Props>()

const mapContainer = ref<HTMLDivElement | null>(null)

let map: any = null
let marker: any = null

function createPosition(latitude: number, longitude: number) {
  return new window.kakao.maps.LatLng(latitude, longitude)
}

async function initMap() {
  if (!mapContainer.value) return
  if (!Number.isFinite(props.latitude) || !Number.isFinite(props.longitude)) return

  await loadKakaoMap()

  const position = createPosition(props.latitude, props.longitude)
  map = new window.kakao.maps.Map(mapContainer.value, {
    center: position,
    level: 3,
  })

  marker = new window.kakao.maps.Marker({
    position,
  })
  marker.setMap(map)
}

watch(
  () => [props.latitude, props.longitude] as const,
  ([latitude, longitude]) => {
    if (!map || !marker) return
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return

    const nextPosition = createPosition(latitude, longitude)
    map.setCenter(nextPosition)
    marker.setPosition(nextPosition)
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
  <div ref="mapContainer" class="kakao-map" />
</template>

<style scoped>
.kakao-map {
  width: 100%;
  height: 320px;
  border-radius: 16px;
  overflow: hidden;
}
</style>
