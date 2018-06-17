<template>
    <div class="checkbox-container">
        <label class="custom-checkbox">
            <input type="checkbox"
                   v-model="checked"
                   class="checkbox" />
            <div class="slider">
                <div class="slider-body"></div>
                <div class="slider-ball"></div>
            </div>
        </label>
    </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      checked: this.value
    }
  },
  watch: {
    checked () {
      this.$emit('input', this.checked)
    }
  }
}
</script>

<style scoped lang="scss">
.checkbox-container {
  position: relative;
  .custom-checkbox {
    cursor: pointer;
    position: absolute;
    -webkit-transform: translate(0, -50%);
    .slider-body {
      width: 48px;
      height: 30px;
      border-radius: 99999px;
      background-color: #e6e6e6;
    }
    .checkbox {
      display: none;
      &:checked + .slider .slider-ball {
        left: 18px;
        background-color: #fff;
        -webkit-transition: all 0.3s ease-in-out;
        transition: all 0.3s ease-in-out;
      }
      &:checked + .slider .slider-ball:before {
        content: "✔";
        color: rgb(0, 132, 137);
      }
      &:checked + .slider .slider-body {
        background-color: rgb(0, 132, 137);
      }
    }
    .slider-ball {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      top: 0px;
      left: 0px;
      width: 30px;
      height: 30px;
      border-radius: 99999px;
      border: 1px solid #dddd;
      background-color: #fff;
      -webkit-transition: all 0.3s ease-in-out;
      transition: all 0.3s ease-in-out;
      &:before {
        content: "X";
        font-weight: bold;
        display: block;
        width: 30px;
        font-size: 0.8em;
        text-align: center;
        line-height: 26px;
        color: #222;
      }
    }
  }
}
</style>
