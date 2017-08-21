<template>
	<div id="actions-tab">
		<div class="flex-panel padded">
			<div class="inline-flex justify-center" v-once>
				<button type="button" title="Insert New Action" @click="insertAction(selectedIndex)"><img src="icons/add.png"></button>
				<button type="button" title="Delete" @click="deleteAction(selectedIndex)"><img src="icons/delete.png"></button>
				<button type="button" title="Cut" @click="cutAction" :disabled="!isCutCommandSupported"><img src="icons/cut.png"></button>
				<button type="button" title="Copy" @click="copyAction" :disabled="!isCopyCommandSupported"><img src="icons/copy.png"></button>
				<button type="button" title="Paste" @click="pasteAction" :disabled="!isPasteCommandSupported"><img src="icons/paste.png"></button>
			</div>
			<div id="action-list" class="lv no-select" tabindex="0"
				 @keyup.delete="deleteAction(selectedIndex)"
				 @keydown.up.prevent="actionListPrevious"
				 @keydown.down.prevent="actionListNext"
				 @drop="actionListDrop"
				 @cut.prevent="cut" @copy.prevent="copy" @paste.prevent="paste">
				<ul>
					<li v-for="(action,index) of actions"
						:title="action.name" draggable="true"
						:class="{ 'active': (index === selectedIndex) }"
						@dragstart="actionListDragStart($event, index)"
						@dragover.prevent="dragIndex = index"
						@click="actionListItemClicked($event, index)">
						<span class="icon-preview" :style="{ 'background-image': 'url(' + action.image + ')' }"></span>
						{{action.name}}
					</li>
				</ul>
			</div>
		</div>
		<div class="flex-panel padded grow" v-if="selectedAction">
			<fieldset>
				<legend>General Action Properties</legend>
				<table class="expand-last-column">
					<tr>
						<td><label>Name</label></td>
						<td><input type="text" v-model="selectedAction.name"></td>
						<td><label>Description</label></td>
						<td><input type="text" v-model="selectedAction.description"></td>
					</tr>
					<tr>
						<td><label>Id</label></td>
						<td><input type="text" v-model.number="selectedAction.id"></td>
						<td><label>List text</label></td>
						<td><input type="text" v-model="selectedAction.list"></td>
					</tr>
					<tr>
						<td><label>Image</label></td>
						<td class="align-top">
							<span class="flex-block">
								<img class="image-preview" width="32" height="32" :src="selectedAction.image">
								<span class="spacer"></span>
								<input id="image-input" class="hidden" type="file" accept="image/*" @change="imageFileSelected">
								<button type="button" title="Change Image" @click="openImage"><img src="icons/open-image.png"></button>
							</span>
						</td>
						<td><label>Hint text</label></td>
						<td><input type="text" v-model="selectedAction.hint"></td>
					</tr>
					<tr>
						<td><label>Kind</label></td>
						<td><combo :items="kindList" v-model="selectedAction.kind"/></td>
						<td></td>
						<td>
							<div class="flex-block">
								<label><input type="checkbox" v-model="selectedAction.hidden">Hidden</label>
								<label><input type="checkbox" v-model="selectedAction.advanced">Advanced</label>
								<label><input type="checkbox" v-model="selectedAction.registered">Pro Edition Only</label>
							</div>
						</td>
					</tr>
					<tr v-show="isSelectedNormal">
						<td><label>Execution</label></td>
						<td><combo :items="execList" v-model="selectedAction.execType"/></td>
						<template v-if="isSelectedFunction">
							<td><label>Function</label></td>
							<td><input type="text" v-model="selectedAction.execInfo"></td>
						</template>
					</tr>
				</table>
			</fieldset>
			<fieldset v-show="isSelectedNormal">
				<legend>Interface</legend>
				<table>
					<tr>
						<td><label>Kind</label></td>
						<td><combo :items="ifaceList" v-model="selectedAction.ifaceKind"/></td>
						<td rowspan="2" class="align-left">
							<div class="flex-panel">
								<label><input type="checkbox" v-model="selectedAction.question">Question</label>
								<label><input type="checkbox" v-model="selectedAction.apply">Show "Apply To"</label>
								<label><input type="checkbox" v-model="selectedAction.relative">Show "Relative"</label>
							</div>
						</td>
					</tr>
					<tr>
						<td><label>Arguments</label></td>
						<td>
							<input id="argnum" type="number" v-model.number.lazy:value="selectedArgumentCount" min="0" :max="MAX_ARGS"
								:placeholder="'0 - ' + MAX_ARGS" :disabled="!selectedHasArguments" required>
						</td>
					</tr>
				</table>
				<table class="expand-last-column" v-if="selectedHasArguments">
					<tr v-for="arg of selectedArguments">
						<td><input type="text" v-model="arg.caption"></td>
						<td><combo :items="argKindList" v-model="arg.kind"/></td>
						<td><input type="text" v-model="arg.default"></td>
						<td v-show="isArgumentMenu(arg)"><input type="text" v-model="arg.options"></td>
					</tr>
				</table>
			</fieldset>
			<fieldset v-if="isSelectedNormal && isSelectedCode">
				<legend>Execution Code</legend>
				<monaco id="exec-code" class="code-editor etched-border" v-model="selectedAction.execInfo" language="javascript"/>
			</fieldset>
		</div>
	</div>
