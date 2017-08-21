<template>
	<div>
		<table class="padded expand-last-column">
			<tr>
				<td><label>Author</label></td>
				<td><input type="text" v-model="library.author"></td>
				<td><label>Version</label></td>
				<td><input type="text" v-model="library.version"></td>
				<td><label>Last changed</label></td>
				<td><input type="text" :value="lastChanged" disabled></td>
			</tr>
		</table>
		<monaco class="code-editor etched-border" v-model="library.info"/>
	</div>
</template>

<script>
import Library from '../library';

export default {
	name: "Information",

	computed: {
		library() {
			return this.$root.library;
		},

		lastChanged() {
			return Library.fromOADate(this.library.changed).toLocaleString();
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
