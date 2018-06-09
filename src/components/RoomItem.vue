<template>
    <div class="flex flex-col p-1 mb-4"
         @mouseover="$emit('room:hovered', room)"
         @mouseleave="$emit('room:unhovered')">
        <siema-slide :total-items="room.images.length">
            <template slot="slide">
                <a href="#"
                   v-for="(img,index) in room.images"
                   :key="index">
                    <img :src="img"
                         :alt="room.name"
                         class="rounded w-full">
                </a>
            </template>

            <div slot="info">
                <div class="font-semibold py-1">{{ room.name}}</div>
                <div class="text-sm">${{room.price}} CAD per month</div>
                <div class="py-2">
                    <star-rating :rating="room.rating"></star-rating>
                </div>
            </div>
        </siema-slide>
    </div>
</template>

<script>
import SiemaSlide from './SiemaSlide';
import StarRating from './StarRating';

export default {
  components: {
    SiemaSlide,
    StarRating
  },
  props: {
    room: {
      type: Object,
      required: true
    }
  }
};
</script>
