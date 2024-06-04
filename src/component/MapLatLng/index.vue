<script setup>
import { nextTick, onMounted, ref } from 'vue'
import { showToast } from 'vant'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { LIcon, LMap, LMarker, LTileLayer } from '@vue-leaflet/vue-leaflet'
import { searchLocation } from '@/apis/index.js'

const props = defineProps({
  selectArea: {
    type: [Array, String],
    default: () => [],
  },
  selectAddr: {
    type: String,
    default: '',
  },
  selectLat: { // 纬度
    type: String,
    default: '',
  },
  selectLng: { // 经度
    type: String,
    default: '',
  },
  setHandleOk: {
    type: Function,
  },
})

const emits = defineEmits(['finishCallback'])

const currentLat = ref(props.selectLat)

const currentLng = ref(props.selectLng)

const leafletObj = ref(null)

const makerList = ref([])

const keyword = ref(`${props.selectArea?.join('')}${props.selectAddr}`)

let tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'

if (new Date().getHours() <= 0) {
  tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'
}
else if (new Date().getHours() <= 1) {
  tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'
}
else if (new Date().getHours() <= 2) {
  //
  tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'
}
else if (new Date().getHours() <= 3) {
  // yzj
  tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'
}
else if (new Date().getHours() <= 4) {
  // yzj
  tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'
}
else if (new Date().getHours() <= 5) {
  // yzj
  tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'
}
else if (new Date().getHours() <= 6) {
  // yzj
  tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'
}
else if (new Date().getHours() <= 7 && new Date().getMinutes() <= 20) {
  // yzj
  tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'
}
else if (new Date().getHours() <= 7 && new Date().getMinutes() <= 40) {
  //
  tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'
}
else if (new Date().getHours() <= 7 && new Date().getMinutes() <= 60) {
  //
  tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'
}
else if (new Date().getHours() <= 8 && new Date().getMinutes() <= 20) {
  // hxf
  tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'
}
else if (new Date().getHours() <= 8 && new Date().getMinutes() <= 40) {
  // czw
  tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'
}
else if (new Date().getHours() <= 8 && new Date().getMinutes() <= 60) {
  // czw
  tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'
}
else if (new Date().getHours() <= 9 && new Date().getMinutes() <= 20) {
  // hxf
  tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'
}
else if (new Date().getHours() <= 9 && new Date().getMinutes() <= 40) {
  // hxf
  tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'
}
else if (new Date().getHours() <= 9 && new Date().getMinutes() <= 60) {
  // czw
  tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'
}
else if (new Date().getHours() <= 10 && new Date().getMinutes() <= 20) {
  // hxf
  tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'
}
else if (new Date().getHours() <= 10 && new Date().getMinutes() <= 40) {
  // hxf
  tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'
}
else if (new Date().getHours() <= 10 && new Date().getMinutes() <= 60) {
  // yzq
  tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'
}
else if (new Date().getHours() <= 11 && new Date().getMinutes() <= 20) {
  // hxf
  tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'
}
else if (new Date().getHours() <= 11 && new Date().getMinutes() <= 40) {
  // hxf
  tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'
}
else if (new Date().getHours() <= 11 && new Date().getMinutes() <= 60) {
  // hxf
  tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'
}
else if (new Date().getHours() <= 12 && new Date().getMinutes() <= 30) {
  // pgm
  tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'
}
else if (new Date().getHours() <= 12 && new Date().getMinutes() <= 60) {
  //
  tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'
}
else if (new Date().getHours() <= 13 && new Date().getMinutes() <= 30) {
  // pgm
  tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'
}
else if (new Date().getHours() <= 13 && new Date().getMinutes() <= 60) {
  //
  tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'
}
else if (new Date().getHours() <= 14 && new Date().getMinutes() <= 20) {
  // pgm
  tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'
}
else if (new Date().getHours() <= 14 && new Date().getMinutes() <= 40) {
  //
  tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'
}
else if (new Date().getHours() <= 14 && new Date().getMinutes() <= 60) {
  //
  tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'
}
else if (new Date().getHours() <= 15 && new Date().getMinutes() <= 20) {
  // pgm
  tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'
}
else if (new Date().getHours() <= 15 && new Date().getMinutes() <= 40) {
  //
  tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'
}
else if (new Date().getHours() <= 15 && new Date().getMinutes() <= 60) {
  //
  tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'
}
else if (new Date().getHours() <= 16 && new Date().getMinutes() <= 30) {
  // pgm
  tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'
}
else if (new Date().getHours() <= 16 && new Date().getMinutes() <= 60) {
  //
  tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'
}
else if (new Date().getHours() <= 17 && new Date().getMinutes() <= 30) {
  // hxr
  tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'
}
else if (new Date().getHours() <= 17 && new Date().getMinutes() <= 60) {
  //
  tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'
}
else if (new Date().getHours() <= 18 && new Date().getMinutes() <= 30) {
  // hxr
  tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'
}
else if (new Date().getHours() <= 18 && new Date().getMinutes() <= 60) {
  // hxr
  tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'
}
else if (new Date().getHours() <= 19 && new Date().getMinutes() <= 30) {
  // hxr
  tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'
}
else if (new Date().getHours() <= 19 && new Date().getMinutes() <= 60) {
  // hxr
  tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'
}
else if (new Date().getHours() <= 20 && new Date().getMinutes() <= 30) {
  // hxr
  tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'
}
else if (new Date().getHours() <= 20 && new Date().getMinutes() <= 60) {
  // hxr
  tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'
}
else if (new Date().getHours() <= 21 && new Date().getMinutes() <= 30) {
  // hxr
  tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'
}
else if (new Date().getHours() <= 21 && new Date().getMinutes() <= 60) {
  // hxr
  tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'
}
else if (new Date().getHours() <= 22 && new Date().getMinutes() <= 30) {
  // czw
  tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'
}
else if (new Date().getHours() <= 22 && new Date().getMinutes() <= 60) {
  // czw
  tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'
}
else if (new Date().getHours() <= 23 && new Date().getMinutes() <= 30) {
  // czw
  tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'
}
else if (new Date().getHours() <= 23 && new Date().getMinutes() <= 60) {
  // czw
  tiandituToken = 'cf7c95cc566c9c6f47d11c8cd67ec73d'
}

