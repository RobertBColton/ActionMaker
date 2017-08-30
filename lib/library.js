import { Encoder, Decoder } from './coder.js';

export const ACT_KINDS = {
	NORMAL: 0, BEGIN_GROUP: 1, END_GROUP: 2, ELSE: 3,
	EXIT: 4, REPEAT: 5, VARIABLE: 6, CODE: 7,
	PLACEHOLDER: 8, SEPARATOR: 9, LABEL: 10
};

export const ACT_EXEC_TYPES = {
	NONE: 0, FUNCTION: 1, CODE: 2
};

export const ACT_IFACE_KINDS = {
	NORMAL: 0, NONE: 1, ARROWS: 2, CODE: 5, TEXT: 6
};

export const ARG_KINDS = {
	EXPRESSION: 0, STRING: 1, BOTH: 2, BOOLEAN: 3,
	MENU: 4, SPRITE: 5, SOUND: 6, BACKGROUND: 7,
	PATH: 8, SCRIPT: 9, OBJECT: 10, ROOM: 11,
	FONT: 12, COLOR: 13, TIMELINE: 14, FONT_STRING: 15
};

export const LIB_FORMATS = {
	LIB: "lib", LGL: "lgl"
};

export const OAEpoch = Date.UTC(1899, 11, 30) + (new Date().getTimezoneOffset() * 60 * 1000);
export const msInDay = 24 * 60 * 60 * 1000;

export const DEFAULT_IMAGE = "icons/blank-tile.png";

function actKindHasImage(kind) {
	return (kind != ACT_KINDS.PLACEHOLDER && kind != ACT_KINDS.SEPARATOR && kind != ACT_KINDS.LABEL);
};

const STR_EMPTY = new String();

