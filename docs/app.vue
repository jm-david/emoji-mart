<template>

<div>
  <div class="row">
    <h1>Emoji Mart Vue 🏬</h1>
  </div>

  <div class="row">
    <template v-for="set in ['native', 'apple', 'google', 'twitter', 'emojione', 'messenger', 'facebook']">
      <button :key="set" @click="activeSet = set" :disabled="activeSet == set">{{ set }}</button>
    </template>
  </div>

  <div class="row">
    <picker
      :set="activeSet"
      :native="native"
      :custom="custom"
      :emoji="emoji"
      :title="title"
      :showSearch="false"
      :showPreview="false"
    />
  </div>

</div>

</template>

<script>

import { Picker, Emoji } from '../src'

const CUSTOM_EMOJIS = [
  {
    name: 'Party Parrot',
    short_names: ['parrot'],
    keywords: ['party'],
    imageUrl: './images/parrot.gif'
  },
  {
    name: 'Octocat',
    short_names: ['octocat'],
    keywords: ['github'],
    imageUrl: 'https://assets-cdn.github.com/images/icons/emoji/octocat.png?v7'
  },
  {
    name: 'Squirrel',
    short_names: ['shipit', 'squirrel'],
    keywords: ['github'],
    imageUrl: 'https://assets-cdn.github.com/images/icons/emoji/shipit.png?v7'
  },
]

export default {
  data() {
    return {
      activeSet: 'native',
      emoji: 'point_up',
      title: 'Pick your emoji…',
      custom: CUSTOM_EMOJIS
    }
  },
  computed: {
    native () {
      return this.activeSet == 'native'
    }
  },
  components: {
    Picker,
    Emoji
  }
}

</script>

<style scoped>

button + button { margin-left: .5em }
button {
  padding: .4em .6em;
  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, .1);
  background: #fff;
  outline: 0;
  cursor: pointer;
}

button[disabled] {
  border-color: #ae65c5;
  cursor: default;
}

h1 {
  font-family: Courier;
}

.row + .row {
  margin-top: 2em;
}

.row-small {
  margin-top: 1em;
}

.emoji-mart {
  margin: 0 auto;
  text-align: left;
}

.emoji-mart-title-label {
  font-size: 21px;
}

</style>