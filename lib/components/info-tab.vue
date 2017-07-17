<template>
	<div>
		<table class="padded">
			<tr>
				<td><label>Author:</label></td>
				<td><input type="text" v-model="library.author"></td>
				<td><label>Version:</label></td>
				<td><input type="text" v-model="library.version"></td>
				<td><label>Last changed:</label></td>
				<td><input type="date" :value="localizedChanged" disabled></td>
			</tr>
		</table>
		<textarea class="info-textarea" v-model="library.info"></textarea>
	</div>
</template>

<script>
export default {
	name: "Information",

	computed: {
		library() {
			return this.$root.library;
		},

		localizedChanged() {
			var epoch = new Date(1899,11,29,23,59,59).getTime();
			var ms = this.library.changed * (24 * 60 * 60 * 1000);
			return (new Date(ms + epoch)).toLocaleString();
		}
	}
}
</script>

<style>
.info-textarea {
	height: 512px;
	resize: vertical;
}
</style>
