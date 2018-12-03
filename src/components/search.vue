<template>

<div class="emoji-mart-search">
  <input type="text" :placeholder="i18n.search" v-model="value">
</div>

</template>

<script>

import NimbleEmojiIndex from '../utils/emoji-index/nimble-emoji-index'

export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    i18n: {
      type: Object,
      required: true
    },
    maxResults: {
      type: Number,
      default: 75
    },
    autoFocus: {
      type: Boolean,
      default: false
    },
    emojisToShowFilter: {
      type: Function
    },
    include: {
      type: Array
    },
    exclude: {
      type: Array
    },
    custom: {
      type: Array
    }
  },
  data() {
    return {
      value: ''
    }
  },
  computed: {
    emojiIndex() {
      return new NimbleEmojiIndex(this.data)
    }
  },
  watch: {
    value() {
      let emojis = this.emojiIndex.search(this.value, {
        emojisToShowFilter: this.emojisToShowFilter,
        maxResults: this.maxResults,
        include: this.include,
        exclude: this.exclude,
        custom: this.custom
      })

      this.$emit('search', emojis)
    }
  },
  methods: {
    clear() {
      this.value = ''
    }
  },
  mounted() {
    let $input = this.$el.querySelector('input')

    if (this.autoFocus) {
      $input.focus()
    }
  }
}

</script>
