function Reader(data, i) {
	this.data = data;
	this.i = i;
}
Reader.prototype.read1 = function() {
	return this.data[this.i++];
}
Reader.prototype.read2 = function() {
	i += 2;
	return this.data[this.i-2] | this.data[i-1] << 8;
}
Reader.prototype.read3 = function() {
	this.i += 3;
	return this.data[this.i-3] | this.data[i-2] << 8 | this.data[i-1] << 16;
}
Reader.prototype.read4 = function() {
	this.i += 4;
	return this.data[this.i-4] | this.data[i-3] << 8 | this.data[i-2] << 16 | this.data[i-1] << 24;
}
Reader.prototype.readD = function() {
	var res = new Float64Array(this.data.slice(i, i+8).buffer);
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

export default {
	loadLGLIcons(lib, reader) {
		return lib
	}

	deserializeLIB: function(data, version) {
		var lib = { };

		return lib;
	},

	deserializeLGL: function(data) {
		var lib = { };
		if ((data[4] | data[5] << 8) != 160) {
			throw "Expected 160 @ 4";
		}
		var reader = new Reader(data, 6);
		lib.id = reader.read3();
		lib.caption = reader.readD();
		lib.author = reader.readStr1();
		lib.version = reader.read4();
		lib.changed = reader.readD();
		lib.info = reader.readStr();
		lib.init_code = reader.readStr();
		var acts = reader.read1();
		lib.advanced = !!(acts & 128);
		acts &= 127;
		lib.acts = [];
		for (var i=0; i<acts; i++) {
			if (reader.read2() != 160) {
				throw "Action #" + i + " failed to have 160";
			}
			var act = { parent: lib };
			lib.acts.push(act);

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
			act.exec_type = ["NOTHING", "FUNCTION", "CODE"][tags&3];
			act.exec_info = reader.readStr();
			tags = reader.read1();
			act.kind = ["NORMAL", "BEGIN_GROUP", "END_GROUP", "ELSE", "EXIT", "REPEAT", "VARIABLE", "CODE", "PLACEHOLDER", "SEPAARATOR", "LABEL"][tags >> 4];
			act.iface_kind = ["NORMAL", "NONE", "ARROWS", null, null, "CODE", "TEXT"][tags & 15];

			var argnum = reader.read4();
			act.argnum = argnum;
			act.args = [];
			for (var k = 0; k < argnum; k++) {
				act.args.push({
					caption: reader.readStr1(),
					kind: ["EXPRESSION", "STRING", "BOTH", "BOOLEAN", "MENU", "SPRITE", "SOUND", "BACKGROUND", "PATH", "SCRIPT", "OBJECT", "ROOM", "FONT", "COLOR", "TIMELINE", "FONT_STRING"][reader.read4()],
					default: reader.readStr1(),
					menuopts: reader.readStr1(),
				});
			}
		}

		return loadLGLIcons(lib, reader)
	},

	deserialize: function (file) {
		if (!file) return;

		var reader = new FileReader();
		var ext = file.name.split('.').pop().toLowerCase();

		reader.onload = (e) => {
			var data = new Uint8Array(reader.result);
			var head3 = data[0] | data[1] << 8 | data[2] << 16;
			if (header == 500 || header == 520) {
				return this.deserializeLIB(data, header);
			} else if (head3 == 4998988) {
				return this.deserializeLGL(data);
			} else {
				throw "Unknown header: " + head3;
			}
		}

		reader.readAsArrayBuffer(file);
	}
}
