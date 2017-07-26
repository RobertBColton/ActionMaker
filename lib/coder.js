
function Decoder(data, i) {
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
	var res = new Float64Array(this.data.slice(this.i, this.i + 8).buffer);
	this.i += 8;
	return res[0];
}

Decoder.prototype.readStr1 = function() {
	var len = this.read1(), s = "";
	for (var j = 0; j < len; j++) {
		s += String.fromCharCode(this.read1());
	}
	return s;
}

Decoder.prototype.readStr = function() {
	var len = this.read4(), s = "";
	for (var j = 0; j < len; j++) {
		s += String.fromCharCode(this.read1());
	}
	return s;
}

Decoder.prototype.readStrEnd = function() {
	var len = this.data.length - this.i, s = "";
	for (var j = 0; j < len; j++) {
		s += String.fromCharCode(this.read1());
	}
	return s;
}

 export { Decoder };
 