<template>
	<div class="content">
		<div class="toolbar etched-border">
			<button type="button" title="New Library" v-on:click="newLibrary"><img src="icons/new.png"/></button>
			<input id="file-input" class="hidden" type="file" accept=".lgl,.lib" v-on:change="librarySelected"/>
			<button type="button" title="Open Library" v-on:click="openLibrary"><img src="icons/open.png"/></button>
			<button type="button" title="Import Actions"><img src="icons/import.png"/></button>
			<span class="spacer"></span>
			<div class="dropdown">
				<button type="button" title="Save Library"><img src="icons/save.png"/></button>
				<div class="dropdown-content">
					<a href="#">GameMaker (*.lib)</a>
					<a href="#">LateralGM (*.lgl)</a>
				</div>
			</div>
			<span class="spacer"></span>
			<button type="button" title="Help" onclick="window.open('http://github.com/RobertBColton/ActionMaker/wiki', '_blank')"><img src="icons/help.png"/></button>
		</div>
		<div class="center">
			<div class="library-properties padded etched-border">
				<div>
					<div class="flex-block">
						<label>Caption:</label>
						<input type="text" v-bind:value="library.caption"/>
					</div>
					<div class="flex-block">
						<label>Id:</label>
						<input type="text" v-bind:value="library.id"/>
					</div>
				</div>
				<div class="toolbar toolbar-centered padded">
					<button type="button" title="Information"><img src="icons/info.png"/></button>
					<button type="button" title="Initialization Code"><img src="icons/script.png"/></button>
					<button type="button" title="Random Id" v-on:click="createId"><img src="icons/tag.png"/></button>
					<label><input type="checkbox" v-bind:checked="library.advanced">Advanced</label>
				</div>
				<select
						name="action-list"
						size="20">
					<option v-for="action in library.actions" value="Move2"><img v-bind:src="action.image"/> {{action.name}}</option>
				</select>
				<div class="toolbar toolbar-centered padded">
					<button type="button" title="Add" v-on:click="addAction"><img src="icons/add.png"/></button>
					<button type="button" title="Delete"><img src="icons/delete.png"/></button>
					<button type="button" title="Duplicate"><img src="icons/copy.png"/></button>
					<button type="button" title="Shift Up"><img src="icons/up.png"/></button>
					<button type="button" title="Shift Down"><img src="icons/down.png"/></button>
				</div>
			</div>
			<div class="action-properties padded etched-border">
				<fieldset class="padded">
					<legend>General Action Properties</legend>
					<table>
						<tr>
							<td><label>Name:</label></td>
							<td><input type="text"/></td>
							<td><label>Description:</label></td>
							<td><input type="text"/></td>
						</tr>
						<tr>
							<td><label>Id:</label></td>
							<td><input type="text"/></td>
							<td><label>List text:</label></td>
							<td><input type="text"/></td>
						</tr>
						<tr>
							<td><label>Image:</label></td>
							<td>
								<div class="inline-flex">
									<img class="image-preview etched-border padded" src="icons/blank-tile.png"/>
									<input id="iconfile-input" class="hidden" type="file" accept="image/*"/>
									<span class="spacer"></span>
									<button type="button" title="Change Image" onclick="document.getElementById('iconfile-input').click();"><img src="icons/open.png"/></button>
								</div>
							</td>
							<td><label>Hint text:</label></td>
							<td><input type="text"/></td>
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
							<td><input type="text"/></td>
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
					<div class="inline-block">
					</div>
				</fieldset>
			</div>
		</div>
	</div>
</template>

<script>
import Reader from './reader.js';

export default {
	data () {
		function randomId() {
			return Math.floor(Math.random() * 999000) + 1000;
		};

		function Library() {
			var library = {
				caption: '',
				id: randomId(),
				initializationCode: '',
				advanced: false,
				author: '',
				version: 100,
				lastChanged: '',
				information: '',
				actions: [ ]
			};
			return library;
		};

		return {
			library: new Library(),

			newLibrary: () => {
				if (!confirm("Are you sure you wish to create a new library? Unsaved changes will be lost.")) return;
				this.library = new Library();
			},

			openLibrary: () => {
				document.getElementById('file-input').click();
			},

			librarySelected: (evt) => {
				var files = evt.target.files;

				Reader.deserialize(files[0], (library) => {
					this.library = library;
				});
			},

			addAction: () => {
				this.library.actions.push({
					name: "Action " + this.library.actions.length,
					id: this.library.actions.length,
					image: 'icons/blank-tile.png'
				});
			},

			createId: () => {
				this.library.id = randomId();
			}
		};
	}
}
</script>
