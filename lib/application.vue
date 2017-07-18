<template>
	<div id="content">
		<header>
			<h1>ActionMaker</h1>
			<h3>Copyright © 2017, Robert Colton</h3>
		</header>
		<div id="ActionMaker">
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

				<button type="button" title="Random Id" @click="createId"><img src="icons/tag.png"></button>
				<input id="init-input" class="hidden" type="file" accept=".txt,.gml" @change="textFileSelected">
				<button type="button" title="Load Initialization Script" @click="loadInit"><img src="icons/script.png"></button>
				<input id="info-input" class="hidden" type="file" accept=".txt" @change="textFileSelected">
				<button type="button" title="Load Information" @click="loadInfo"><img src="icons/info.png"></button>

				<span class="spacer"></span>
			
				<button type="button" title="Help" @click="help"><img src="icons/help.png"></button>
			</div>
			<tabs :tabs="primaryTabs"></tabs>
		</div>
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

export default {
	name: "ActionMaker",

	data() {
		return {
			primaryTabs: [ LibraryTab, InfoTab, ActionsTab ]
		};
	},

	computed: {
		library() {
			return this.$root.library;
		}
	},

	methods: {
		newLibrary() {
			if (!confirm("Are you sure you wish to create a new library?\nUnsaved changes will be lost.")) return;
			//this.$root.library = new Library();
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
					this.$root.library = library;
				}
			});
		},

		createId() {
			this.library.id = randomId();
		},

		loadInit() {
			document.getElementById('init-input').click();
		},

		loadInfo() {
			document.getElementById('info-input').click();
		},

		textFileSelected(evt) {
			var file = evt.target.files[0];
			var reader = new FileReader();

			reader.onload = (e) => {
				if (evt.target.id === 'init-input') {
					this.library.init = reader.result;
				} else if (evt.target.id === 'info-input') {
					this.library.info = reader.result;
				}
			};

			reader.readAsText(file);
		},

		help() {
			window.open('http://github.com/RobertBColton/ActionMaker/wiki', '_blank');
		}
	}
}
</script>

<style>
body {
	background: #0099cc;
}

header {
	white-space: nowrap;
	text-align: center;
	margin: auto;
}

header > * {
	font-family: Verdana;
	font-weight: 900;
	color: white;
	text-shadow: 0px 4px 3px black,
				0px 8px 13px rgba(0,0,0,0.5),
				0px 18px 23px rgba(0,0,0,0.1);
}

#ActionMaker {
	width: 800px;
	display: flex;
	margin: auto;
	flex-flow: column;
	background-color: #fafafa;
	border: 1px solid black;
	font-family: 'Segoe UI', 'Helvetica Neue', 'San Fransicso', 'Lucida Grande', sans-serif;
	font-size: 11pt;
}

.tabs {
	flex: auto;
}

.tab {
	display: flex;
	flex-flow: column;
}

td {
	padding: 2px;
}

td > input, select {
	width: 100%;
	box-sizing: border-box;
}

td > label {
	text-align: right;
}

#monaco-editor {
	min-height: 512px;
}
</style>
