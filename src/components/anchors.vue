<template>

<div class="emoji-mart-anchors">
  <span
    v-for="category in categories"
    :key="category.id"
    :class="{ 'emoji-mart-anchor': true, 'emoji-mart-anchor-selected': category.id == activeCategory.id }"
    :style="{ 'color': (category.id == activeCategory.id ? color : '') }"
    :title="i18n.categories[category.id]"
    @click="$emit('click', category)">
    <div v-html="svgs[category.id]"/>
    <span class="emoji-mart-anchor-bar" :style="{ backgroundColor: color }"></span>
  </span>
</div>

</template>

<script>

import svgs from '../svgs'

export default {
  props: {
    i18n: {
      type: Object,
      required: true
    },
    color: {
      type: String
    },
    categories: {
      type: Array,
      required: true
    },
    activeCategory: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  created() {
    this.svgs = svgs
  }
}

</script>
