<template>
	<div>
		<table class="padded">
			<tr>
				<td><label>Caption</label></td>
				<td><input type="text" v-model="library.caption"></td>
				<td><label>Id</label></td>
				<td><input type="text" v-model.number="library.id"></td>
				<td><label><input type="checkbox" v-model="library.advanced">Advanced</label></td>
			</tr>
		</table>
		<monaco class="code-editor etched-border" v-model="library.init" language="javascript"/>
	</div>
</template>

<script>
export default {
	name: "Library",

	computed: {
		library() {
			return this.$root.library;
		}
	}
}
</script>
