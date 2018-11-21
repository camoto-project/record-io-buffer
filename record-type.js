/**
 * @brief Various data types supported by the library.
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

const charset = {
	cp437: 'binary', // TODO: find a supported one
	utf8: 'utf8',
};

module.exports = {
	string: {
		fixed: {
			withNulls: len => ({
				read: bw => bw.buffer.toString(charset.cp437, bw.pos, bw.pos + len),
				write: (bw, val) => bw.buffer.write(val, bw.pos, Math.min(len, val.length), charset.cp437),
				len: len,
			}),

			nullTerm: len => ({
				read: bw => {
					const full = bw.buffer.toString(charset.cp437, bw.pos, bw.pos + len);
					let end = full.indexOf('\0', 0);
					if (end >= 0) {
						// Has a null embedded, end the string there
						return full.slice(0, end);
					}
					return full; // no null
				},
				write: (b, val) => {
					if (val === undefined) {
						throw new Error('Cannot write undefined value');
					}
					// The space we're writing into has already been zero-filled
					// so we can just write one char shorter than the max and
					// we'll always have a null-terminated string.
					b.buffer.write(val, b.pos, Math.min(len - 1, val.length), charset.cp437);
				},
				len: len, // always read same (fixed) length
			}),

			// Optional null-termination
			optNullTerm: len => ({
				read: bw => { // COPY of nullTerm.read
					const full = bw.buffer.toString(charset.cp437, bw.pos, bw.pos + len);
					let end = full.indexOf('\0', 0);
					if (end >= 0) {
						// Has a null embedded, end the string there
						return full.slice(0, end);
					}
					return full; // no null
				},
				write: (b, val) => {
					if (val === undefined) {
						throw new Error('Cannot write undefined value');
					}
					// The space we're writing into has already been zero-filled
					// so we can just write the max and if the string is shorter
					// the existing zero bytes will null-terminate it early.
					b.buffer.write(val, b.pos, Math.min(len, val.length), charset.cp437);
				},
				len: len, // always read same (fixed) length
			}),
		},
		variable: {
			// Read a null-terminated string, up to maxlen chars long.
			// Actual bytes read will be between 1 and maxlen.
			nullTerm: maxlen => ({
				read: bw => {
					let len = bw.buffer.indexOf(0, bw.pos);
					if (len < 0) len = maxlen; // missing terminating null
					return bw.buffer.toString(charset.cp437, bw.pos, bw.pos + len);
				},
				write: null,
				len: 0,
			}),
		},
	},
	char: (len, codepage) => ({
		read: bw => bw.buffer.toString(codepage || charset.cp437, bw.pos, bw.pos + len),
		write: null,
		len: len,
	}),
	int: {
		u8: {
			read: bw => bw.buffer.readUInt8(bw.pos),
			write: (bw, val) => bw.buffer.writeUInt8(val, bw.pos),
			len: 1,
		},
		u16le: {
			read: bw => bw.buffer.readUInt16LE(bw.pos),
			write: (bw, val) => bw.buffer.writeUInt16LE(val, bw.pos),
			len: 2,
		},
		u16be: {
			read: bw => bw.buffer.readUInt16BE(bw.pos),
			write: (bw, val) => bw.buffer.writeUInt16BE(val, bw.pos),
			len: 2,
		},
		u32le: {
			read: bw => bw.buffer.readUInt32LE(bw.pos),
			write: (bw, val) => bw.buffer.writeUInt32LE(val, bw.pos),
			len: 4,
		},
		u32be: {
			read: bw => bw.buffer.readUInt32BE(bw.pos),
			write: (bw, val) => bw.buffer.writeUInt32BE(val, bw.pos),
			len: 4,
		},
		s8: {
			read: bw => bw.buffer.readInt8(bw.pos),
			write: (bw, val) => bw.buffer.writeInt8(val, bw.pos),
			len: 1,
		},
		s16le: {
			read: bw => bw.buffer.readInt16LE(bw.pos),
			write: (bw, val) => bw.buffer.writeInt16LE(val, bw.pos),
			len: 2,
		},
		s16be: {
			read: bw => bw.buffer.readInt16BE(bw.pos),
			write: (bw, val) => bw.buffer.writeInt16BE(val, bw.pos),
			len: 2,
		},
		s32le: {
			read: bw => bw.buffer.readInt32LE(bw.pos),
			write: (bw, val) => bw.buffer.writeInt32LE(val, bw.pos),
			len: 4,
		},
		s32be: {
			read: bw => bw.buffer.readInt32BE(bw.pos),
			write: (bw, val) => bw.buffer.writeInt32BE(val, bw.pos),
			len: 4,
		},
	},
};
