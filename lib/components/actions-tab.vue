<template>
	<div>
		<div class="library-properties padded etched-border">
			<div class="toolbar toolbar-centered padded">
				<button type="button" title="Add" @click="addAction"><img src="icons/add.png"></button>
				<button type="button" title="Delete"><img src="icons/delete.png"></button>
				<button type="button" title="Duplicate"><img src="icons/copy.png"></button>
				<button type="button" title="Shift Up"><img src="icons/up.png"></button>
				<button type="button" title="Shift Down"><img src="icons/down.png"></button>
			</div>
			<select id="action-list"
					name="action-list"
					size="20"
					v-model="selectedAction">
				<option v-for="action in actions" value="action"><img :src="action.image" width="18" height="18">
					{{action.name}}
				</option>
			</select>
		</div>
		<div class="action-properties etched-border" v-if="selectedAction">
			<div>
			<fieldset class="padded">
				<legend>General Action Properties</legend>
				<table>
					<tr>
						<td><label>Name:</label></td>
						<td><input type="text" v-model="selectedAction.name"></td>
						<td><label>Description:</label></td>
						<td><input type="text"></td>
					</tr>
					<tr>
						<td><label>Id:</label></td>
						<td><input type="text" v-model.number="selectedAction.id"></td>
						<td><label>List text:</label></td>
						<td><input type="text"></td>
					</tr>
					<tr>
						<td><label>Image:</label></td>
						<td>
							<div class="inline-flex">
								<img class="image-preview etched-border padded" src="icons/blank-tile.png">
								<span class="spacer"></span>
								<input id="icon-input" class="hidden" type="file" accept="image/*">
								<button type="button" title="Change Image" @click="openIcon"><img src="icons/open.png"></button>
							</div>
						</td>
						<td><label>Hint text:</label></td>
						<td><input type="text"></td>
					</tr>
					<tr>
						<td><label>Kind:</label></td>
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
						<td colspan="2">
							<div class="inline-flex-block toolbar toolbar-centered padded">
								<label><input type="checkbox">Hidden</label>
								<label><input type="checkbox">Advanced</label>
								<label><input type="checkbox">Pro Edition Only</label>
							</div>
						</td>
					</tr>
					<tr>
						<td><label>Execution:</label></td>
						<td>
							<select>
								<option value="">None</option>
								<option value="">Function</option>
								<option value="">Code</option>
							</select>
						</td>
						<td><label>Function:</label></td>
						<td><input type="text"></td>
					</tr>
				</table>
			</fieldset>
			<fieldset class="padded">
				<legend>Interface</legend>
				<div class="inline-block">
					<div class="flex-block">
						<label>Kind:</label>
						<select>
							<option value="">Normal</option>
							<option value="">None</option>
							<option value="">Arrows</option>
							<option value="">Code</option>
							<option value="">Text</option>
						</select>
					</div>
					<div class="padded">
						<label><input type="checkbox">Question</label>
						<label><input type="checkbox">Show "Apply To"</label>
						<label><input type="checkbox">Show "Relative"</label>
					</div>
				</div>
			</fieldset>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		name: {
			type: String,
			required: true,
			default: "Actions"
		},

		actions: {
			type: Array,
			required: true,
			default: []
		}
	},

	data () {
		return {
			selectedAction: undefined
		};
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
