<template>
    <click-outside :do="() => focus = false">
        <div class="autocomplete-container relative"
             :class="customClass">
            <svg height="32"
                 class="w-6 h-6 fill-current octicon octicon-search search-icon absolute"
                 viewBox="0 0 16 16"
                 version="1.1"
                 width="32"
                 aria-hidden="true">
                <path fill-rule="evenodd"
                      d="M15.7 13.3l-3.81-3.83A5.93 5.93 0 0 0 13 6c0-3.31-2.69-6-6-6S1 2.69 1 6s2.69 6 6 6c1.3 0 2.48-.41 3.47-1.11l3.83 3.81c.19.2.45.3.7.3.25 0 .52-.09.7-.3a.996.996 0 0 0 0-1.41v.01zM7 10.7c-2.59 0-4.7-2.11-4.7-4.7 0-2.59 2.11-4.7 4.7-4.7 2.59 0 4.7 2.11 4.7 4.7 0 2.59-2.11 4.7-4.7 4.7z">
                </path>
 ,
            </svg>
            <input name="place"
                   class="search-input py-3 flex-1 appearance-none"
                   ref="pacInput"
                   v-model="place.address"
                   @keydown="handleKeyDown"
                   @focus="focus=true"
                   placeholder="Anywhere">
            <span class="p-2 cursor-pointer"
                  v-if="showClearIcon"
                  @click="clearAddress">X</span>
        </div>
    </click-outside>
</template>

<script>
import ClickOutside from './ClickOutside';
import loadGoogleMapsApi from '../utils/load-google-map-api';

export default {
  components: {
    ClickOutside
  },
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          address: '',
          lat: 0.0,
          lng: 0.0
        };
      }
    },
    customClass: {
      type: String,
      required: false
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dropdown: null,
      input: null,
      googoleMaps: null,
      place: {
        lat: this.value.lat,
        lng: this.value.lng,
        address: this.shortAddress(this.value.address)
      },
      focus: false
    };
  },
  computed: {
    showClearIcon () {
      return this.focus && this.place.address.length > 0;
    }
  },
  methods: {
    autocomplete () {
      this.input = this.$refs.pacInput;
      this.dropdown = new this.googleMaps.places.Autocomplete(this.input);
      this.dropdown.addListener('place_changed', () => {
        let place = this.dropdown.getPlace();
        let address = this.input.value;
        this.input.value = this.shortAddress(address);
        let lat = place.geometry.location.lat();
        let lng = place.geometry.location.lng();
        this.$emit('input', { address, lat, lng });
      });
    },
    handleKeyDown (e) {
      if (e.keyCode === 13) e.preventDefault();
    },
    clearAddress () {
      this.place.address = '';
      this.$emit('input', {
        address: '',
        lat: this.value.lat,
        lng: this.value.lng
      });
    },
    shortAddress (address) {
      let addArr = address.split(',');
      if (addArr.length < 5) {
        return address;
      }
      addArr.length = 3;
      return addArr.join(',');
    }
  },
  mounted () {
    loadGoogleMapsApi({
      key: 'AIzaSyAEaJj6Mxw1SXjAdfiOAbnZtDxC3gA3PS4',
      libraries: ['places']
    })
      .then(googleMaps => {
        this.googleMaps = googleMaps;
        this.autocomplete();
      })
      .catch(error => {
        console.error(error);
      });
  }
};
</script>

<style  lang="scss">
.pac-container {
  z-index: 10060 !important;
  border-radius: 5px;
  padding: 5px;
}
.search-icon {
  left: 8px;
}
.search-input {
  padding-left: 40px;
  &:focus {
    outline: none;
    border: none;
  }
}
.pac-item {
  border: none;
  padding: 5px;
  &:hover {
    background-color: #cdeeeb;
  }
}
.pac-item-selected {
  background-color: #cdeeeb;
}
</style>
