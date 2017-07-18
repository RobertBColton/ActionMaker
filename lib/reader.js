
function Reader(data, i) {
	this.data = data;
	this.i = i;
}

Reader.prototype.skip = function(length) {
	this.i += length;
}

Reader.prototype.read1 = function() {
	return this.data[this.i++];
}

Reader.prototype.read2 = function() {
	this.i += 2;
	return this.data[this.i-2] | this.data[this.i-1] << 8;
}

Reader.prototype.read3 = function() {
	this.i += 3;
	return this.data[this.i-3] | this.data[this.i-2] << 8 | this.data[this.i-1] << 16;
}

Reader.prototype.read4 = function() {
	this.i += 4;
	return this.data[this.i-4] | this.data[this.i-3] << 8 | this.data[this.i-2] << 16 | this.data[this.i-1] << 24;
}

Reader.prototype.readBool = function() {
	return this.read4() != 0;
}

Reader.prototype.readD = function() {
	var res = new Float64Array(this.data.slice(this.i, this.i + 8).buffer);
	this.i += 8;
	return res[0];
}

Reader.prototype.readStr1 = function() {
	var len = this.read1(), s = "";
	for (var j = 0; j < len; j++) {
		s += String.fromCharCode(this.read1());
	}
	return s;
}

Reader.prototype.readStr = function() {
	var len = this.read4(), s = "";
	for (var j = 0; j < len; j++) {
		s += String.fromCharCode(this.read1());
	}
	return s;
}

Reader.prototype.readStrEnd = function() {
	var len = this.data.length - this.i, s = "";
	for (var j = 0; j < len; j++) {
		s += String.fromCharCode(this.read1());
	}
	return s;
}

var KINDS = ["NORMAL", "BEGIN_GROUP", "END_GROUP", "ELSE", "EXIT", "REPEAT", "VARIABLE", "CODE", "PLACEHOLDER", "SEPAARATOR", "LABEL"];
var EXEC_TYPES = ["NOTHING", "FUNCTION", "CODE"];
var IFACE_KINDS = ["NORMAL", "NONE", "ARROWS", null, null, "CODE", "TEXT"];
var ARG_KINDS = ["EXPRESSION", "STRING", "BOTH", "BOOLEAN", "MENU", "SPRITE", "SOUND", "BACKGROUND", "PATH", "SCRIPT", "OBJECT", "ROOM", "FONT", "COLOR", "TIMELINE", "FONT_STRING"];

export default {
	loadLGLIcons: function(lib, reader) {
		alert(reader.i + " " + reader.data.length);
		var base64 = btoa(reader.readStrEnd());
		lib.actions[0].image = "data:image/image;base64," + base64;
		return lib;
	},

	deserializeLIB: function(data, version) {
		var ver = data[3];
		if (ver) {
			throw "Expected 0 @ 3 got " + ver;
		}
		var lib = { };
		var reader = new Reader(data, 4);

		lib.caption = reader.readStr();
		lib.id = reader.read4();
		lib.author = reader.readStr();
		lib.version = reader.read4();
		lib.changed = reader.readD();
		lib.info = reader.readStr();
		lib.init_code = reader.readStr();
		lib.advanced = reader.readBool();
		reader.skip(4); // skip no of actions/official lib identifier thingy
		var acts = reader.read4();
		lib.actions = [];
		for (var i = 0; i < acts; i++) {
			var ver = reader.read4();
			if (ver != 500 && ver != 520) {
				throw "Action #" + i + " failed to have 500 or 520 got " + ver;
			}
			var act = { parent: lib };
			lib.actions.push(act);

			act.name = reader.readStr();
			act.id = reader.read4();
			act.image = "data:image/image;base64," + btoa(reader.readStr());
			act.hidden = reader.readBool();
			act.advanced = reader.readBool();
			if (ver == 520) act.registered = reader.readBool();
			act.description = reader.readStr();
			act.list = reader.readStr();
			act.hint = reader.readStr();
			act.kind = KINDS[reader.read4()];
			act.iface_kind = IFACE_KINDS[reader.read4()];
			act.question = reader.readBool();
			act.apply = reader.readBool();
			act.relative = reader.readBool();

			act.argnum = reader.read4();
			var argnum = reader.read4();
			act.args = [];
			for (var k = 0; k < argnum; k++) {
				if (k < 8) {
					act.args.push({
						caption: reader.readStr(),
						kind: ARG_KINDS[reader.read4()],
						default: reader.readStr(),
						menuopts: reader.readStr(),
					});
				} else {
					reader.skip(reader.read4());
					reader.skip(reader.read4());
					reader.skip(4);
					reader.skip(reader.read4());
				}
			}

			act.exec_type = EXEC_TYPES[reader.read4()];
			if (act.exec_type === 'FUNCTION')
				act.exec_info = reader.readStr();
			else
				reader.skip(reader.read4());
			if (act.exec_type === 'CODE')
				act.exec_info = reader.readStr();
			else
				reader.skip(reader.read4());
		}

		return lib;
	},

	deserializeLGL: function(data) {
		var ver = (data[3] | data[4] << 8);
		if (ver != 160) {
			throw "Expected 160 @ 3 got " + ver;
		}
		var lib = { };
		var reader = new Reader(data, 5);

		lib.id = reader.read3();
		lib.caption = reader.readStr1();
		lib.author = reader.readStr1();
		lib.version = reader.read4();
		lib.changed = reader.readD();
		lib.info = reader.readStr();
		lib.init_code = reader.readStr();
		var acts = reader.read1();
		lib.advanced = !!(acts & 128);
		acts &= 127;
		lib.actions = [];
		for (var i = 0; i < acts; i++) {
			var ver = reader.read2();
			if (ver != 160) {
				throw "Action #" + i + " failed to have 160 got " + ver;
			}
			var act = { parent: lib };
			lib.actions.push(act);

			act.id = reader.read2();
			act.name = reader.readStr1();
			act.description = reader.readStr1();
			act.list = reader.readStr1();
			act.hint = reader.readStr1();

			var tags = reader.read1();
			act.hidden = !!(tags & 128);
			act.advanced = !!(tags & 64);
			act.registered = !!(tags & 32);
			act.question = !!(tags & 16);
			act.apply = !!(tags & 8);
			act.relative = !!(tags & 4);
			act.exec_type = EXEC_TYPES[tags & 3];
			act.exec_info = reader.readStr();
			tags = reader.read1();
			act.kind = KINDS[tags >> 4];
			act.iface_kind = IFACE_KINDS[tags & 15];

			var argnum = reader.read1();
			act.argnum = argnum;
			act.args = [];
			for (var k = 0; k < argnum; k++) {
				act.args.push({
					caption: reader.readStr1(),
					kind: ARG_KINDS[reader.read1()],
					default: reader.readStr1(),
					menuopts: reader.readStr1(),
				});
			}
		}

		return this.loadLGLIcons(lib, reader);
	},

	deserialize: function (file, onload) {
		if (!file) return;

		var reader = new FileReader();
		var ext = file.name.split('.').pop().toLowerCase();

		reader.onload = (e) => {
			var data = new Uint8Array(reader.result);
			var header = data[0] | data[1] << 8 | data[2] << 16;
			if (header == 500 || header == 520) {
				onload(this.deserializeLIB(data, header));
			} else if (header == 4998988) {
				onload(this.deserializeLGL(data));
			} else {
				throw "Unknown header: " + header;
			}
		}

		reader.readAsArrayBuffer(file);
	}
}
