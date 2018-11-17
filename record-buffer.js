/**
 * @brief Buffer that can have data structure "records" read and written.
 *
 * Copyright (C) 2018 Adam Nielsen <malvineous@shikadi.net>
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
	constructor(p) {
		if (typeof p === "number") {
			this.buffer = Buffer.alloc(p || 1048576);
			this.length = 0;
		} else {
			this.buffer = p;
			this.length = p.length;
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

	getBuffer(len) {
		return this.buffer.slice(0, len || this.length);
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
