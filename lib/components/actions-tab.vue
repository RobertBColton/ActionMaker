<template>
	<div id="actions-tab">
		<div class="flex-panel padded">
			<div class="inline-flex">
				<button type="button" title="Insert New Action" @click="insertAction(selectedIndex)"><img src="icons/add.png"></button>
				<button type="button" title="Delete" @click="deleteAction(selectedIndex)"><img src="icons/delete.png"></button>
				<button type="button" title="Duplicate" @click="duplicateAction(selectedIndex)"><img src="icons/copy.png"></button>
				<button type="button" title="Shift Up" @click="shiftUp(selectedIndex)"><img src="icons/up.png"></button>
				<button type="button" title="Shift Down" @click="shiftDown(selectedIndex)"><img src="icons/down.png"></button>
			</div>
			<ul id="action-list" class="lv no-select">
				<li v-for="(action,index) in actions"
					:class="{ 'active': (index === selectedIndex) }"
					@click="selectedIndex = index">
					<span class="icon-preview" :style="{ 'background-image': 'url(' + action.image + ')' }"></span>
					{{action.name}}
				</li>
			</ul>
		</div>
		<div class="flex-panel padded" v-if="selectedAction">
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
						<td class="align-top">
							<span class="flex-block">
								<img class="image-preview etched-border" width="32" height="32" :src="selectedAction.image">
								<span class="spacer"></span>
								<input id="image-input" class="hidden" type="file" accept="image/*">
								<button type="button" title="Change Image" @click="openImage"><img src="icons/open-image.png"></button>
							</span>
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
				<div class="flex-panel">
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
			selectedIndex: -1
		};
	},

	computed: {
		actions() {
			return this.$root.library.actions;
		},

		selectedAction() {
			return this.actions[this.selectedIndex];
		}
	},

	methods: {
		insertAction(index = this.selectedIndex) {
			if (index < 0) index = this.actions.length;
			this.actions.splice(index, 0, {
				name: "Action " + this.actions.length,
				id: this.actions.length,
				image: 'icons/blank-tile.png'
			});
		},

		deleteAction(index = this.selectedIndex) {
			if (this.selectedIndex >= this.actions.length - 1) this.selectedIndex -= 1;
			this.actions.splice(index, 1);
		},

		duplicateAction(index = this.selectedIndex) {
			var clone = Object.assign({}, this.actions[index]);
			this.actions.splice(index, 0, clone);
			this.selectedIndex += 1;
		},

		swapActions(one, two) {
			var temp = this.actions[one];
			this.actions[one] = this.actions[two];
			this.actions.splice(two, 1, temp);
		},

		shiftUp(index = this.selectedIndex) {
			if (index < 1) return;
			this.swapActions(index, this.selectedIndex = index - 1);
		},

		shiftDown(index = this.selectedIndex) {
			if (index >= this.actions.length - 1) return;
			this.swapActions(index, this.selectedIndex = index + 1);
		},

		openImage() {
			document.getElementById('image-input').click();
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
	flex: 1 1 512px;
}

.lv {
	cursor: pointer;
	overflow: auto;
	background-color: white;
	list-style: none;
	border: 1px solid gray;
	padding-left: 0;
	margin: 0;
}

.lv > li {
	white-space: nowrap;
	margin-top: 1px;
}

.lv > li > .icon-preview {
	width: 24px;
	height: 24px;
	display: inline-block;
	vertical-align: middle;
}

.lv > li:hover {
	background-color: lightgray;
}

.lv > li.active {
	background-color: dodgerblue;
	color: white;
}

fieldset {
	margin-bottom: 5px;
}

.image-preview {
	background-color: white;
}
</style>
