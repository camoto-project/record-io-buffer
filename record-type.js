/*
 * Various data types supported by the library.
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

// Mapping between IBM437 charset and UTF-16.
const mapIBM437 = [
	// 0x00
	0x0000, 0x263A, 0x263B, 0x2665, 0x2666, 0x2663, 0x2660, 0x2022,
	0x25D8, 0x25CB, 0x25D9, 0x2642, 0x2640, 0x266A, 0x266B, 0x263C,
	0x25BA, 0x25C4, 0x2195, 0x203C, 0x00B6, 0x00A7, 0x25AC, 0x21A8,
	0x2191, 0x2193, 0x2192, 0x2190, 0x221F, 0x2194, 0x25B2, 0x25BC,
	// 0x20
	0x0020, 0x0021, 0x0022, 0x0023, 0x0024, 0x0025, 0x0026, 0x0027,
	0x0028, 0x0029, 0x002A, 0x002B, 0x002C, 0x002D, 0x002E, 0x002F,
	0x0030, 0x0031, 0x0032, 0x0033, 0x0034, 0x0035, 0x0036, 0x0037,
	0x0038, 0x0039, 0x003A, 0x003B, 0x003C, 0x003D, 0x003E, 0x003F,
	0x0040, 0x0041, 0x0042, 0x0043, 0x0044, 0x0045, 0x0046, 0x0047,
	0x0048, 0x0049, 0x004A, 0x004B, 0x004C, 0x004D, 0x004E, 0x004F,
	0x0050, 0x0051, 0x0052, 0x0053, 0x0054, 0x0055, 0x0056, 0x0057,
	0x0058, 0x0059, 0x005A, 0x005B, 0x005C, 0x005D, 0x005E, 0x005F,
	0x0060, 0x0061, 0x0062, 0x0063, 0x0064, 0x0065, 0x0066, 0x0067,
	0x0068, 0x0069, 0x006A, 0x006B, 0x006C, 0x006D, 0x006E, 0x006F,
	0x0070, 0x0071, 0x0072, 0x0073, 0x0074, 0x0075, 0x0076, 0x0077,
	0x0078, 0x0079, 0x007A, 0x007B, 0x007C, 0x007D, 0x007E, 0x2302,
	// 0x80
	0x00C7, 0x00FC, 0x00E9, 0x00E2, 0x00E4, 0x00E0, 0x00E5, 0x00E7,
	0x00EA, 0x00EB, 0x00E8, 0x00EF, 0x00EE, 0x00EC, 0x00C4, 0x00C5,
	0x00C9, 0x00E6, 0x00C6, 0x00F4, 0x00F6, 0x00F2, 0x00FB, 0x00F9,
	0x00FF, 0x00D6, 0x00DC, 0x00A2, 0x00A3, 0x00A5, 0x20A7, 0x0192,
	// 0xA0
	0x00E1, 0x00ED, 0x00F3, 0x00FA, 0x00F1, 0x00D1, 0x00AA, 0x00BA,
	0x00BF, 0x2310, 0x00AC, 0x00BD, 0x00BC, 0x00A1, 0x00AB, 0x00BB,
	0x2591, 0x2592, 0x2593, 0x2502, 0x2524, 0x2561, 0x2562, 0x2556,
	0x2555, 0x2563, 0x2551, 0x2557, 0x255D, 0x255C, 0x255B, 0x2510,
	// 0xC0
	0x2514, 0x2534, 0x252C, 0x251C, 0x2500, 0x253C, 0x255E, 0x255F,
	0x255A, 0x2554, 0x2569, 0x2566, 0x2560, 0x2550, 0x256C, 0x2567,
	0x2568, 0x2564, 0x2565, 0x2559, 0x2558, 0x2552, 0x2553, 0x256B,
	0x256A, 0x2518, 0x250C, 0x2588, 0x2584, 0x258C, 0x2590, 0x2580,
	// 0xE0
	0x03B1, 0x00DF, 0x0393, 0x03C0, 0x03A3, 0x03C3, 0x00B5, 0x03C4,
	0x03A6, 0x0398, 0x03A9, 0x03B4, 0x221E, 0x03C6, 0x03B5, 0x2229,
	0x2261, 0x00B1, 0x2265, 0x2264, 0x2320, 0x2321, 0x00F7, 0x2248,
	0x00B0, 0x2219, 0x00B7, 0x221A, 0x207F, 0x00B2, 0x25A0, 0x00A0,
];

// nullTerm = true to stop early, false to include nulls in final string
function dataViewToString(dv, offset, len, nullTerm = false) {
	let s = '';
	for (let i = 0; i < len; i++) {
		const c = dv.getUint8(offset + i);
		if ((c === 0) && nullTerm) break;
		s += String.fromCharCode(mapIBM437[c]);
	}
	return s;
}

function writeString(s, dv, offset, len, nullTerm, pad = true) {
	let i = 0;
	for (let c = 0; ((c = s.charCodeAt(i)) >= 0) && (i < len); i++) {
		if (nullTerm === true) {
			if (i == len - 1) {
				// Only one space left and we need to write a null, finish reading the
				// string.
				break;
			}
		}
		const code = mapIBM437.indexOf(c);
		if ((code === 0) && (nullTerm !== false)) { // matches nullTerm=undefined
			// Also use null chars in the input string as terminators
			break;
		}
		dv.setUint8(offset + i, code);
	}

	const lenPad = pad ? len - i : 1; // only one final null if not padding

	// Don't pad if there's nothing to pad, or the pad byte would go past the max
	// field length.
	if (!lenPad || (i + lenPad > len)) return i;

	for (let p = 0; p < lenPad; p++) {
		dv.setUint8(offset + i + p, 0);
	}

	return i + lenPad;
}

export default {
	string: {
		/**
		 * Mostly for debugging, convert an array of bytes to a string.
		 *
		 * @param {Array} | {Uint8Array} a
		 *   Array of bytes.
		 *
		 * @return Unicode {String} where each byte has been treated as an IBM437
		 *   character code.
		 */
		fromArray: a => {
			let s = '';
			for (let i = 0; i < a.length; i++) {
				s += String.fromCharCode(mapIBM437[a[i]]);
			}
			return s;
		},
		toU8: s => {
			let u8 = new Uint8Array(s.length);
			for (let i = 0; i < s.length; i++) {
				u8[i] = mapIBM437.indexOf(s.charCodeAt(i));
			}
			return u8;
		},
		fixed: {
			/**
			 * Fixed-length string with no null termination.
			 *
			 * When reading, the exact length will be read (in bytes) and any null
			 * bytes will be included in the returned string.
			 *
			 * When writing, the exact length will be written (in bytes) and if the
			 * string is shorter than this, it will be padded with 0x00 null bytes.
			 * if the string is longer or exactly the given length, no null bytes
			 * will be written.
			 */
			noTerm: len => ({
				read: rb => dataViewToString(rb.dataview, rb.pos, len, false),
				write: (rb, val) => writeString(val, rb.dataview, rb.pos, len, false),
				len: len,
			}),

			/**
			 * Fixed-length string with mandatory null termination.
			 *
			 * When reading, the exact length will be read but the string will stop
			 * at the first 0x00 null byte encountered, which will not be included in
			 * the returned value.  However the given number of bytes will always be
			 * read.
			 *
			 * When writing, the exact length will be written in bytes, with any short
			 * strings being padded by 0x00 null bytes.  If the string is the exact
			 * length of the field or longer, it will be truncated so that the last
			 * byte written will always be a null byte.  Thus a field of this type
			 * with a length of X, can only ever store a maximum of X - 1 characters
			 * plus the mandatory 0x00 terminating null character.
			 */
			reqTerm: len => ({
				read: rb => dataViewToString(rb.dataview, rb.pos, len, true),
				write: (rb, val) => writeString(val, rb.dataview, rb.pos, len, true),
				len: len, // always read same (fixed) length
			}),

			/**
			 * Fixed-length string with optional termination.
			 *
			 * When reading, the exact length will be read (in bytes) but the string
			 * will stop at the first null byte encountered.  If there is no null byte
			 * then the full given number of bytes will be read.
			 *
			 * When writing, functions the same as string.fixed.noTerm.
			 */
			optTerm: len => ({
				// Same as string.fixed.reqTerm
				read: rb => dataViewToString(rb.dataview, rb.pos, len, true),
				// Same as string.fixed.noTerm
				write: (rb, val) => writeString(val, rb.dataview, rb.pos, len, false),
				len: len,
			}),
		},
		variable: {
			/**
			 * Variable-length string with mandatory null termination.
			 *
			 * When reading, bytes will be read and included in the string until the
			 * first null byte is encountered, which will not be included in the
			 * returned string.  The null byte will be included in the number of
			 * characters read from the buffer.  If the maximum length is reached, the
			 * full string will be returned but bytes will not be read beyond this
			 * point.
			 *
			 * When writing, one byte will be written for each character in the string
			 * plus an extra one for the final null character.  If the string is
			 * equal to or longer than the maximum length then it will be truncated to
			 * ensure that the terminating null can fit within the allowed length.
			 */
			reqTerm: lenMax => ({
				read: rb => {
					const s = dataViewToString(rb.dataview, rb.pos, lenMax, true);
					rb.pos += s.length + 1;
					return s;
				},
				write: (rb, val) => {
					rb.pos += writeString(val, rb.dataview, rb.pos, lenMax, true, false);
				},
				len: 0,
			}),

			/**
			 * Variable-length string with optional termination.
			 *
			 * When reading, functions the same as variable.reqTerm.
			 *
			 * When writing, one byte will be written for each character in the string
			 * and a final terminating null will only be written if space allows.  If
			 * the string is the maximum length given (or longer), then it will be
			 * truncated but no final null byte will be written.
			 */
			optTerm: lenMax => ({
				// Same as string.fixed.reqTerm
				read: rb => {
					const s = dataViewToString(rb.dataview, rb.pos, lenMax, true);
					rb.pos += s.length + 1;
					return s;
				},
				write: (rb, val) => {
					rb.pos += writeString(val + '\u0000', rb.dataview, rb.pos, lenMax, undefined, false);
				},
				len: 0,
			}),
		},
	},

	/**
	 * Unused bytes for padding and alignment.
	 *
	 * When reading, returns a Uint8Array with the data.
	 *
	 * When writing, fills with a single byte, by default 0x00.
	 */
	padding: (len, val = 0x00) => ({
		read: rb => rb.getU8(rb.pos, len),
		write: rb => {
			let pad = new Uint8Array(len);
			pad.fill(val);
			rb.put(pad);
			rb.pos -= len;
		},
		len: len,
	}),

	int: {
		u8: {
			read: rb => rb.dataview.getUint8(rb.pos),
			write: (rb, val) => rb.dataview.setUint8(rb.pos, val),
			len: 1,
		},
		u16le: {
			read: rb => rb.dataview.getUint16(rb.pos, true),
			write: (rb, val) => rb.dataview.setUint16(rb.pos, val, true),
			len: 2,
		},
		u16be: {
			read: rb => rb.dataview.getUint16(rb.pos, false),
			write: (rb, val) => rb.dataview.setUint16(rb.pos, val, false),
			len: 2,
		},
		u24le: {
			read: rb => (
				rb.dataview.getUint8(rb.pos, true) |
				(rb.dataview.getUint16(rb.pos + 1, true) << 8)
			),
			write: (rb, val) => {
				rb.dataview.setUint8(rb.pos, val & 0xFF, true);
				rb.dataview.setUint16(rb.pos + 1, val >> 8, true);
			},
			len: 3,
		},
		u24be: {
			read: rb => (
				(rb.dataview.getUint16(rb.pos, false) << 8) |
				rb.dataview.getUint8(rb.pos + 2, false)
			),
			write: (rb, val) => {
				rb.dataview.setUint16(rb.pos, val >> 8, false);
				rb.dataview.setUint8(rb.pos + 2, val & 0xFF, false);
			},
			len: 3,
		},
		u32le: {
			read: rb => rb.dataview.getUint32(rb.pos, true),
			write: (rb, val) => rb.dataview.setUint32(rb.pos, val, true),
			len: 4,
		},
		u32be: {
			read: rb => rb.dataview.getUint32(rb.pos, false),
			write: (rb, val) => rb.dataview.setUint32(rb.pos, val, false),
			len: 4,
		},
		s8: {
			read: rb => rb.dataview.getInt8(rb.pos),
			write: (rb, val) => rb.dataview.setInt8(rb.pos, val),
			len: 1,
		},
		s16le: {
			read: rb => rb.dataview.getInt16(rb.pos, true),
			write: (rb, val) => rb.dataview.setInt16(rb.pos, val, true),
			len: 2,
		},
		s16be: {
			read: rb => rb.dataview.getInt16(rb.pos, false),
			write: (rb, val) => rb.dataview.setInt16(rb.pos, val, false),
			len: 2,
		},
		s24le: {
			read: rb => (
				rb.dataview.getUint8(rb.pos, true) |
				(rb.dataview.getInt16(rb.pos + 1, true) << 8)
			),
			write: (rb, val) => {
				rb.dataview.setUint8(rb.pos, val & 0xFF, true);
				rb.dataview.setInt16(rb.pos + 1, val >> 8, true);
			},
			len: 3,
		},
		s24be: {
			read: rb => (
				(rb.dataview.getInt16(rb.pos, false) << 8) |
				rb.dataview.getUint8(rb.pos + 2, false)
			),
			write: (rb, val) => {
				rb.dataview.setInt16(rb.pos, val >> 8, false);
				rb.dataview.setUint8(rb.pos + 2, val & 0xFF, false);
			},
			len: 3,
		},
		s32le: {
			read: rb => rb.dataview.getInt32(rb.pos, true),
			write: (rb, val) => rb.dataview.setInt32(rb.pos, val, true),
			len: 4,
		},
		s32be: {
			read: rb => rb.dataview.getInt32(rb.pos, false),
			write: (rb, val) => rb.dataview.setInt32(rb.pos, val, false),
			len: 4,
		},
		midi: {
			read: rb => {
				let v = 0;
				for (let i = 0; i < 4; i++) {
					let n = rb.dataview.getUint8(rb.pos++);
					v <<= 7;
					v += (n & 0x7F);
					if (!(n & 0x80)) break;
				}
				return v;
			},
			write: (rb, val) => {
				if (val > 0x1FFFFFFF) {
					throw new Error(`Value ${val} is too large to write to a MIDI file.`);
				}
				let out = [];
				let first = true;
				for (let i = 0; i < 4; i++) {
					let n = (val >> 21) & 0xFF;
					val = (val << 7) & 0x0FFFFFFF;

					// Skip leading zeroes.
					if (first && (n === 0) && (i !== 3)) continue;
					first = false;

					// Set the high bit if there's more data to come.
					if (i < 3) n |= 0x80;
					rb.dataview.setUint8(rb.pos++, n);
				}
			},
			len: 0,
		},
	},
};
