<template>
	<div id="actions-tab">
		<div class="flex-panel padded">
			<div class="inline-flex" v-once>
				<button type="button" title="Insert New Action" @click="insertAction(selectedIndex)"><img src="icons/add.png"></button>
				<button type="button" title="Delete" @click="deleteAction(selectedIndex)"><img src="icons/delete.png"></button>
				<button type="button" title="Duplicate" @click="duplicateAction(selectedIndex)"><img src="icons/copy.png"></button>
				<button type="button" title="Shift Up" @click="shiftUp(selectedIndex)"><img src="icons/up.png"></button>
				<button type="button" title="Shift Down" @click="shiftDown(selectedIndex)"><img src="icons/down.png"></button>
			</div>
			<ul id="action-list" class="lv no-select" tabindex="0">
				<li v-for="(action,index) of actions"
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
				<table class="padded">
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
				<table class="padded" v-if="selectedHasArguments">
					<tr v-for="arg of selectedArguments">
						<td><input type="text" v-model="arg.caption"></td>
						<td><combo :items="argKindList" v-model="arg.kind"/></td>
						<td><input type="text" v-model="arg.default"></td>
						<td v-show="isArgumentMenu(arg)"><input type="text" v-model="arg.options"></td>
					</tr>
				</table>
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

		selectedHasArguments() {
			return this.selectedAction.ifaceKind === ACT_IFACE_KINDS.NORMAL;
		},

		selectedArgumentCount: {
			get() {
				return this.selectedAction.argnum;
			},
			set(newValue) {
				var el = document.getElementById("argnum");
				if (el.checkValidity()) {
					this.selectedAction.argnum = newValue;
				}
			}
		}
	},

	methods: {
		insertAction(index = this.selectedIndex) {
			if (index < 0) index = this.actions.length;
			this.actions.splice(index, 0, Library.newAction(this.library));
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

		moveAction(one, two) {
			if (two < 0 || two >= this.actions.length) {
				two = mod(two, this.actions.length);
				var temp = this.actions.splice(one, 1)[0];
				this.actions.splice(two, 0, temp);
			} else {
				var temp = this.actions[one];
				this.actions[one] = this.actions[two];
				this.actions.splice(two, 1, temp);
			}
			return two;
		},

		shiftUp(index = this.selectedIndex) {
			this.selectedIndex = this.moveAction(index, index - 1);
		},

		shiftDown(index = this.selectedIndex) {
			this.selectedIndex = this.moveAction(index, index + 1);
		},

		openImage() {
			var el = document.getElementById('image-input');
			el.value = null;
			el.click();
		},

		imageFileSelected(evt) {
			var file = evt.target.files[0];
			if (!file) return;
			var reader = new FileReader();

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
	padding: 1px;
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
