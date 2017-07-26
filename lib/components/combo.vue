<template>
    <select class="combo" v-model="selected"> 
      <option v-for="(item, key) in items" :value="item">{{key}}</option>
    </select>
</template>

<script>
export default {
	props: {
		items: {
			type: Object,
			required: true
		},

		value: {}
	},

	computed: {
		selected: {
			get () {
				return this.value;
			},
			set (value) {
				this.$emit('input', value);
			}
		}
	}
}
</script>
