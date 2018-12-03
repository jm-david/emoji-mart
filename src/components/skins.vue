<template>

<div :class="{ 'emoji-mart-skin-swatches': true, 'emoji-mart-skin-swatches-opened': opened }">
  <span v-for="skinTone in 6" :key="skinTone" :class="{ 'emoji-mart-skin-swatch': true, 'emoji-mart-skin-swatch-selected': skin == skinTone }">
    <span :class="'emoji-mart-skin emoji-mart-skin-tone-' + skinTone" @click="onClick(skinTone)"></span>
  </span>
</div>

</template>

<script>

export default {
  props: {
    skin: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      opened: false
    }
  },
  methods: {
    onClick(skinTone) {
      if (this.opened) {
        if (skinTone != this.skin) {
          this.$emit('change', skinTone)
        }
      }

      this.opened = !this.opened
    }
  }
}

</script>
