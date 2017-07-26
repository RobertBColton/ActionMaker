<template>
	<div id="content">
		<header v-once>
			<h1>ActionMaker</h1>
			<h3 class="hidden">Copyright © 2017, Robert Colton</h3>
		</header>
		<div id="ActionMaker">
			<div class="toolbar etched-border" v-once>
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
import Library from './library.js';

import ActionsTab from './components/actions-tab.vue';
import InfoTab from './components/info-tab.vue';
import LibraryTab from './components/library-tab.vue';

export default {
	name: "ActionMaker",

	data() {
		return {
			primaryTabs: [ LibraryTab, InfoTab, ActionsTab ],
			mergeLibrary: false
		};
	},

	computed: {
		library: {
			get() {
				return this.$root.library;
			},
			set(newValue) {
				this.$root.library = newValue;
			}
		}
	},

	methods: {
		newLibrary() {
			if (!confirm("Are you sure you want to create a new library?\nUnsaved changes will be lost.")) return;
			this.library = Library.newLibrary();
		},

		openLibrary(merge) {
			var element = document.getElementById('library-input');
			this.mergeLibrary = merge;
			element.click();
		},

		librarySelected(evt) {
			var files = evt.target.files;

			Library.deserialize(files[0], (library) => {
				if (this.mergeLibrary) {
					var a = this.library.actions, b = library.actions;
					a.push.apply(a, b);
				} else {
					this.library = library;
				}
			});
		},

		createId() {
			this.library.id = Library.randomId();
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
	text-shadow:	0 3px 0 hsl(174,5%,0%),
					0 4px 0 hsl(174,5%,0%),
					0 5px 0 hsl(174,5%,0%),
					0 6px 0 hsl(174,5%,0%),
					0 7px 0 hsl(174,5%,0%),
					0 8px 0 hsl(174,5%,0%),

				  0 3px 1px rgba(0,0,0,.9),
				  0 5px 5px rgba(0,0,0,.5),
				 0 10px 5px rgba(0,0,0,.5),
				0 20px 10px rgba(0,0,0,.6);
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

tr {
	vertical-align: baseline;
}

td {
	text-align: right;
	padding: 2px;
}

td > input, td > select {
	min-width: 100%;
	box-sizing: border-box;
}

td > label {
	text-align: right;
}

#monaco-editor {
	min-height: 512px;
}
</style>
