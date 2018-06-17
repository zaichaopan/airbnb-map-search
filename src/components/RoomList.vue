<template>
    <div class="room-list">
        <div class="flex flex-wrap">
            <div v-for="(room, index) in rooms"
                 :key="index"
                 :class="gridClass">
                <room-item :room="room"
                           @room:hovered="$emit('room:hovered', room)"
                           @room:unhovered="$emit('room:unhovered')"></room-item>
            </div>
        </div>
    </div>
</template>

<script>
import RoomItem from './RoomItem'

export default {
  components: { RoomItem },
  props: {
    rooms: {
      type: Array,
      default () {
        return []
      }
    },
    gridClass: {
      type: String,
      default: 'w-1/3'
    }
  }
}
</script>
