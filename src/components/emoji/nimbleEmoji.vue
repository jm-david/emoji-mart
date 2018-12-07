<template>

<span v-if="canRender" class="emoji-mart-emoji" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave" @click="onClick">
  <span v-if="isCustom" :title="title" :style="customEmojiStyles"></span>
  <span v-else-if="isNative" :title="title" :style="nativeEmojiStyles">{{ nativeEmoji }}</span>
  <span v-else-if="hasEmoji" :title="title" :style="fallbackEmojiStyles"></span>
  <span v-else>{{ fallbackEmoji }}</span>
</span>

</template>

<script>

import { getData, getSanitizedData, unifiedToNative } from '../../utils'
import { uncompress } from '../../utils/data'
import { EmojiProps } from '../../utils/shared-props'

const SHEET_COLUMNS = 52

export default {
  props: {
    ...EmojiProps,
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    if (this.data.compressed) {
      uncompress(this.data)
    }

    return {
      mutableData: this.data
    }
  },
  computed: {
    emojiData() {
      return getData(this.emoji, this.skin, this.set, this.mutableData)
    },
    sanitizedData() {
      return getSanitizedData(this.emoji, this.skin, this.set, this.mutableData)
    },
    canRender() {
      return this.isCustom || this.isNative || this.hasEmoji || this.fallback
    },
    isNative() {
      return this.native
    },
    isCustom() {
      return this.emojiData.custom
    },
    hasEmoji() {
      return this.emojiData['has_img_' + this.set]
    },
    nativeEmoji() {
      if (this.emojiData.unified) {
        return unifiedToNative(this.emojiData.unified)
      } else {
        return ''
      }
    },
    fallbackEmoji() {
      return this.fallback ? this.fallback(this.emoji) : null
    },
    nativeEmojiStyles() {
      let styles = { fontSize: this.size + 'px' }

      if (this.forceSize) {
        styles.display = 'inline-block'
        styles.width = this.size + 'px'
        styles.height = this.size + 'px'
      }

      return styles
    },
    fallbackEmojiStyles() {
      if (this.isCustom) {
        return this.customEmojiStyles
      } else if (this.hasEmoji) {
        return {
          display: 'inline-block',
          width: this.size + 'px',
          height: this.size + 'px',
          backgroundImage: 'url(' + this.backgroundImageFn(this.set, this.sheetSize) + ')',
          backgroundSize: (100 * SHEET_COLUMNS) + '%',
          backgroundPosition: this.getPosition()
        }
      } else {
        return null
      }
    },
    customEmojiStyles() {
      return {
        display: 'inline-block',
        width: this.size + 'px',
        height: this.size + 'px',
        backgroundImage: 'url(' + this.emojiData.imageUrl + ')',
        backgroundSize: '100%',
      }
    },
    title() {
      return this.tooltip ? this.emojiData.short_names[0] : null
    }
  },
  methods: {
    getPosition() {
      let multiply = 100 / (SHEET_COLUMNS - 1),
          x = multiply * this.emojiData.sheet_x,
          y = multiply * this.emojiData.sheet_y

      return `${x}% ${y}%`
    },
    onClick() {
      this.$emit('click', this.sanitizedData)
    },
    onMouseEnter() {
      this.$emit('mouseenter', this.sanitizedData)
    },
    onMouseLeave() {
      this.$emit('mouseleave', this.sanitizedData)
    }
  }
}

</script>

<style scoped>

.emoji-mart-emoji {
  position: relative;
  display: inline-block;
  font-size: 0;
}

</style>
