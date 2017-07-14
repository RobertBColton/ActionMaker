<template>
	<div>
		<table class="padded">
			<tr>
				<td><label>Author:</label></td>
				<td><input type="text" v-model="library.author"></td>
				<td><label>Version:</label></td>
				<td><input type="text" v-model="library.version"></td>
				<td><label>Last changed:</label></td>
				<td><input type="date" :value="library.changed"></td>
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
