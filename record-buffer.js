/*
 * Buffer that can have data structure "records" read and written.
 *
 * Copyright (C) 2018-2021 Adam Nielsen <malvineous@shikadi.net>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

module.exports = class RecordBuffer
{
	/**
	 * Create a new RecordBuffer.
	 *
	 * @param {Number} | {ArrayBuffer} | {TypedArray} p
	 *   Data source.
	 *   - {Number} preallocates that much space to write into.
	 *   - {ArrayBuffer} accesses the buffer directly (no copying), so is fast.
	 *   - {TypedArray} copies the array into a new ArrayBuffer, so incurs a
	 *     cost during object construction.
	 */
	constructor(p) {
		if (typeof p === "number") {
			this.buffer = new ArrayBuffer(p || 1048576);
			this.length = 0;
		} else if (p instanceof ArrayBuffer) {
			this.buffer = p;
			this.length = p.byteLength;
		} else if (p && p.buffer && (p.byteOffset !== undefined)) { // TypedArray
			this.buffer = new ArrayBuffer(p.byteLength);
			const src = new Uint8Array(p.buffer, p.byteOffset, p.byteLength);
			let dv = new Uint8Array(this.buffer);
			dv.set(src);
			this.length = p.byteLength;
		} else {
			throw new Error('Unsupported type passed to RecordBuffer constructor');
		}
		this.dataview = new DataView(this.buffer);
		this.pos = 0;
	}

	distFromEnd() {
		return this.length - this.pos;
	}

	ensureFreeSpace(amt) {
		if (this.pos + amt > this.buffer.byteLength) {
			let newBuffer = new ArrayBuffer(this.pos + amt + 1048576);
			let newView = new Uint8Array(newBuffer);
			newView.set(new Uint8Array(this.buffer));
			this.buffer = newBuffer;
			this.dataview = new DataView(this.buffer);
		}
	}

	getU8(offset = 0, len) {
		return new Uint8Array(this.buffer, offset, len || this.length)
	}

	getPos() {
		return this.pos;
	}

	/// Put the given data into the file and advance the pointer.
	/**
	 * @param {Object} buf
	 *   Source data to copy here.  Can be a {Uint8Array}, a normal {Array} of
	 *   numbers (0-255), an {ArrayBuffer} or another {RecordBuffer}.
	 *
	 * @return None.
	 *
	 * @postconditions The file pointer has been advanced by buf.length.
	 */
	put(buf) {
		if (buf instanceof ArrayBuffer) {
			// ArrayBuffer objects can't be written directly, so access them via a
			// TypedArray instead.
			buf = new Uint8Array(buf);
		} else if (buf instanceof RecordBuffer) {
			buf = buf.getU8();
		}
		this.ensureFreeSpace(buf.length);
		let target = new Uint8Array(this.buffer, this.pos, buf.length);
		target.set(buf);
		this.pos += buf.length;
		this.updateLength();
	}

	/// Read a value directly.
	/**
	 * @param RecordType type
	 *   Data type to read, e.g. RecordType.int.u8.
	 *
	 * @return Value read.
	 *
	 * @postconditions File pointer advanced by the size of the type written.
	 */
	read(type) {
		const v = type.read(this);
		this.pos += type.len;
		return v;
	}

	readRecord(rec) {
		let out = {};
		Object.keys(rec).forEach(k => {
			if (!rec[k]) {
				const msg = `Unable to read record as element "${k}" is an undefined type.`;
				console.error(msg);
				throw msg;
			}
			out[k] = this.read(rec[k]);
		});
		return out;
	}

	// negative will seek from EOF
	seekAbs(offset) {
		if (offset < 0) {
			this.pos = this.buffer.byteLength + offset;
		} else {
			this.pos = offset;
		}
	}

	seekRel(offset) {
		this.pos += offset;
		this.pos = Math.max(this.pos, 0);
		this.pos = Math.min(this.pos, this.buffer.byteLength);
	}

	/// Make the length the offset of the last bit of data we've written.
	updateLength() {
		this.length = Math.max(this.length, this.pos);
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
		// If we don't know how much data is going to be written, make sure there's
		// enough room for 1024 bytes.  This should be large enough to handle
		// anything as it's unlikely that the largest fields - variable-length
		// strings - will be longer than 256 characters.
		this.ensureFreeSpace(type.len || 1024);
		type.write(this, b);
		this.pos += type.len;
		this.updateLength();
	}

	writeRecord(rec, obj) {
		Object.keys(rec).forEach(k => {
			try {
				this.write(rec[k], obj[k]);
			} catch (e) {
				throw new Error(`Unable to write element '${k}': ${e.message}`);
			}
		});
	}
};