export default {
	MAX_ARGS: 6,

	randomId() {
		return Math.floor(Math.random() * 999000) + 1000;
	},

	fromOADate(date) {
		return new Date((date * msInDay) + OAEpoch);
	},

	toOADate(date) {
		return (date - OAEpoch) / msInDay;
	},

	OADateNow() {
		return this.toOADate(Date.now());
	},

	newLibrary() {
		const library = {
			caption: 'New Library',
			id: this.randomId(),
			advanced: false,
			author: '',
			version: 100,
			changed: this.OADateNow(),
			info: 'Here you can enter basic information about your library and what it does.\n',
			init: [
				'/**',
				' * This code will be executed when your library is loaded.',
				' */',
				'{',
				'\t// say something',
				'\tshow_message("Hello, World!");',
				'}',
				''
			].join('\n'),
			actions: [],
		};
		return library;
	},

	padArgumentList(args) {
		for (let i = args.length; i < this.MAX_ARGS; ++i) {
			args.push({
				caption: "Argument " + i + ":",
				kind: ARG_KINDS.EXPRESSION,
				default: "0",
				options: "item 1|item 2"
			});
		}
	},

	newAction(library) {
		const action = {
			parent: library,
			name: "Action " + library.actions.length,
			id: library.actions.length,
			image: DEFAULT_IMAGE,
			hidden: false,
			advanced: false,
			registered: false,
			description: '',
			list: '',
			hint: '',
			kind: ACT_KINDS.NORMAL,
			ifaceKind: ACT_IFACE_KINDS.NORMAL,
			question: false,
			apply: false,
			relative: false,

			argnum: 0,
			args: [],

			execType: ACT_EXEC_TYPES.FUNCTION,
			execInfo: ''
		};
		this.padArgumentList(action.args);
		return action;
	},

	deserializeLIB(data, version) {
		const ver = data[3];
		if (ver) throw "Expected 0 @ 3 got " + ver;
		const lib = { };
		const decoder = new Decoder(data, 4);

		lib.caption = decoder.readStr();
		lib.id = decoder.read4();
		lib.author = decoder.readStr();
		lib.version = decoder.read4();
		lib.changed = decoder.readD();
		lib.info = decoder.readStr();
		lib.init = decoder.readStr();
		lib.advanced = decoder.readBool();
		decoder.skip(4); // skip no of actions/official lib identifier thingy
		const acts = decoder.read4();
		lib.actions = [];
		for (let i = 0; i < acts; i++) {
			const ver = decoder.read4();
			if (ver != 500 && ver != 520) throw "Action #" + i + " failed to have 500 or 520 got " + ver;
			const act = { parent: lib };
			lib.actions.push(act);

			act.name = decoder.readStr();
			act.id = decoder.read4();
			act.image = "data:image/image;base64," + btoa(decoder.readStr());
			act.hidden = decoder.readBool();
			act.advanced = decoder.readBool();
			if (ver == 520) act.registered = decoder.readBool();
			act.description = decoder.readStr();
			act.list = decoder.readStr();
			act.hint = decoder.readStr();
			act.kind = decoder.read4();
			act.ifaceKind = decoder.read4();
			act.question = decoder.readBool();
			act.apply = decoder.readBool();
			act.relative = decoder.readBool();

			act.argnum = decoder.read4();
			const argnum = decoder.read4();
			act.args = [];
			for (let k = 0; k < argnum; k++) {
				if (k < this.MAX_ARGS) {
					act.args.push({
						caption: decoder.readStr(),
						kind: decoder.read4(),
						default: decoder.readStr(),
						options: decoder.readStr()
					});
				} else {
					decoder.skip(decoder.read4());
					decoder.skip(4);
					decoder.skip(decoder.read4());
					decoder.skip(decoder.read4());
				}
			}

			act.execType = decoder.read4();
			act.execInfo = "";
			if (act.execType === ACT_EXEC_TYPES.FUNCTION)
				act.execInfo = decoder.readStr();
			else
				decoder.skip(decoder.read4());
			if (act.execType === ACT_EXEC_TYPES.CODE)
				act.execInfo = decoder.readStr();
			else
				decoder.skip(decoder.read4());
		}

		return lib;
	},

	loadLGLIcons(lib, decoder) {
		const base64 = "data:image/image;base64," + btoa(decoder.readStrEnd());

		const img = new Image();
		img.crossOrigin = "Anonymous";
		img.onload = function() {
			const canvas = document.createElement("canvas");
			canvas.width = 24;
			canvas.height = 24;
			const ctx = canvas.getContext("2d");
			ctx.globalCompositeOperation = "copy";

			let i = 0;
			const columns = img.width / 24;
			for (act of lib.actions) {
				if (actKindHasImage(act.kind)) {
					ctx.drawImage(img, 24 * (i % columns), 24 * ((i / columns)|0), 24, 24, 0, 0, 24, 24);
					act.image = canvas.toDataURL();
					++i;
				} else {
					act.image = DEFAULT_IMAGE;
				}
			}
		};
		img.src = base64;

		return lib;
	},

	deserializeLGL(data) {
		const ver = (data[3] | data[4] << 8);
		if (ver != 160) throw "Expected 160 @ 3 got " + ver;
		const lib = { };
		const decoder = new Decoder(data, 5);

		lib.id = decoder.read3();
		lib.caption = decoder.readStr1();
		lib.author = decoder.readStr1();
		lib.version = decoder.read4();
		lib.changed = decoder.readD();
		lib.info = decoder.readStr();
		lib.init = decoder.readStr();
		let acts = decoder.read1();
		lib.advanced = !!(acts & 128);
		acts &= 127;
		lib.actions = [];
		for (let i = 0; i < acts; i++) {
			const ver = decoder.read2();
			if (ver != 160) throw "Action #" + i + " failed to have 160 got " + ver;
			const act = { parent: lib, image: undefined };
			lib.actions.push(act);

			act.id = decoder.read2();
			act.name = decoder.readStr1();
			act.description = decoder.readStr1();
			act.list = decoder.readStr1();
			act.hint = decoder.readStr1();

			let tags = decoder.read1();
			act.hidden = !!(tags & 128);
			act.advanced = !!(tags & 64);
			act.registered = !!(tags & 32);
			act.question = !!(tags & 16);
			act.apply = !!(tags & 8);
			act.relative = !!(tags & 4);
			act.execType = tags & 3;
			act.execInfo = decoder.readStr();
			tags = decoder.read1();
			act.kind = tags >> 4;
			act.ifaceKind = tags & 15;

			const argnum = decoder.read1();
			act.argnum = argnum;
			act.args = [];
			for (let k = 0; k < argnum; k++) {
				act.args.push({
					caption: decoder.readStr1(),
					kind: decoder.read1(),
					default: decoder.readStr1(),
					options: decoder.readStr1()
				});
			}
			this.padArgumentList(act.args);
		}

		return this.loadLGLIcons(lib, decoder);
	},

	deserialize(data) {
		data = new Uint8Array(data);
		const header = data[0] | data[1] << 8 | data[2] << 16;
		if (header == 500 || header == 520)
			return this.deserializeLIB(data, header);
		else if (header == 4998988)
			return this.deserializeLGL(data);
		else
			throw "Unknown header: " + header;
	},

	serializeLIB(lib, callback, ver = 520) {
		const encoder = new Encoder();
		ver = ver >= 520 ? 520 : 500;
		encoder.write4(ver);
		encoder.writeStr4(lib.caption);
		encoder.write4(lib.id);
		encoder.writeStr4(lib.author);
		encoder.write4(lib.version);
		lib.changed = this.OADateNow();
		encoder.writeD(lib.changed);
		encoder.writeStr4(lib.info);
		encoder.writeStr4(lib.init);
		encoder.writeBool(lib.advanced);

		encoder.write4(lib.actions.length); // no of actions/official lib identifier thingy
		encoder.write4(lib.actions.length);

		const images = [];
		let l = 0;
		for (let i = 0; i < lib.actions.length; ++i) {
			const act = lib.actions[i];

			const imageLoaded = function(blob) {
				const reader = new FileReader();
				reader.onload = function(e) {
					images[i] = reader.result;
					if (++l === lib.actions.length) {
						allImagesLoaded(images);
					}
				};
				reader.readAsBinaryString(blob);
			};

			const canvas = document.createElement("canvas");
			canvas.width = 32;
			canvas.height = 32;
			const ctx = canvas.getContext("2d");
			ctx.globalCompositeOperation = "copy";

			const img = new Image();
			img.crossOrigin = "Anonymous";
			img.onload = function() {
				ctx.drawImage(img, 0, 0);
				if (canvas.msToBlob) {
					const blob = canvas.msToBlob("image/bmp");
					imageLoaded(blob);
				} else {
					canvas.toBlob(imageLoaded, "image/bmp");
				}
			};
			img.src = act.image;
		}

		const allImagesLoaded = function(images) {
			for (let i = 0; i < lib.actions.length; ++i) {
				const act = lib.actions[i];
				encoder.write4(ver);
				encoder.writeStr4(act.name);
				encoder.write4(act.id);

				encoder.writeStr4(images[i]);
	
				encoder.writeBool(act.hidden);
				encoder.writeBool(act.advanced);
				if (ver == 520) encoder.writeBool(act.registered);
				encoder.writeStr4(act.description);
				encoder.writeStr4(act.list);
				encoder.writeStr4(act.hint);
				encoder.write4(act.kind);
				encoder.write4(act.ifaceKind);
				encoder.writeBool(act.question);
				encoder.writeBool(act.apply);
				encoder.writeBool(act.relative);
				encoder.write4(act.argnum);
				encoder.write4(8); //8 vs act.argNum vs MAX_ARGS?
	
				//This always writes MAX_ARGS arguments. Alternatively, we could just write
				//argNum arguments, and truncate the remaining invisible/unused arguments.
				for (arg of act.args) {
					encoder.writeStr4(arg.caption);
					encoder.write4(arg.kind);
					encoder.writeStr4(arg.default);
					encoder.writeStr4(arg.options);
				}
				for (let k = act.args.length; k < 8; k++) {
					encoder.writeStr4(STR_EMPTY);
					encoder.write4(0);
					encoder.writeStr4(STR_EMPTY);
					encoder.writeStr4(STR_EMPTY);
				}
	
				const execType = act.execType;
				const execInfo = act.execInfo;
				encoder.write4(execType);
				encoder.writeStr4(execType === ACT_EXEC_TYPES.FUNCTION ? execInfo : STR_EMPTY);
				encoder.writeStr4(execType === ACT_EXEC_TYPES.CODE ? execInfo : STR_EMPTY);
			}

			callback(encoder.data.slice(0, encoder.i));
		}
	},

	saveLGLIcons(lib, callback, columns = 0) {
		let actnum = 0;
		for (act of lib.actions) if (actKindHasImage(act.kind)) ++actnum;
		if (!columns) columns = Math.floor(Math.sqrt(actnum)); 
		const rows = Math.ceil(actnum / columns);

		const canvas = document.createElement("canvas");
		canvas.width = columns * 24;
		canvas.height = rows * 24;
		const ctx = canvas.getContext("2d");

		let i = 0, l = 0;
		for (act of lib.actions) {
			if (!actKindHasImage(act.kind)) continue;
			const j = i++;
			const img = new Image();
			img.crossOrigin = "Anonymous";
			img.onload = function() {
				ctx.drawImage(img, 0, 0, 24, 24, 24 * (j % columns), 24 * ((j / columns)|0), 24, 24);
				if (++l === actnum) {
					if (canvas.msToBlob) {
						const blob = canvas.msToBlob("image/png");
						callback(blob);
					} else {
						canvas.toBlob(callback, "image/png");
					}
				}
			};
			img.src = act.image;
		}
	},

	serializeLGL(lib, callback, columns = 0) {
		const HDR = "LGL";
		const VER = 160;
		const encoder = new Encoder();

		encoder.writeStr(HDR);
		encoder.write2(VER);

		encoder.write3(lib.id);
		encoder.writeStr1(lib.caption);
		encoder.writeStr1(lib.author);
		encoder.write4(lib.version);

		lib.changed = this.OADateNow();
		encoder.writeD(lib.changed);
		
		encoder.writeStr4(lib.info);
		encoder.writeStr4(lib.init);

		let acts = lib.advanced ? 128 : 0;
		acts |= lib.actions.length;
		encoder.write1(acts);

		for (act of lib.actions) {
			encoder.write2(VER);

			encoder.write2(act.id);
			encoder.writeStr1(act.name);
			encoder.writeStr1(act.description);
			encoder.writeStr1(act.list);
			encoder.writeStr1(act.hint);

			let mask = act.hidden ? 128 : 0;
			mask |= act.advanced ? 64 : 0;
			mask |= act.registered ? 32 : 0;
			mask |= act.question ? 16 : 0;
			mask |= act.apply ? 8 : 0;
			mask |= act.relative ? 4 : 0;
			mask |= act.execType; //(0-2)
			encoder.write1(mask);
			encoder.writeStr4(act.execInfo);

			let kind = act.kind << 4;
			kind |= act.ifaceKind;
			encoder.write1(kind);

			const argnum = act.argnum;
			encoder.write1(argnum);
			for (let k = 0; k < argnum; k++) {
				const arg = act.args[k];
				encoder.writeStr1(arg.caption);
				encoder.write1(arg.kind);
				encoder.writeStr1(arg.default);
				encoder.writeStr1(arg.options);
			}
		}

		this.saveLGLIcons(lib, function(blob) {
			const reader = new FileReader();
			reader.onload = (e) => {
				encoder.writeStr(reader.result);
				callback(encoder.data.slice(0, encoder.i));
			};
			reader.readAsBinaryString(blob);
		}, columns);
	}
}
