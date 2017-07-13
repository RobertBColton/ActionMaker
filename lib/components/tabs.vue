<template>
	<div class="tabs">
		<div class="tab-header">
			<button v-for="tab in tabs"
					class="tab-button"
					:class="{ 'is-selected': (tab === selectedTab) }"
					@click="selectedTab = tab">
				{{ tab.props['name'].default }}
			</button>
		</div>
		<keep-alive>
			<component class="etched-border" v-bind:is="selectedTab"></component>
		</keep-alive>
	</div>
</template>

<script>
export default {
	props: {
		tabs: {
			type: Array,
			required: true
		}
	},

	data () {
		return { selectedTab: undefined };
	},

	mounted() {
		this.selectedTab = this.tabs[0];
	}
}
</script>
