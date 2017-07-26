import Tabs from './tabs.vue';
import Combo from './combo.vue';

export default {
	install(Vue) {
		Vue.component('tabs', Tabs);
		Vue.component('combo', Combo);
	}
}

export { Tabs, Combo };
