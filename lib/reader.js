
export default {
    deserializeLIB: function(reader) {
        var library = { };

        library.caption = "heller";

        return library;
    },

    deserializeLGL: function(reader) {
        var library = { };

        return library;
    },

    deserialize: function (file) {
        if (!file) return;

        var reader = new FileReader();
        var ext = file.name.split('.').pop().toLowerCase();

        reader.onload = (e) => {
            var data = reader.result;
            var dataView = new DataView(data);
            alert(dataView.getUint8(0));
            alert(dataView.getUint8(1));
            alert(dataView.getUint8(2));
            var val;
            val = dataView.getUint8(2) << 16;
            val |= dataView.getUint8(1) << 8;
            val |= dataView.getUint8(0);
            alert(val);
            var header = dataView;
            alert(header << 8);
            if (ext === 'lib' || header == 500 || header == 520) {
                return this.deserializeLIB(reader);
            } else if (ext === 'lgl' || header == ('L'.charCodeAt(0) << 16) | ('G'.charCodeAt(0) << 8) | 'L'.charCodeAt(0)) {
                return this.deserializeLGL(reader);
            }
        }

        reader.readAsArrayBuffer(file);
    }
}
