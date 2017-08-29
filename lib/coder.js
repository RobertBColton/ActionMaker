
function Encoder() {
	this.data = new Uint8Array(10000000);
	this.i = 0;
}

Encoder.prototype.write1 = function(value) {
	this.data[this.i++] = value;
}

Encoder.prototype.write2 = function(value) {
	this.data[this.i] = value & 255;
	this.data[this.i+1] = (value >>> 8) & 255;
	this.i += 2;
}

Encoder.prototype.write3 = function(value) {
	this.data[this.i] = value & 255;
	this.data[this.i+1] = (value >>> 8) & 255;
	this.data[this.i+2] = (value >>> 16) & 255;
	this.i += 3;
}

Encoder.prototype.write4 = function(value) {
	this.data[this.i] = value & 255;
	this.data[this.i+1] = (value >>> 8) & 255;
	this.data[this.i+2] = (value >>> 16) & 255;
	this.data[this.i+3] = (value >>> 24) & 255;
	this.i += 4;
}

Encoder.prototype.writeBool = function(value) {
	this.write4(value ? 1 : 0);
}

Encoder.prototype.writeD = function(value) {
	const res = new DataView(this.data.buffer, this.i, 8);
	res.setFloat64(0, value, true);
	this.i += 8;
}

Encoder.prototype.writeStr = function(value) {
	for (let i = 0; i < value.length; i++) {
		this.data[this.i++] = value.charCodeAt(i);
	}
}

Encoder.prototype.writeStr4 = function(value) {
	this.write4(value.length);
	this.writeStr(value);
}

Encoder.prototype.writeStr1 = function(value) {
	this.write1(value.length);
	this.writeStr(value);
}

function Decoder(data, i = 0) {
	this.data = data;
	this.i = i;
}

Decoder.prototype.skip = function(length) {
	this.i += length;
}

Decoder.prototype.read1 = function() {
	return this.data[this.i++];
}

Decoder.prototype.read2 = function() {
	this.i += 2;
	return this.data[this.i-2] | this.data[this.i-1] << 8;
}

Decoder.prototype.read3 = function() {
	this.i += 3;
	return this.data[this.i-3] | this.data[this.i-2] << 8 | this.data[this.i-1] << 16;
}

Decoder.prototype.read4 = function() {
	this.i += 4;
	return this.data[this.i-4] | this.data[this.i-3] << 8 | this.data[this.i-2] << 16 | this.data[this.i-1] << 24;
}

Decoder.prototype.readBool = function() {
	return this.read4() != 0;
}

Decoder.prototype.readD = function() {
	const res = new Float64Array(this.data.slice(this.i, this.i + 8).buffer);
	this.i += 8;
	return res[0];
}

Decoder.prototype.readStr1 = function() {
	const len = this.read1(); let s = "";
	for (let j = 0; j < len; j++) {
		s += String.fromCharCode(this.read1());
	}
	return s;
}

Decoder.prototype.readStr = function() {
	const len = this.read4(); let s = "";
	for (let j = 0; j < len; j++) {
		s += String.fromCharCode(this.read1());
	}
	return s;
}

Decoder.prototype.readStrEnd = function() {
	const len = this.data.length - this.i; let s = "";
	for (let j = 0; j < len; j++) {
		s += String.fromCharCode(this.read1());
	}
	return s;
}

export { Encoder, Decoder };
 