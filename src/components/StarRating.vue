<template>
    <div class="ratings text-xs text-teal-dark">
        <span v-for="val in fullStars"
              :key="val">&#9733;</span>
        <span v-for="val in emptyStars"
              :key="val">&#9734;</span>
    </div>

</template>

<script>
export default {
  props: {
    rating: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      maxRating: 5
    }
  },
  computed: {
    fullStars () {
      return Array.from(
        new Array(this.rating),
        (val, index) => index + 1
      )
    },
    emptyStars () {
      return Array.from(
        new Array(this.maxRating - this.rating),
        (val, index) => index + 1 + this.rating
      )
    }
  }
}
</script>
