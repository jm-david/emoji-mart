<template>

<div class="emoji-mart" :style="customStyles">
  <div class="emoji-mart-bar" v-if="showCategories">
    <anchors
      :data="parsedData"
      :i18n="mergedI18n"
      :color="color"
      :categories="filteredCategories"
      :active-category="activeCategory"
      @click="onAnchorClick"
    />
  </div>

  <search
    v-if="showSearch"
    ref="search"
    :data="parsedData"
    :i18n="mergedI18n"
    :emojis-to-show-filter="emojisToShowFilter"
    :include="include"
    :exclude="exclude"
    :custom="customEmojis"
    :recent="recentEmojis"
    :auto-focus="autoFocus"
    @search="onSearch"
  />

  <div v-bar>
      <div class="emoji-mart-scroll" ref="scroll" @scroll="onScroll">
        <category
            v-show="searchEmojis"
            :data="parsedData"
            :i18n="mergedI18n"
            id="search"
            name="Search"
            :emojis="searchEmojis"
            :emoji-props="emojiProps"
        />
          <category
              v-for="category in filteredCategories"
              v-show="!searchEmojis && (infiniteScroll || category == activeCategory)"
              ref="categories"
              :key="category.id"
              :data="parsedData"
              :i18n="mergedI18n"
              :id="category.id"
              :name="category.name"
              :emojis="category.emojis"
              :emoji-props="emojiProps"
          />
      </div>
  </div>


  <div class="emoji-mart-bar" v-if="showPreview">
    <preview
      :data="parsedData"
      :title="title"
      :emoji="previewEmoji"
      :idle-emoji="emoji"
      :show-skin-tones="showSkinTones"
      :emoji-props="emojiProps"
      :skin-props="skinProps"
      @change="onSkinChange"
    />
  </div>
</div>

</template>

<script>

import '../../vendor/raf-polyfill'
import store from '../../utils/store'
import frequently from '../../utils/frequently'
import { deepMerge, measureScrollbar } from '../../utils'
import { uncompress } from '../../utils/data'
import { PickerProps } from '../../utils/shared-props'
import Anchors from '../anchors'
import Category from '../category'
import Preview from '../preview'
import Search from '../search'

const RECENT_CATEGORY = { id: 'recent', name: 'Recent', emojis: null }
const CUSTOM_CATEGORY = { id: 'custom', name: 'Custom', emojis: [] }

const I18N = {
  search: 'Search',
  notfound: 'No Emoji Found',
  categories: {
    search: 'Search Results',
    recent: 'Frequently Used',
    people: 'Smileys & People',
    nature: 'Animals & Nature',
    foods: 'Food & Drink',
    activity: 'Activity',
    places: 'Travel & Places',
    objects: 'Objects',
    symbols: 'Symbols',
    flags: 'Flags',
    custom: 'Custom',
  },
}

function makeCustomEmoji(emoji) {
  return Object.assign({}, emoji, {
    id: emoji.short_names[0],
    custom: true
  })
}

