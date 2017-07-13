<template>
	<div>
		<table class="padded">
			<tr>
				<td><label>Caption:</label></td>
				<td><input type="text" v-model="library.caption"></td>
				<td><label>Id:</label></td>
				<td><input type="text" v-model="library.id"></td>
				<td><button type="button" title="Random Id" @click="createId"><img src="icons/tag.png"></button></td>
				<td><label><input type="checkbox" v-model="library.advanced">Advanced</label></td>
			</tr>
			<tr>
				<td><label>Author:</label></td>
				<td><input type="text" v-model="library.author"></td>
				<td><label>Version:</label></td>
				<td><input type="text" v-model="library.version"></td>
				<td><label>Last changed:</label></td>
				<td><input type="date" :value="library.changed"></td>
			</tr>
		</table>
		<div id="monaco-editor"></div>
	</div>
</template>

<script>
function randomId() {
	return Math.floor(Math.random() * 999000) + 1000;
};

export default {
	props: {
		name: {
			type: String,
			required: true,
			default: "Library"
		},
		library: {
			type: Object,
			default: { }
		}
	},

	data () {
		return {
		};
	},

	methods: {
		createId() {
			this.library.id = randomId();
		}
	}
}
</script>