</template>

<script>
import Library, { ACT_KINDS, ACT_EXEC_TYPES, ACT_IFACE_KINDS, ARG_KINDS } from '../library.js';

function mod(n, k) {
	return ((n % k) + k) % k;
}

export default {
	name: "Actions",

	created() {
		this.MAX_ARGS = Library.MAX_ARGS;
	},

	data() {
		return {
			selectedIndex: -1,
			dragIndex: -1,
			showCode: false,
			kindList: {
				"Normal": ACT_KINDS.NORMAL,
				"Begin Group": ACT_KINDS.BEGIN_GROUP,
				"End Group": ACT_KINDS.END_GROUP,
				"Else": ACT_KINDS.ELSE,
				"Exit": ACT_KINDS.EXIT,
				"Repeat": ACT_KINDS.REPEAT,
				"Variable": ACT_KINDS.VARIABLE,
				"Code": ACT_KINDS.CODE,
				"- Placeholder": ACT_KINDS.PLACEHOLDER,
				"- Separator": ACT_KINDS.SEPARATOR,
				"- Label": ACT_KINDS.LABEL
			},
			execList: {
				"None": ACT_EXEC_TYPES.NONE,
				"Function": ACT_EXEC_TYPES.FUNCTION,
				"Code": ACT_EXEC_TYPES.CODE
			},
			ifaceList: {
				"Normal": ACT_IFACE_KINDS.NORMAL,
				"None": ACT_IFACE_KINDS.NONE,
				"Arrows": ACT_IFACE_KINDS.ARROWS,
				"Code": ACT_IFACE_KINDS.CODE,
				"Text": ACT_IFACE_KINDS.TEXT,
			},
			argKindList: {
				"Expression": ARG_KINDS.EXPRESSION,
				"String": ARG_KINDS.STRING,
				"Both": ARG_KINDS.BOTH,
				"Boolean": ARG_KINDS.BOOLEAN,
				"Menu": ARG_KINDS.MENU,
				"Sprite": ARG_KINDS.SPRITE,
				"Sound": ARG_KINDS.SOUND,
				"Background": ARG_KINDS.BACKGROUND,
				"Path": ARG_KINDS.PATH,
				"Script": ARG_KINDS.SCRIPT,
				"Object": ARG_KINDS.OBJECT,
				"Room": ARG_KINDS.ROOM,
				"Font": ARG_KINDS.FONT,
				"Color": ARG_KINDS.COLOR,
				"Timeline": ARG_KINDS.TIMELINE,
				"Font String": ARG_KINDS.FONT_STRING
			}
		};
	},

	computed: {
		isCutCommandSupported() {
			return document.queryCommandSupported('cut');
		},

		isCopyCommandSupported() {
			return document.queryCommandSupported('copy');
		},

		isPasteCommandSupported() {
			try {
				return document.queryCommandSupported('paste');
			} catch (err) {
				return false;
			}
			
		},

		library() {
			this.selectedIndex = -1;
			return this.$root.library;
		},

		actions() {
			return this.library.actions;
		},

		selectedAction() {
			return this.actions[this.selectedIndex];
		},

		selectedArguments() {
			return this.selectedAction.args.slice(0, this.selectedAction.argnum);
		},

		isSelectedNormal() {
			return this.selectedAction.kind === ACT_KINDS.NORMAL;
		},

		isSelectedFunction() {
			return this.selectedAction.execType === ACT_EXEC_TYPES.FUNCTION;
		},

		isSelectedCode() {
			return this.selectedAction.execType === ACT_EXEC_TYPES.CODE;
		},

		selectedHasArguments() {
			return this.selectedAction.ifaceKind === ACT_IFACE_KINDS.NORMAL;
		},

		selectedArgumentCount: {
			get() {
				return this.selectedAction.argnum;
			},
			set(newValue) {
				const el = document.getElementById("argnum");
				if (el.checkValidity()) {
					this.selectedAction.argnum = newValue;
				}
			}
		}
	},

	methods: {
		scrollTo(parent, target) {
			const targetTop = target.offsetTop - parent.offsetTop;
			const targetBottom = targetTop + target.clientHeight;
			const wrapperBottom = parent.scrollTop + parent.clientHeight;
			if (targetTop < parent.scrollTop) {
				parent.scrollTop = targetTop;
			} else if (targetBottom >= wrapperBottom) {
				parent.scrollTop = targetBottom - parent.clientHeight;
			}
		},

		actionListPrevious(evt) {
			if (this.selectedIndex < 1) return;
			const list = evt.target;
			const selected = list.getElementsByClassName("active")[0];
			this.scrollTo(list, selected.previousSibling);
			this.selectedIndex--;
		},

		actionListNext(evt) {
			if (this.selectedIndex >= this.actions.length - 1) return;
			const list = evt.target;
			const selected = list.getElementsByClassName("active")[0];
			this.scrollTo(list, selected.nextSibling);
			this.selectedIndex++;
		},

		actionListItemClicked(evt, index) {
			//evt.target.focus(); out because prev/next
			this.selectedIndex = index;
			//const node = document.getElementById('action-list');
			//node.focus();
			//window.getSelection().collapse(node);
			//document.getSelection().collapse(node);
			//evt.preventDefault();
			//evt.stopPropagation();
			//return false;
		},

		insertAction(index = this.selectedIndex, action = Library.newAction(this.library)) {
			if (index < 0) index = this.actions.length;
			this.actions.splice(index, 0, action);
		},

		deleteAction(index = this.selectedIndex) {
			if (index < 0) return;
			if (this.selectedIndex >= this.actions.length - 1) this.selectedIndex -= 1;
			this.actions.splice(index, 1);
		},

		stringifyAction(act) {
			const replacer = function(key, value) {
				if (key === "parent") return;
				return value;
			};
			return JSON.stringify(act, replacer);
		},

		actionListDragStart(evt, index) {
			this.selectedIndex = index;
			evt.dataTransfer.setData("application/json", this.stringifyAction(this.selectedAction));
		},

		actionListDragOver(evt) {

		},

		actionListDrop(evt) {
			const act = JSON.parse(evt.dataTransfer.getData("application/json"));
			act.parent = this.library;
			this.deleteAction(this.selectedIndex);
			this.insertAction(this.selectedIndex = this.dragIndex, act);
		},

		cut(evt) {
			if (this.selectedIndex < 0) return;
			this.copy(evt);
			this.deleteAction();
		},

		copy(evt) {
			if (this.selectedIndex < 0) return;
			evt.clipboardData.setData("application/json", this.stringifyAction(this.selectedAction));
		},

		paste(evt) {
			alert("heller");
			const act = JSON.parse(evt.clipboardData.getData("application/json"));
			act.parent = this.library;
			this.insertAction(undefined, act);
		},

		cutAction() {
			const el = document.getElementById('action-list');
			el.focus();
			document.execCommand('cut');
		},

		copyAction() {
			const el = document.getElementById('action-list');
			el.focus();
			document.execCommand('copy');
		},

		pasteAction() {
			const el = document.getElementById('action-list');
			el.focus();
			document.execCommand('paste');
		},

		openImage() {
			const el = document.getElementById('image-input');
			el.value = null;
			el.click();
		},

		imageFileSelected(evt) {
			const file = evt.target.files[0];
			if (!file) return;
			const reader = new FileReader();

			reader.onload = (e) => {
				this.selectedAction.image = e.target.result;
			};

			reader.readAsDataURL(file);
		},

		isArgumentMenu(arg) {
			return arg.kind === ARG_KINDS.MENU;
		}
	}
}
</script>

<style>
#actions-tab {
	flex-flow: row;
}

#action-list {
	width: 160px;
	flex: 1 1 512px;
}

#exec-code {
	min-height: 256px;
}

.lv {
	cursor: pointer;
	overflow: auto;
	background-color: white;
	border: 1px solid gray;
}

.lv ul {
	list-style: none;
	padding-left: 0;
	margin: 0;
	min-width: 100%;
	display: inline-block;
}

.lv li {
	white-space: nowrap;
	padding: 1px;
}

.lv li > .icon-preview {
	width: 24px;
	height: 24px;
	display: inline-block;
	vertical-align: middle;
}

.lv li:hover {
	background-color: lightgray;
}

.lv li.active {
	background-color: Highlight;
	color: HighlightText;
}

fieldset {
	margin-bottom: 5px;
}

.image-preview {
	background-color: white;
	border: 2px dashed;
}
</style>
