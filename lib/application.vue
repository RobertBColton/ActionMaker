<template>
	<div class="content">
		<div class="toolbar etched-border">
			<button type="button" title="New Library" @click="newLibrary"><img src="icons/new.png"></button>
			<input id="library-input" class="hidden" type="file" accept=".lgl,.lib" @change="librarySelected">
			<button type="button" title="Open Library" @click="openLibrary(false)"><img src="icons/open.png"></button>
			<button type="button" title="Import Actions" @click="openLibrary(true)"><img src="icons/import.png"></button>
			<span class="spacer"></span>
			<div class="dropdown">
				<button type="button" title="Save Library"><img src="icons/save.png"></button>
				<div class="dropdown-content">
					<a href="#">GameMaker (*.lib)</a>
					<a href="#">LateralGM (*.lgl)</a>
				</div>
			</div>
			<span class="spacer"></span>
			<button type="button" title="Help" @click="help"><img src="icons/help.png"></button>
		</div>
		<tabs :tabs="primaryTabs"></tabs>
	</div>
</template>

<script>
import Reader from './reader.js';

import ActionsTab from './components/actions-tab.vue';
import InfoTab from './components/info-tab.vue';
import LibraryTab from './components/library-tab.vue';

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

export default {
	data () {
		return {
			library: new Library(),
			primaryTabs: [ LibraryTab, InfoTab, ActionsTab ]
		};
	},

	methods: {
		newLibrary() {
			if (!confirm("Are you sure you wish to create a new library? Unsaved changes will be lost.")) return;
			this.library = new Library();
		},

		openLibrary(merge) {
			var element = document.getElementById('library-input');
			element.merge = merge;
			element.click();
		},

		librarySelected(evt) {
			var files = evt.target.files;
			var merge = evt.target.merge;

			Reader.deserialize(files[0], (library) => {
				if (merge) {
					library.actions.forEach((e) => {
						this.library.actions.push(e);
					});
				} else {
					this.library = library;
				}
			});
		},

		createId() {
			this.library.id = randomId();
		},

		help() {
			window.open('http://github.com/RobertBColton/ActionMaker/wiki', '_blank');
		}
	}
}
</script>
