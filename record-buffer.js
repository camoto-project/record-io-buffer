module.exports = class RecordBuffer
{
	constructor(p) {
		if (p instanceof Buffer) {
			this.buffer = p;
		} else {
			this.buffer = Buffer.alloc(p || 1048576);
		}
		this.pos = 0;
	}

	distFromEnd() {
		return this.buffer.length - this.pos;
	}

	ensureFreeSpace(amt) {
		if (this.pos + amt > this.buffer.length) {
			//console.log('Enlarging buffer from', this.buffer.length, 'to', this.buffer.length + amt + 1048576, 'to fit extra', this.pos, '+', amt);
			let newBuf = Buffer.alloc(this.buffer.length + amt + 1048576);
			this.buffer.copy(newBuf);
			this.buffer = newBuf;
		}
	}
	getBuffer() {
		return this.buffer.slice(0, this.pos);
	}

	getPos() {
		return this.pos;
	}

	/// Put the given data into the file and advance the pointer.
	/**
	 * @param Buffer buf
	 *   Source data to copy here.
	 *
	 * @return None.
	 *
	 * @postconditions The file pointer has been advanced by buf.length.
	 */
	put(buf) {
		this.ensureFreeSpace(buf.length);
		buf.copy(this.buffer, this.pos);
		this.pos += buf.length;
	}

	readRecord(rec) {
		let out = {};
		Object.keys(rec).forEach(k => {
			if (!rec[k]) {
				const msg = `Unable to read record as element "${k}" is an undefined type.`;
				console.error(msg);
				throw msg;
			}
			out[k] = rec[k].read(this);
			this.pos += rec[k].len;
		});
		return out;
	}

	// negative will seek from EOF
	seekAbs(offset) {
		if (offset < 0) {
			this.pos = this.buffer.length + offset;
		} else {
			this.pos = offset;
		}
	}

	seekRel(offset) {
		this.pos += offset;
		this.pos = Math.max(this.pos, 0);
		this.pos = Math.min(this.pos, this.buffer.length);
	}

	sliceBlock(offset, len) {
		return this.buffer.slice(offset, offset + len);
	}

	/// Write a value directly.
	/**
	 * @param RecordType type
	 *   Data type to write, e.g. RecordType.int.u8.
	 *
	 * @param mixed b
	 *   Value to write.
	 *
	 * @return None.
	 *
	 * @postconditions File pointer advanced by the size of the type written.
	 */
	write(type, b) {
		this.ensureFreeSpace(type.len);
		type.write(this, b);
		this.pos += type.len;
	}

	writeRecord(rec, obj) {
		Object.keys(rec).forEach(k => {
			this.ensureFreeSpace(rec[k].len || 1048576);
			rec[k].write(this, obj[k]);
			this.pos += rec[k].len;
		});
	}
};
