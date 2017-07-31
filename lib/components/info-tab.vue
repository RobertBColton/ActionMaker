<template>
	<div>
		<table id="info-table" class="padded">
			<tr>
				<td><label>Author</label></td>
				<td><input type="text" v-model="library.author"></td>
				<td><label>Version</label></td>
				<td><input type="text" v-model="library.version"></td>
				<td><label>Last changed</label></td>
				<td><input type="text" :value="lastChanged" disabled></td>
			</tr>
		</table>
		<textarea class="info-textarea" v-model="library.info"></textarea>
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

#info-table td:last-child {
	width: 100%;
}
</style>
