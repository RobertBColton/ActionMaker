<template>
	<div>
		<div id="monaco-editor"></div>
	</div>
</template>

<script>
export default {
	props: {
		name: {
			type: String,
			required: true,
			default: "Information"
		},
		information: {
			type: String,
			default: ""
		}
	},

	data () {
		return {
			name: 'Information'
		};
	}
}
</script>
