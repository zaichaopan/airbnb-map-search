<template>
    <div class="map-container">
        <div class="map"
             ref="map"></div>
    </div>
</template>

<script>
import infoWindowHelper from '../utils/room-map-infowindow';
import loadGoogleMapsApi from '../utils/load-google-map-api';
import markWithLabel from '../utils/marker-with-label';

export default {
  props: {
    center: {
      type: Object,
      validator (value) {
        return ['lat', 'lng'].every(
          key => ~Object.keys(value).indexOf(key)
        );
      }
    },
    rooms: {
      type: Array,
      default () {
        return [];
      }
    },
    hoveredRoom: {
      type: Object,
      default () {
        return {};
      }
    }
  },
  data () {
    return {
      map: null,
      googoleMaps: null,
      MarkerWithLabel: null,
      infoWindow: null,
      markers: [],
      zoom: 10,
      mapFullyLoaded: false
    };
  },
  watch: {
    rooms () {
      this.clearMarkers();
      this.addMarkers();
      this.createInfoWindow();
    },
    center: {
      deep: true,
      handler: 'resetCenter'
    },
    hoveredRoom: {
      deep: true,
      handler: 'handleHoveredRoom'
    }
  },
  methods: {
    initMap () {
      this.map = new this.googleMaps.Map(this.$refs.map, {
        zoom: this.zoom,
        zoomControl: true,
        zoomControlOptions: {
          position: window.google.maps.ControlPosition.LEFT_TOP
        },
        center: this.center
      });
      this.MarkerWithLabel = markWithLabel(this.googleMaps);
      this.infoWindow = new this.googleMaps.InfoWindow();
    },
    resetCenter () {
      this.mapFullyLoaded = false;
      this.map.setCenter(new this.googleMaps.LatLng(this.center));
    },
    addEvenListeners () {
      ['zoom_changed', 'dragend'].forEach(event =>
        this.map.addListener(event, () => this.handleMapChanged())
      );
      this.map.addListener('bounds_changed', () =>
        this.handleMapFullyLoaded()
      );
    },
    handleMapChanged () {
      this.infoWindow.close();
      this.$emit('bounds:changed', { mapBounds: this.map.getBounds() });
    },
    handleMapFullyLoaded () {
      if (this.mapFullyLoaded) {
        return;
      }
      this.mapFullyLoaded = true;
      this.handleMapChanged();
    },
    handleHoveredRoom () {
      this.markers.forEach(marker => {
        if (this.hoveredRoom === null) {
          return (
            ~marker.labelClass.indexOf('hovered') &&
                        this.resetLabelClass(marker, 'map-price-container')
          );
        }
        if (marker.room.id === this.hoveredRoom.id) {
          return this.resetLabelClass(
            marker,
            'map-price-container-hovered'
          );
        }
        ~marker.labelClass.indexOf('hovered') &&
                    this.resetLabelClass(marker, 'map-price-container');
      });
    },
    clearMarkers () {
      this.markers.forEach(marker => {
        marker.setMap(null);
      });
    },
    addMarkers () {
      this.markers = this.rooms.map(room => {
        let { lat, lng } = room;
        const marker = new this.MarkerWithLabel(
          this.getMarkerLabelOptions({ lat, lng }, room, this.map)
        );
        marker.room = room;
        return marker;
      });
    },
    resetLabelClass (marker, lableClass) {
      marker.labelClass = lableClass;
      marker.label.setStyles();
    },
    getMarkerLabelOptions (
      position,
      room,
      map,
      lableContentClass = 'map-price-marker'
    ) {
      return {
        position,
        draggable: false,
        raiseOnDrag: true,
        icon: ' ',
        map,
        labelContent: `<div class="${lableContentClass}"><span>$${
          room.price
        }</span></div>`,
        labelClass: 'map-price-container'
      };
    },
    removeInfoWindowWhiteSpace () {
      infoWindowHelper.removeWhiteSpace();
    },
    handleInfoWindowDomReady (infoWindow) {
      this.googleMaps.event.addListener(infoWindow, 'domready', () => {
        infoWindowHelper.removeWhiteSpace();
        infoWindowHelper.initSlides(
          'siema-container',
          'prev',
          'next',
          'siema',
          'indicators'
        );
      });
    },
    resetInfoWindow () {
      this.infoWindow =
                this.infoWindow && new this.googleMaps.InfoWindow();
      return this.infoWindow;
    },
    createInfoWindow () {
      const vm = this;
      const infoWindow = this.resetInfoWindow();
      this.map.addListener('click', event => infoWindow.close());
      this.handleInfoWindowDomReady(this.infoWindow);
      this.markers.forEach(marker =>
        marker.addListener('click', function () {
          infoWindow.setContent(
            infoWindowHelper.getContentHtml(this)
          );
          infoWindow.open(vm.map, this);
        })
      );
    }
  },
  mounted () {
    loadGoogleMapsApi({
      key: 'AIzaSyAEaJj6Mxw1SXjAdfiOAbnZtDxC3gA3PS4',
      libraries: ['places']
    })
      .then(googleMaps => {
        this.googleMaps = googleMaps;
        this.initMap();
        this.addEvenListeners();
      })
      .catch(error => {
        console.error(error);
      });
  }
};
</script>

<style  lang="scss">
.map-container {
  width: 100%;
}
.map {
  width: 100%;
  height: 550px;
  position: fixed;
}
.map-price-container {
  overflow: visible !important;
  .map-price-marker {
    background-color: white;
    color: black;
  }
}
.map-price-container-hovered {
  overflow: visible !important;
  .map-price-marker {
    background-color: rgb(0, 132, 137);
    color: white;
  }
}
.map-price-marker {
  position: absolute;
  left: -37px;
  top: -25px;
  width: 70px;
  height: 25px;
  border-radius: 3px;
  line-height: 15px;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.07);
  font-size: 12px;
  font-weight: 700;
  border: 1px solid #ddd;
  z-index: 1;
  padding: 5px;
  &::after {
    position: absolute;
    content: "";
    border-style: solid;
    left: 31px;
    top: 19px;
    border-width: 5px;
    border-color: white transparent transparent;
  }
}
.info-window {
  background: white;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.07);
  margin-bottom: 5px;
  .info {
    padding: 10px;
    text-align: left;
    width: 280px;
    overflow-wrap: break-word;
    .title {
      font-size: 18px;
      font-weight: 500;
      padding-bottom: 5px;
    }
  }
  &:before {
    position: absolute;
    content: "";
    border-style: solid;
    left: 44%;
    bottom: -10px;
    border-width: 10px;
    border-color: white transparent transparent;
  }
}
.siema-container {
  position: relative;
  &:hover {
    button {
      color: white;
    }
    .siema {
      filter: brightness(85%);
    }
  }
  .siema {
    height: 186px;
    width: 280px;
  }
  .indicators {
    text-align: center;
    color: #b3b3b3;
    position: absolute;
    bottom: 5px;
    left: 0;
    right: 0;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      padding: 0px 5px;
    }
    .active {
      color: #e6e6e6;
      display: inline-block;
    }
  }
  .prev,
  .next {
    font-size: 45px;
    border: none;
    background: rgba(0, 0, 0, 0);
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    color: transparent;
    cursor: pointer;
    &:focus {
      outline: none;
    }
  }
  .prev {
    left: 5%;
  }
  .next {
    right: 5%;
  }
}
// remove close icon
.gm-style-iw + div {
  display: none;
}
.gm-style-iw {
  top: 42px !important;
}
</style>