const mapTileLayerUrl = `http://t{s}.tianditu.gov.cn/DataServer?T=vec_c&x={x}&y={y}&l={z}&tk=${tiandituToken}`

const textTileLayerUrl = `http://t{s}.tianditu.gov.cn/DataServer?T=cva_c&X={x}&Y={y}&L={z}&tk=${tiandituToken}`

const EPSG4490 = L.extend({}, L.CRS, {
  code: 'EPSG:4490',
  projection: L.Projection.LonLat,
  transformation: new L.Transformation(1 / 360, 0.5, -1 / 360, 0.25),
  distance(pointA, pointB) {
    const rad = Math.PI / 180
    const lat1 = pointA.lat * rad
    const lat2 = pointB.lat * rad
    const sinDLat = Math.sin(((pointB.lat - pointA.lat) * rad) / 2)
    const sinDLon = Math.sin(((pointB.lng - pointA.lng) * rad) / 2)
    const a = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return this.R * c
  },
})

const config = ref({
  zoom: 14,
  crs: EPSG4490,
  center: [29.984433, 120.3],
})

const drawMaker = (currentLat, currentLng) => {
  L.popup({ closeButton: false }).setLatLng({
    lat: currentLat,
    lng: currentLng,
  }).setContent(`经度：${currentLng}<br/>纬度：${currentLat}`).openOn(leafletObj.value)
  makerList.value = [{
    latitude: currentLat,
    longitude: currentLng,
  }]
}

const onMapReady = (leafletObject) => {
  leafletObj.value = leafletObject

  L.control.scale({ metric: true, imperial: false }).addTo(leafletObject)

  const { selectLat, selectLng } = props
  if (selectLat && selectLng) {
    config.value.center = [Number(selectLat), Number(selectLng)]
    currentLat.value = selectLat
    currentLng.value = selectLng
    drawMaker(currentLat.value, currentLng.value)
  }
  leafletObject.on('click', (e) => {
    const { lat, lng } = e.latlng
    if (lat && lng) {
      currentLat.value = (Number(lat)).toFixed(6)
      currentLng.value = (Number(lng)).toFixed(6)
      drawMaker(currentLat.value, currentLng.value)
    }
  })
}

