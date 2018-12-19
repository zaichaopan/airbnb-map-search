
<template>
  <div id="app">
    <div class="flex nav">
      <div class="flex w-full bg-white search-container fixed items-center">
        <div class="search-input lg:w-1/2 w-full">
          <address-autocomplete
            v-model="place"
            custom-class="flex w-full shadow appearance-none border rounded text-grey-dark items-center"
          ></address-autocomplete>
        </div>
      </div>
    </div>
    <div
      class="flex w-full p-6 items-center border-t border-b border-grey-light fixed filter-container"
    >
      <div class="flex items-center ml-auto">
        <span class="mr-2">Show Map</span>
        <div class="w-10">
          <toggle-switch v-model="showMap"/>
        </div>
      </div>
    </div>
    <div class="flex pt-4 room-map-container">
      <div class="h-12 py-2 px-4" :class="[showMap? 'w-2/3':'w-full']">
        <div class="pl-2 mb-2">
          <div class="font-semibold text-2xl">{{roomListTitle}}</div>
        </div>
        <room-list
          :rooms="rooms"
          @room:hovered="handleRoomHovered"
          @room:unhovered="handleRoomUnhovered"
          :grid-class="showMap? 'w-1/3': 'w-1/5'"
        ></room-list>
        <div class="flex mt-4 h-32 justify-center">
          <simple-paginator
            :meta="roomMeta"
            v-if="roomMeta"
            @pagination:switched="fetchRooms"
            :pages-per-section="3"
          ></simple-paginator>
        </div>
      </div>
      <div class="w-1/3 py-2 pr-4 fixed pin-r" :class="{'map-before': !showMap }">
        <room-map
          @bounds:changed="handleBoundsChanged"
          :rooms="rooms"
          :hovered-room="hoveredRoom"
          :center="center"
          :lat="place.lat"
          :lng="place.lng"
        ></room-map>
      </div>
    </div>
  </div>
</template>

<script>
import roomApi from './api/rooms'
import RoomMap from './components/RoomMap'
import RoomList from './components/RoomList'
import ToggleSwitch from './components/ToggleSwitch'
import SimplePaginator from './components/SimplePaginator'
import AddressAutocomplete from './components/AddressAutocomplete'

export default {
  name: 'App',
  components: {
    RoomMap,
    RoomList,
    ToggleSwitch,
    SimplePaginator,
    AddressAutocomplete
  },
  props: {
    defaultLat: {
      type: Number,
      default: 49.16679
    },
    defaultLng: {
      type: Number,
      default: -123.138385
    },
    defaultAddress: {
      type: String,
      default: 'CF Richmond Centre, Number 3 Road, Richmond, BC, Canada'
    }
  },
  data () {
    return {
      place: {
        lat: this.defaultLat,
        lng: this.defaultLng,
        address: this.defaultAddress
      },
      rooms: [],
      hoveredRoom: null,
      roomMeta: null,
      mapBounds: null,
      showMap: true
    }
  },
  computed: {
    center () {
      return {
        lat: this.place.lat,
        lng: this.place.lng
      }
    },
    roomListTitle () {
      let title = ''
      switch (true) {
      case this.roomMeta === null:
        title = 'loading ...'
        break
      case this.roomMeta.total === 0:
        title = 'No results'
        break
      case this.roomMeta.total === 1:
        title = '1 result'
        break
      default:
        title = `${this.roomMeta.total} results`
        break
      }
      return title
    }
  },
  methods: {
    handleBoundsChanged ({ mapBounds }) {
      this.mapBounds = mapBounds
      this.fetchRooms(1)
    },
    getBounds () {
      return {
        minLat: this.mapBounds.getSouthWest().lat(),
        maxLat: this.mapBounds.getNorthEast().lat(),
        minLng: this.mapBounds.getSouthWest().lng(),
        maxLng: this.mapBounds.getNorthEast().lng()
      }
    },
    async fetchRooms (page = 1) {
      try {
        let { minLat, maxLat, minLng, maxLng } = this.getBounds()
        let res = await roomApi.getAll(`/api/rooms?page=${page}&min_lng=${minLng}&max_lng=${maxLng}&min_lat=${minLat}&max_lat=${maxLat}`)
        this.rooms = res.data
        this.roomMeta = res.meta
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } catch (e) {
        console.log(e)
      }
    },
    handleRoomHovered (room) {
      this.hoveredRoom = room
    },
    handleRoomUnhovered () {
      this.hoveredRoom = null
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  .search-container {
    top: 0;
    height: 80px;
    background: white;
    z-index: 10;
  }
  .filter-container {
    top: 80px;
    background: white;
    z-index: 10;
  }
  .room-map-container {
    margin-top: 140px;
  }
  .map-before {
    position: absolute;
    left: -1000%;
  }
  .map-after {
    position: relative;
  }
}
</style>
