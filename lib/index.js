import Vue from 'vue';

import './index.css';
import Components from './components/index.js';
import Application from './application.vue';
import Library from './library.js';

Vue.use(Components);

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
