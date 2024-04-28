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

let tiandituToken = ''

if (new Date().getHours() <= 0) {
  tiandituToken = '1262eaa9e27e684b3645819807bdbe0a'
}
else if (new Date().getHours() <= 1) {
  tiandituToken = '931a3a62c4b0818c30a37852faf79090'
}
else if (new Date().getHours() <= 2) {
  //
  tiandituToken = '8ec3f1493c3f0ac0bf34330889700129'
}
else if (new Date().getHours() <= 3) {
  // yzj
  tiandituToken = '614019e3f3000d4b2fdff1308508feee'
}
else if (new Date().getHours() <= 4) {
  // yzj
  tiandituToken = 'b0188a937a6a73de32c3a27ad1fa11c2'
}
else if (new Date().getHours() <= 5) {
  // yzj
  tiandituToken = 'a05545bbaf778c3d529044a1bc0e7c9e'
}
else if (new Date().getHours() <= 6) {
  // yzj
  tiandituToken = 'd927933bc13be8ed3d03e214384b5f6a'
}
else if (new Date().getHours() <= 7 && new Date().getMinutes() <= 20) {
  // yzj
  tiandituToken = '5b6cabe52fd2cdc45388a68caebdff11'
}
else if (new Date().getHours() <= 7 && new Date().getMinutes() <= 40) {
  //
  tiandituToken = '4833053a0fa62824e0d45f0603791cbf'
}
else if (new Date().getHours() <= 7 && new Date().getMinutes() <= 60) {
  //
  tiandituToken = '6ad5201356c14a08ac439d120432113a'
}
else if (new Date().getHours() <= 8 && new Date().getMinutes() <= 20) {
  // hxf
  tiandituToken = '145ae0f41051dd019828009201764a8e'
}
else if (new Date().getHours() <= 8 && new Date().getMinutes() <= 40) {
  // czw
  tiandituToken = 'd98bf73173b93b0e8f9dfbe2fbfd6a9d'
}
else if (new Date().getHours() <= 8 && new Date().getMinutes() <= 60) {
  // czw
  tiandituToken = '970effc0d0fc9c6684a697a311feb1fe'
}
else if (new Date().getHours() <= 9 && new Date().getMinutes() <= 20) {
  // hxf
  tiandituToken = '99ed30b3e81f3452e783e74a6f95ba1f'
}
else if (new Date().getHours() <= 9 && new Date().getMinutes() <= 40) {
  // hxf
  tiandituToken = '133a297557245a2c90dc174db62d715b'
}
else if (new Date().getHours() <= 9 && new Date().getMinutes() <= 60) {
  // czw
  tiandituToken = '933f5fef657f090ae6d219eddf9726e3'
}
else if (new Date().getHours() <= 10 && new Date().getMinutes() <= 20) {
  // hxf
  tiandituToken = 'e08fbb267c37554af6d325d0a9591708'
}
else if (new Date().getHours() <= 10 && new Date().getMinutes() <= 40) {
  // hxf
  tiandituToken = '18522eff16acb285631fa6bad8e386e4'
}
else if (new Date().getHours() <= 10 && new Date().getMinutes() <= 60) {
  // yzq
  tiandituToken = '20705c5187117906d28da0d093cd1488'
}
else if (new Date().getHours() <= 11 && new Date().getMinutes() <= 20) {
  // hxf
  tiandituToken = '2bfa1c73bde471cf7e8945b8608a4b94'
}
else if (new Date().getHours() <= 11 && new Date().getMinutes() <= 40) {
  // hxf
  tiandituToken = 'e1eb1d3c97e317da4627d0f95dc6c73d'
}
else if (new Date().getHours() <= 11 && new Date().getMinutes() <= 60) {
  // hxf
  tiandituToken = 'b413f808ec9717538011ede0b1116566'
}
else if (new Date().getHours() <= 12 && new Date().getMinutes() <= 30) {
  // pgm
  tiandituToken = '88e96071463a5bc0c4483c36729f35f5'
}
else if (new Date().getHours() <= 12 && new Date().getMinutes() <= 60) {
  //
  tiandituToken = '18f884d0479682d64bca50467ef0ca42'
}
else if (new Date().getHours() <= 13 && new Date().getMinutes() <= 30) {
  // pgm
  tiandituToken = '7eda0243304f5824ec76ac5fe0376642'
}
else if (new Date().getHours() <= 13 && new Date().getMinutes() <= 60) {
  //
  tiandituToken = '50c2888b6a33dabf89ae42a00bb2fb4d'
}
else if (new Date().getHours() <= 14 && new Date().getMinutes() <= 20) {
  // pgm
  tiandituToken = 'd6557fd49268a1b8d79ca884e1a996dc'
}
else if (new Date().getHours() <= 14 && new Date().getMinutes() <= 40) {
  //
  tiandituToken = '8a7bbadfbba271e407af5fa9187a50d7'
}
else if (new Date().getHours() <= 14 && new Date().getMinutes() <= 60) {
  //
  tiandituToken = 'e7e3169110980343c3b207dac3aa9c93'
}
else if (new Date().getHours() <= 15 && new Date().getMinutes() <= 20) {
  // pgm
  tiandituToken = 'd53c97909b4f94deaa2ecc8b1c5ffbd3'
}
else if (new Date().getHours() <= 15 && new Date().getMinutes() <= 40) {
  //
  tiandituToken = '29d3696e7784be79253d5488e2a944a9'
}
else if (new Date().getHours() <= 15 && new Date().getMinutes() <= 60) {
  //
  tiandituToken = '103b5de733bdf94c0c270c5bd8d5e1bc'
}
else if (new Date().getHours() <= 16 && new Date().getMinutes() <= 30) {
  // pgm
  tiandituToken = '748fa0b36c8f74629658bc3c6d3b68ea'
}
else if (new Date().getHours() <= 16 && new Date().getMinutes() <= 60) {
  //
  tiandituToken = '66a6fc693a1dd19ddf4d6eff75d01837'
}
else if (new Date().getHours() <= 17 && new Date().getMinutes() <= 30) {
  // hxr
  tiandituToken = '34a9fb79e76e934e6b07bc5e8a06e288'
}
else if (new Date().getHours() <= 17 && new Date().getMinutes() <= 60) {
  //
  tiandituToken = '9b2aa6ea23a4ab371d33c362f80ff718'
}
else if (new Date().getHours() <= 18 && new Date().getMinutes() <= 30) {
  // hxr
  tiandituToken = 'ec230d443f819e4e9f1dd115c8ac2e9b'
}
else if (new Date().getHours() <= 18 && new Date().getMinutes() <= 60) {
  // hxr
  tiandituToken = '0da477f81f5d1369b9d7f1dae572fc67'
}
else if (new Date().getHours() <= 19 && new Date().getMinutes() <= 30) {
  // hxr
  tiandituToken = 'b772738afc87f8a5514ef72db68c075c'
}
else if (new Date().getHours() <= 19 && new Date().getMinutes() <= 60) {
  // hxr
  tiandituToken = '581865ba62cfb0bbd8b55c0f48eb950c'
}
else if (new Date().getHours() <= 20 && new Date().getMinutes() <= 30) {
  // hxr
  tiandituToken = 'd246321cfdb8f106a55df4daa017d1ca'
}
else if (new Date().getHours() <= 20 && new Date().getMinutes() <= 60) {
  // hxr
  tiandituToken = '4566545e2e0f717b7c5cdc6df1196cb3'
}
else if (new Date().getHours() <= 21 && new Date().getMinutes() <= 30) {
  // hxr
  tiandituToken = '1fcf1bb8efee4f315fa86302972a0ed1'
}
else if (new Date().getHours() <= 21 && new Date().getMinutes() <= 60) {
  // hxr
  tiandituToken = '59dd2b64f395c552eab55796467fb4c8'
}
else if (new Date().getHours() <= 22 && new Date().getMinutes() <= 30) {
  // czw
  tiandituToken = '8f070bd10d7c3a7c3967a5e677b72674'
}
else if (new Date().getHours() <= 22 && new Date().getMinutes() <= 60) {
  // czw
  tiandituToken = 'a34c9d872bbfc731e6784445891be690'
}
else if (new Date().getHours() <= 23 && new Date().getMinutes() <= 30) {
  // czw
  tiandituToken = '9da35e31a434262eaa41e032d9338757'
}
else if (new Date().getHours() <= 23 && new Date().getMinutes() <= 60) {
  // czw
  tiandituToken = '173eba255cbfaa4048fe663ff3772f96'
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
    width: 64vw;
    height: 32px;
    position: absolute;
    top: 50px;
    left: 50%;
    transform: translate(-50%, 0);
    z-index: 1000;
    display: flex;
    input {
      padding-left: 8px;
      padding-right: 8px;
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
