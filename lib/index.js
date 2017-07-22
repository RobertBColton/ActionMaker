import Vue from 'vue';

import './index.css';
import Components from './components/index.js';
import Application from './application.vue';

Vue.use(Components);

function randomId() {
	return Math.floor(Math.random() * 999000) + 1000;
};

function Library() {
	var library = {
		caption: '',
		id: randomId(),
		initializationCode: '',
		advanced: false,
		author: '',
		version: 100,
		changed: 0,
		info: 'Here you can enter basic information about your library and what it does.\n',
		actions: [ ]
	};
	return library;
};

var app = new Vue({
	el: '#application',
	render: h => h(Application),
	data: {
		name: "ActionMaker",
		library: Library()
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