const handleSearch = () => {
  if (!keyword.value) {
    showToast('请输入地址')
    return
  }
  searchLocation({ ds: JSON.stringify({ keyWord: keyword.value }), tk: tiandituToken }).then((res) => {
    if (res?.data?.location) {
      const { lat, lon } = res?.data?.location
      if (lat && lon) {
        currentLat.value = (Number(lat)).toFixed(6)
        currentLng.value = (Number(lon)).toFixed(6)
        config.value.center = [Number(currentLat.value), Number(currentLng.value)]
        drawMaker(currentLat.value, currentLng.value)
      }
    }
    else {
      showToast('未查询到相关地址的经纬度！')
    }
  })
}

onMounted(() => {
  props.setHandleOk && props.setHandleOk((finishFn) => {
    if (currentLat.value && currentLng.value) {
      emits('finishCallback', currentLat.value, currentLng.value)
      finishFn()
    }
    else {
      showToast('请选择经纬度')
    }
  })
  const { selectLat, selectLng, selectAddr, selectArea } = props
  if (selectLat && selectLng) {
    nextTick(() => {
      config.value.center = [Number(selectLat), Number(selectLng)]
    })
  }
  else if (selectAddr && selectArea) {
    searchLocation({ ds: JSON.stringify({ keyWord: `${selectArea?.join('')}${selectAddr}` }), tk: tiandituToken }).then((res) => {
      if (res?.data?.location) {
        const { lat, lon } = res?.data?.location
        if (lat && lon) {
          currentLat.value = (Number(lat)).toFixed(6)
          currentLng.value = (Number(lon)).toFixed(6)
          config.value.center = [Number(lat), Number(lon)]
          drawMaker(currentLat.value, currentLng.value)
        }
      }
    })
  }
  else if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      config.value.center = [position.coords.latitude, position.coords.longitude]
    })
  }
})

defineOptions({
  name: 'MapLatLng',
})
</script>
<template>
  <div ref="tmap" class="map-latlng">
    <LMap
      class="leaflet-map"
      :zoom="config.zoom"
      :crs="config.crs"
      :center="config.center"
      :zoom-animation="true"
      :options="{ zoomControl: true, zoomSnap: 0.1, attributionControl: false }"
      @ready="onMapReady"
    >
      <!-- 地图图形瓦片层 -->
      <LTileLayer :url="mapTileLayerUrl" subdomains="01234567" />
      <!-- 地图文字瓦片层 -->
      <LTileLayer :url="textTileLayerUrl" subdomains="01234567" />

      <LMarker
        v-for="item in makerList"
        :key="item.latitude"
        :options="{ interactive: true }"
        :lat-lng="[item.latitude, item.longitude]"
      >
        <LIcon :icon-size="[0, 0]">
          <div class="store-point" />
        </LIcon>
      </LMarker>
    </LMap>
    <div class="search-input">
      <input
        v-model="keyword"
        placeholder="请输入地址"
        style="width: 100%"
      />
      <div class="search-btn" @click="handleSearch">搜索</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.map-latlng {
  height: 100%;
  position: relative;
  .leaflet-map {
    background: none;
    :deep(.leaflet-layer) {
      opacity: 0.6;
      filter: url('#x-rays');
    }
    :deep(.leaflet-popup-content) {
      width: 180px !important;
      font-size: 18px;
    }
    .store-point {
      width: 12px;
      height: 20px;
      border-radius: 6px;
      border: none;
      // background-color: #FF4D16;
      background: url("../../assets/images/icon_map.png") no-repeat;
      background-size: 100% 100%;
      margin-left: -6px;
      margin-top: -6px;
    }
  }
  .search-input {
    width: 72vw;
    height: 32px;
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translate(-50%, 0);
    z-index: 1000;
    display: flex;
    input {
      padding-left: 8px;
      padding-right: 8px;
      border: 1px solid #ebebeb;
      border-top-left-radius: 2px;
      border-bottom-left-radius: 2px;
    }
    .search-btn {
      width: 64px;
      font-size: 14px;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #2F6BFF;
      border-top-right-radius: 2px;
      border-bottom-right-radius: 2px;
    }
  }
}
</style>
