
import Vue from 'vue';
import ActionMaker from './ActionMaker.vue';

export default function() {
  var app = new Vue({
    el: '#ActionMaker',
    render: h => h(ActionMaker)
  });
}
