import Tabs from './tabs.vue';
import Combo from './combo.vue';
import Modal from './modal.vue';

export default {
	install(Vue) {
		Vue.component('tabs', Tabs);
		Vue.component('combo', Combo);
		Vue.component('modal', Modal);
	}
}

export { Tabs, Combo, Modal };
