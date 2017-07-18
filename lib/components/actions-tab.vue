<template>
	<div id="actions-tab">
		<div class="flex-panel">
			<div class="inline-flex">
				<button type="button" title="Add" @click="addAction"><img src="icons/add.png"></button>
				<button type="button" title="Delete"><img src="icons/delete.png"></button>
				<button type="button" title="Duplicate"><img src="icons/copy.png"></button>
				<button type="button" title="Shift Up"><img src="icons/up.png"></button>
				<button type="button" title="Shift Down"><img src="icons/down.png"></button>
			</div>
			<ul id="action-list" class="no-select">
				<li v-for="action in actions"
					:class="{ 'active': (action === selectedAction) }"
					@click="selectedAction = action">
					<span class="icon-preview" :style="{ 'background-image': 'url(' + action.image + ')' }"></span>
					{{action.name}}
				</li>
			</ul>
		</div>
		<div class="flex-panel" v-if="selectedAction">
			<fieldset>
				<legend>General Action Properties</legend>
				<table>
					<tr>
						<td><label>Name</label></td>
						<td><input type="text" v-model="selectedAction.name"></td>
						<td><label>Description</label></td>
						<td><input type="text"></td>
					</tr>
					<tr>
						<td><label>Id</label></td>
						<td><input type="text" v-model.number="selectedAction.id"></td>
						<td><label>List text</label></td>
						<td><input type="text"></td>
					</tr>
					<tr>
						<td><label>Image</label></td>
						<td>
							<div class="flex-block">
								<img class="image-preview etched-border" width="32" height="32" :src="selectedAction.image">
								<span class="spacer"></span>
								<input id="icon-input" class="hidden" type="file" accept="image/*">
								<button type="button" title="Change Image" @click="openIcon"><img src="icons/open.png"></button>
							</div>
						</td>
						<td><label>Hint text</label></td>
						<td><input type="text"></td>
					</tr>
					<tr>
						<td><label>Kind</label></td>
						<td>
							<select>
								<option value="">Normal</option>
								<option value="">Begin Group</option>
								<option value="">End Group</option>
								<option value="">Else</option>
								<option value="">Exit</option>
								<option value="">Repeat</option>
								<option value="">Variable</option>
								<option value="">Code</option>
								<option value="">- Placeholder</option>
								<option value="">- Separator</option>
								<option value="">- Label</option>
							</select>
						</td>
						<td></td>
						<td>
							<div class="flex-block">
								<label><input type="checkbox">Hidden</label>
								<label><input type="checkbox">Advanced</label>
								<label><input type="checkbox">Pro Edition Only</label>
							</div>
						</td>
					</tr>
					<tr>
						<td><label>Execution</label></td>
						<td>
							<select>
								<option value="">None</option>
								<option value="">Function</option>
								<option value="">Code</option>
							</select>
						</td>
						<td><label>Function</label></td>
						<td><input type="text"></td>
					</tr>
				</table>
			</fieldset>
			<fieldset>
				<legend>Interface</legend>
				<div class="inline-flex">
					<label>Kind</label>
					<select>
						<option value="">Normal</option>
						<option value="">None</option>
						<option value="">Arrows</option>
						<option value="">Code</option>
						<option value="">Text</option>
					</select>
				</div>
				<div>
					<label><input type="checkbox">Question</label>
					<label><input type="checkbox">Show "Apply To"</label>
					<label><input type="checkbox">Show "Relative"</label>
				</div>
			</fieldset>
		</div>
	</div>
</template>

<script>
export default {
	name: "Actions",

	data() {
		return {
			selectedAction: undefined
		};
	},

	computed: {
		actions() {
			return this.$root.library.actions;
		}
	},

	methods: {
		addAction() {
			this.actions.push({
				name: "Action " + this.actions.length,
				id: this.actions.length,
				image: 'icons/blank-tile.png'
			});
		},

		openIcon() {
			document.getElementById('icon-input').click();
		}
	}
}
</script>

<style>
#actions-tab {
	flex-flow: row;
}

#action-list {
	width: 100%;
	height: 100%;
}

ul {
	cursor: pointer;
	overflow: auto;
	background-color: white;
	list-style: none;
	border: 1px solid gray;
	padding-left: 0;
	margin: 0;
}

li {
	white-space: nowrap;
	margin-top: 1px;
}

li > .icon-preview {
	width: 24px;
	height: 24px;
	display: inline-block;
	vertical-align: middle;
}

li:hover {
	background-color: lightgray;
}

li.active {
	background-color: dodgerblue;
	color: white;
}

li > img {
	vertical-align: middle;
	width: 18px;
	height: 18px;
}

fieldset {
	margin-bottom: 5px;
}

.image-preview {
	background-color: white;
}
</style>
