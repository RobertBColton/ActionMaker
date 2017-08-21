import Vue from 'vue';

import './index.css';
import Components from './components/index.js';
import MonacoEditor from 'vue-monaco';

import Application from './application.vue';
import Library from './library.js';

Vue.use(Components);
Vue.component('monaco', MonacoEditor);

new Vue({
	el: '#application',
	render: h => h(Application),
	data: {
		name: "ActionMaker",
		library: Library.newLibrary()
	},

	computed: {
		caption() {
			return this.library.caption;
		}
	},

	watch: {
		caption(val, old) {
			document.title = this.caption + " - ActionMaker";
		}
	}
});
