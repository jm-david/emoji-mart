<template>

<div :class="{ 'emoji-mart-category': true, 'emoji-mart-no-results': !hasResults }" v-if="isVisible && (isSearch || hasResults)">
  <div class="emoji-mart-category-label">
    <span>{{ i18n.categories[id] }}</span>
  </div>

  <nimble-emoji
    v-for="emoji in emojis"
    :key="emoji.id || emoji"
    :data="data"
    :emoji="emoji"
    :native="emojiProps.native"
    :skin="emojiProps.skin"
    :set="emojiProps.set"
    :size="emojiProps.size"
    :sheet-size="emojiProps.sheetSize"
    :force-size="emojiProps.forceSize"
    :tooltip="emojiProps.tooltip"
    :background-image-fn="emojiProps.backgroundImageFn"
    @click="emojiProps.onClick"
    @mouseenter="emojiProps.onEnter"
    @mouseleave="emojiProps.onLeave"
  />

  <div v-if="!hasResults">
    <nimble-emoji
      :data="data"
      :size="emojiProps.size"
      emoji="sleuth_or_spy"
      :native="emojiProps.native"
      :skin="emojiProps.skin"
      :set="emojiProps.set"
      :sheet-size="emojiProps.sheetSize"
      :background-image-fn="emojiProps.backgroundImageFn"
    />
    <div class="emoji-mart-no-results-label">{{ i18n.notfound }}</div>
  </div>
</div>

</template>

<script>

import NimbleEmoji from './emoji/nimbleEmoji'

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
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    emojis: {
      type: Array
    },
    emojiProps: {
      type: Object,
      required: true
    }
  },
  computed: {
    isVisible() {
      return !!this.emojis
    },
    isSearch() {
      return this.name == 'Search'
    },
    hasResults() {
      return this.emojis.length > 0
    }
  },
  components: {
    NimbleEmoji
  }
}

</script>