export default {
  props: {
    ...PickerProps,
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    let customEmojis = this.custom.map(makeCustomEmoji),
        recentEmojis = this.recent || frequently.get(this.perLine)

    if (recentEmojis.length) {
      recentEmojis = recentEmojis.map((id) => {
        for (let customEmoji of customEmojis) {
          if (customEmoji.id === id) {
            return customEmoji
          }
        }

        return id
      })
    }

    if (this.emojisToShowFilter) {
      customEmojis = customEmojis.filter(e => this.emojisToShowFilter(this.parsedData.emojis[e] || e))
      recentEmojis = recentEmojis.filter(e => this.emojisToShowFilter(this.parsedData.emojis[e] || e))
    }

    return {
      activeSkin: this.skin || store.get('skin') || this.defaultSkin,
      categories: [],
      activeCategory: null,
      previewEmoji: null,
      searchEmojis: null,
      customEmojis: customEmojis,
      recentEmojis: recentEmojis
    }
  },
  computed: {
    parsedData() {
      return this.data.compressed ? uncompress(this.data) : this.data
    },
    customStyles() {
      return {
        width: this.calculateWidth + 'px',
        ...this.pickerStyles
      }
    },
    emojiProps() {
      return {
        native: this.native,
        skin: this.activeSkin,
        size: this.emojiSize,
        set: this.set,
        sheetSize: this.sheetSize,
        forceSize: this.native,
        tooltip: this.emojiTooltip,
        backgroundImageFn: this.backgroundImageFn,
        onEnter: this.onEmojiEnter.bind(this),
        onLeave: this.onEmojiLeave.bind(this),
        onClick: this.onEmojiClick.bind(this)
      }
    },
    skinProps() {
      return {
        skin: this.activeSkin
      }
    },
    calculateWidth() {
      return (this.perLine * (this.emojiSize + 12)) + 12 + 2 + measureScrollbar()
    },
    filteredCategories() {
      return this.categories.filter((category) => {
        let isIncluded = this.include && this.include.length ? this.include.indexOf(category.id) > -1 : true
        let isExcluded = this.exclude && this.exclude.length ? this.exclude.indexOf(category.id) > -1 : false
        let hasEmojis = category.emojis.length > 0

        if (this.emojisToShowFilter) {
          hasEmojis = category.emojis.some((emoji) => {
            return this.emojisToShowFilter(this.parsedData.emojis[emoji] || emoji)
          })
        }

        return isIncluded && !isExcluded && hasEmojis
      })
    },
    mergedI18n() {
      return deepMerge(I18N, this.i18n)
    }
  },
  created() {
    let categories = this.parsedData.categories.map(c => {
      let { id, name, emojis } = c

      if (this.emojisToShowFilter) {
        emojis = c.emojis.filter(e => this.emojisToShowFilter(this.parsedData.emojis[e] || e))
      }

      return { id, name, emojis }
    })

    RECENT_CATEGORY.emojis = this.recentEmojis
    CUSTOM_CATEGORY.emojis = this.customEmojis

    this.categories.push(RECENT_CATEGORY)
    this.categories.push(...categories)
    this.categories.push(CUSTOM_CATEGORY)

    this.categories[0].first = true
    this.activeCategory = this.filteredCategories[0]
  },
  methods: {
    onScroll() {
      if (this.infiniteScroll && !this.waitingForPaint) {
        this.waitingForPaint = true
        window.requestAnimationFrame(this.onScrollPaint.bind(this))
      }
    },
    onScrollPaint() {
      this.waitingForPaint = false

      let scrollTop = this.$refs.scroll.scrollTop,
          activeCategory = this.filteredCategories[0]

      for (let i = 0, l = this.filteredCategories.length; i < l; i++) {
        let category = this.filteredCategories[i],
            component = this.$refs.categories[i]

        if (component && component.$el.offsetTop > scrollTop) {
          break
        }

        activeCategory = category
      }

      this.activeCategory = activeCategory
    },
    onAnchorClick(category) {
      let i = this.filteredCategories.indexOf(category),
          component = this.$refs.categories[i],
          scrollToComponent = () => {
            if (component) {
              let top = component.$el.offsetTop

              if (category.first) {
                top = 0
              }

              this.$refs.scroll.scrollTop = top
            }
          }

      if (this.searchEmojis) {
        this.onSearch(null)
        this.$refs.search.clear()

        this.$nextTick(scrollToComponent)
      } else if (this.infiniteScroll) {
        scrollToComponent()
      } else {
        this.activeCategory = this.filteredCategories[i];
      }
    },
    onSearch(emojis) {
      this.searchEmojis = emojis
    },
    onEmojiEnter(emoji) {
      if (emoji.custom) {
        // Use Array.prototype.find() when it is more widely supported.
        const customEmoji = this.customEmojis.filter(_emoji => _emoji.id === emoji.id)[0]
        emoji = Object.assign({}, emoji, customEmoji)
      }

      this.previewEmoji = emoji
    },
    onEmojiLeave(emoji) {
      this.previewEmoji = null
    },
    onEmojiClick(emoji) {
      this.$emit('select', emoji)
      frequently.add(emoji)
    },
    onSkinChange(skin) {
      this.activeSkin = skin
      store.update({ skin })

      this.$emit('skin-change', skin)
    }
  },
  components: {
    Anchors,
    Category,
    Preview,
    Search
  }
}

</script>

<style>


.emoji-mart,
.emoji-mart * {
  box-sizing: border-box;
  line-height: 1.15;
}

.emoji-mart .emoji-mart-emoji {
  padding: 6px;
}

</style>

<style scoped>
/*@import "~@/scss/vuebar";*/

.emoji-mart {
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  height: 420px;
  color: white;
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  /*background: #fff;*/
  background-color: #302f2f;
}

.emoji-mart-bar {
  flex: 0;
  border: 0 solid #d9d9d9;
}

.emoji-mart-bar:first-child {
  border-bottom-width: 1px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}

.emoji-mart-bar:last-child {
  border-top-width: 1px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}

.emoji-mart-search {
  flex: 0;
}

.emoji-mart-scroll {
  position: relative;
  overflow-y: scroll;
  flex: 1;
  padding: 0 6px 6px 6px;
  z-index: 0; /* Fix for rendering sticky positioned category labels on Chrome */
  will-change: transform; /* avoids "repaints on scroll" in mobile Chrome */
  -webkit-overflow-scrolling: touch;
}

.emoji-mart /deep/ .vb > .vb-content {
  /* needs to be important because inline style was overwriting */
  height: calc(100% - 49px) !important;
}

.emoji-mart /deep/ .vb > .vb-dragger {
  z-index: 5;
  width: 12px;
  right: 0;
}

.emoji-mart /deep/ .vb > .vb-dragger > .vb-dragger-styler {
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-transform: rotate3d(0,0,0,0);
  transform: rotate3d(0,0,0,0);
  -webkit-transition:
      background-color 100ms ease-out,
      margin 100ms ease-out,
      height 100ms ease-out;
  transition:
      background-color 100ms ease-out,
      margin 100ms ease-out,
      height 100ms ease-out;
  background-color: rgba(121, 122, 125,.1);
  margin: 5px 5px 5px 0;
  border-radius: 20px;
  height: calc(100% - 10px);
  display: block;
}

.emoji-mart /deep/ .vb.vb-scrolling-phantom > .vb-dragger > .vb-dragger-styler {
  background-color: rgba(121, 122, 125,.7);
}

.emoji-mart /deep/ .vb > .vb-dragger:hover > .vb-dragger-styler {
  background-color: rgba(121, 122, 125,.9);
  margin: 0px;
  height: 100%;
}

.emoji-mart /deep/ .vb.vb-dragging > .vb-dragger > .vb-dragger-styler {
  background-color: rgba(121, 122, 125,.9);
  margin: 0px;
  height: 100%;
}

.emoji-mart /deep/ .vb.vb-dragging-phantom > .vb-dragger > .vb-dragger-styler {
  background-color: rgba(121, 122, 125,.9);
}


</style>
