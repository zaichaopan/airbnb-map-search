<template>
    <div class="flex flex-col p-1">
        <div class="slide-container"
             ref="slide">
            <div class="slide">
                <slot name="slide"></slot>
            </div>
            <div class="indicators">
                <span v-for="(item, index) in indicators"
                      :key="index">
                    &#x25cf;
                </span>
            </div>
            <button class="prev">&#x2039;</button>
            <button class="next">&#x203A;</button>
        </div>
        <slot name="info"></slot>
    </div>
</template>

<script>
import { initSlide } from '../utils/siema-slide';

export default {
  props: {
    totalItems: {
      type: Number,
      required: true
    }
  },
  computed: {
    indicators () {
      return Array.from(
        new Array(this.totalItems),
        (val, index) => index + 1
      );
    }
  },
  mounted () {
    initSlide(this.$refs.slide, 'prev', 'next', 'slide', 'indicators');
  }
};
</script>

<style lang="scss" scoped>
.slide-container {
    position: relative;
    .slide {
        width: 100%;
    }
    &:hover {
        button {
            color: white;
        }
        .slide {
            filter: brightness(85%);
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
}
</style>
