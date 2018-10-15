import Vue from 'vue'
import App from './app'
import Vuebar from 'vuebar'

Vue.use(Vuebar)

new Vue({
    el: '#app',
    render: h => h(App)
})
