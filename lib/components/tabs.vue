<template>
	<div class="tabs">
		<div class="tab-header">
			<div v-for="tab of tabs"
					class="tab-link no-select"
					:class="{ 'active': (tab === selectedTab) }"
					@click="selectedTab = tab">
				{{tab.name}}
			</div>
		</div>
		<keep-alive>
			<component class="tab etched-border" :is="selectedTab"></component>
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

	data() {
		return {
			selectedTab: this.tabs[0]
		};
	}
}
</script>

<style>
/* Style the tabs root so the header appears on top followed by the visible tab */
.tabs {
	display: flex;
	flex-direction: column;
}

/* We want our tabs to fill the height of this component by default */
.tab {
	flex: 1;
	display: flex;
	flex-flow: column;
}

 /* Style the tab header area */
.tab-header {
	margin-right: 0;
	overflow: hidden;
	border: 1px solid #ccc;
	background-color: #e1e1e1;
}

/* Style the buttons inside the tab header */
.tab-link {
	background-color: inherit;
	float: left;
	border: 1px solid transparent;
	outline: none;
	cursor: pointer;
	padding: 6px 12px;
	transition: 0.1s;
}

/* Change background color of button for selected tab */
.tab-link.active {
	background-color: #fafafa;
	border-left: 1px solid #ccc;
	border-right: 1px solid #ccc;
}

/* Change background color of buttons on hover */
.tab-link:hover {
	background-color: white;
}
</style>
