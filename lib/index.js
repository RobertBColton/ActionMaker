import Vue from 'vue';

import './index.css';
import Tabs from './components/tabs.js';
import Application from './application.vue';

Vue.use(Tabs);

var app = new Vue({
	el: '#application',
	render: h => h(Application)
});
