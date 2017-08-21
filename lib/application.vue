<template>
	<div id="content" class="system-ui">
		<header v-once>
			<h1>ActionMaker</h1>
			<h3 class="hidden">Copyright © 2017, Robert Colton</h3>
		</header>
		<modal v-if="showNew" @closed="newLibrary">
			<h3 slot="header">New Library</h3>
			<p slot="body">
				Are you sure you want to create a new library?<br>
				Unsaved changes may be lost.
			</p>
		</modal>
		<modal v-if="showSave" @closed="saveLibrary">
			<h3 slot="header">Save Library</h3>
			<table slot="body">
				<tr>
					<td><label>Format</label></td>
					<td><combo :items="saveFormatList" v-model="saveFormat"/></td>
				</tr>
				<tr v-if="isSaveFormatLIB">
					<td><label>Version</label></td>
					<td><combo :items="saveVersionList" v-model="saveVersion"/></td>
				</tr>
			</table>
		</modal>
		<div id="ActionMaker">
			<div class="toolbar etched-border" v-once>
				<button type="button" title="New Library" @click="showNew = true"><img src="icons/new.png"></button>
				<input id="library-input" class="hidden" type="file" accept=".lgl,.lib" @change="librarySelected">
				<button type="button" title="Open Library" @click="openLibrary(false)"><img src="icons/open.png"></button>
				<button type="button" title="Import Actions" @click="openLibrary(true)"><img src="icons/import.png"></button>

				<span class="spacer"></span>

				<button type="button" title="Save Library" @click="showSave = true"><img src="icons/save.png"></button>

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
import Library, { LIB_FORMATS } from './library.js';

import ActionsTab from './components/actions-tab.vue';
import InfoTab from './components/info-tab.vue';
import LibraryTab from './components/library-tab.vue';

export default {
	name: "ActionMaker",

	data() {
		return {
			primaryTabs: [ LibraryTab, InfoTab, ActionsTab ],
			mergeLibrary: false,
			showNew: false,
			showSave: false,
			saveFormatList: {
				"GameMaker (*.lib)": LIB_FORMATS.LIB,
				"LateralGM (*.lgl)": LIB_FORMATS.LGL
			},
			saveVersionList: {
				"520": 520,
				"500": 500
			},
			saveFormat: LIB_FORMATS.LIB,
			saveVersion: 520
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
		},

		isSaveFormatLIB() {
			return this.saveFormat === LIB_FORMATS.LIB;
		}
	},

	methods: {
		newLibrary(accepted) {
			this.showNew = false;
			if (!accepted) return;

			this.library = Library.newLibrary();
		},

		openLibrary(merge) {
			this.mergeLibrary = merge;
			const el = document.getElementById('library-input');
			el.value = null;
			el.click();
		},

		librarySelected(evt) {
			const file = evt.target.files[0];
			if (!file) return;
			const reader = new FileReader();

			reader.onload = (e) => {
				const library = Library.deserialize(reader.result);
				if (this.mergeLibrary) {
					const a = this.library.actions, b = library.actions;
					a.push.apply(a, b);
				} else {
					this.library = library;
				}
			}

			reader.readAsArrayBuffer(file);
		},

		saveLibrary(accepted) {
			this.showSave = false;
			if (!accepted) return;

			const callback = (data) => {
				const file = new Blob([data], {type: "octet/stream"});
				const a = document.createElement("a"),
					url = URL.createObjectURL(file);
				a.href = url;
				a.download = this.library.caption + '.' + this.saveFormat;
				document.body.appendChild(a);
				a.click();
				setTimeout(function() {
					document.body.removeChild(a);
					window.URL.revokeObjectURL(url);
				}, 0);
			};
			if (this.saveFormat === LIB_FORMATS.LGL) {
				Library.serializeLGL(this.library, callback);
			} else if (this.saveFormat === LIB_FORMATS.LIB) {
				const data = Library.serializeLIB(this.library, this.saveVersion);
				callback(data);
			}
		},

		createId() {
			this.library.id = Library.randomId();
		},

		loadInit() {
			const el = document.getElementById('init-input');
			el.value = null;
			el.click();
		},

		loadInfo() {
			const el = document.getElementById('info-input');
			el.value = null;
			el.click();
		},

		textFileSelected(evt) {
			const file = evt.target.files[0];
			if (!file) return;
			const reader = new FileReader();

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
			window.open('http://enigma-dev.org/docs/Wiki/Action', '_blank');
		}
	}
}
</script>

<style>
body {
	background: #0099cc;
	margin: 0;
	width: 100vw;
}

#content {
	width: 800px;
	margin: auto;
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
	display: flex;
	flex-flow: column;
	background-color: #fafafa;
	border: 1px solid black;
	font-size: 11pt;
}

tr {
	vertical-align: baseline;
}

td {
	text-align: right;
	padding: 2px;
}

td > input {
	width: 140px;
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
