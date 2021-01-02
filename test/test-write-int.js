/*
 * Test code.
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

const assert = require('assert');

const { RecordBuffer, RecordType } = require('../index.js');
const { createRecordBuffer } = require('./util.js');

describe('Writes integer values correctly', function() {

	const expected = Uint8Array.from([0xFE, 0xDC, 0xBA, 0x98, 0x76, 0x54, 0x32, 0x10]);

	it('uint8', function() {
		let rb = createRecordBuffer(8);

		const recordType = {
			one: RecordType.int.u8,
			two: RecordType.int.u8,
			three: RecordType.int.u8,
			four: RecordType.int.u8,
			five: RecordType.int.u8,
			six: RecordType.int.u8,
			seven: RecordType.int.u8,
			eight: RecordType.int.u8,
		};

		const data = {
			one: 0xFE,
			two: 0xDC,
			three: 0xBA,
			four: 0x98,
			five: 0x76,
			six: 0x54,
			seven: 0x32,
			eight: 0x10,
		};
		rb.writeRecord(recordType, data);

		assert.deepEqual(rb.getU8(), expected);
	});

	it('uint16le', function() {
		let rb = createRecordBuffer(8);

		const recordType = {
			one: RecordType.int.u16le,
			two: RecordType.int.u16le,
			three: RecordType.int.u16le,
			four: RecordType.int.u16le,
		};

		const data = {
			one: 0xDCFE,
			two: 0x98BA,
			three: 0x5476,
			four: 0x1032,
		};
		rb.writeRecord(recordType, data);

		assert.deepEqual(rb.getU8(), expected);
	});

	it('uint16be', function() {
		let rb = createRecordBuffer(8);

		const recordType = {
			one: RecordType.int.u16be,
			two: RecordType.int.u16be,
			three: RecordType.int.u16be,
			four: RecordType.int.u16be,
		};

		const data = {
			one: 0xFEDC,
			two: 0xBA98,
			three: 0x7654,
			four: 0x3210,
		};
		rb.writeRecord(recordType, data);

		assert.deepEqual(rb.getU8(), expected);
	});

	it('uint24le', function() {
		let rb = createRecordBuffer(8);

		const recordType = {
			one: RecordType.int.u24le,
			pad1: RecordType.int.u8,
			two: RecordType.int.u24le,
			pad2: RecordType.int.u8,
		};

		const data = {
			one: 0xBADCFE,
			pad1: 0x98,
			two: 0x325476,
			pad2: 0x10,
		};
		rb.writeRecord(recordType, data);

		assert.deepEqual(rb.getU8(), expected);
	});

	it('uint24be', function() {
		let rb = createRecordBuffer(8);

		const recordType = {
			one: RecordType.int.u24be,
			pad1: RecordType.int.u8,
			two: RecordType.int.u24be,
			pad2: RecordType.int.u8,
		};

		const data = {
			one: 0xFEDCBA,
			pad1: 0x98,
			two: 0x765432,
			pad2: 0x10,
		};
		rb.writeRecord(recordType, data);

		assert.deepEqual(rb.getU8(), expected);
	});

	it('uint32le', function() {
		let rb = createRecordBuffer(8);

		const recordType = {
			one: RecordType.int.u32le,
			two: RecordType.int.u32le,
		};

		const data = {
			one: 0x98BADCFE,
			two: 0x10325476,
		};
		rb.writeRecord(recordType, data);

		assert.deepEqual(rb.getU8(), expected);
	});

	it('uint32be', function() {
		let rb = createRecordBuffer(8);

		const recordType = {
			one: RecordType.int.u32be,
			two: RecordType.int.u32be,
		};

		const data = {
			one: 0xFEDCBA98,
			two: 0x76543210,
		};
		rb.writeRecord(recordType, data);

		assert.deepEqual(rb.getU8(), expected);
	});

	it('int8', function() {
		let rb = createRecordBuffer(8);

		const recordType = {
			one: RecordType.int.s8,
			two: RecordType.int.s8,
			three: RecordType.int.s8,
			four: RecordType.int.s8,
			five: RecordType.int.s8,
			six: RecordType.int.s8,
			seven: RecordType.int.s8,
			eight: RecordType.int.s8,
		};

		const data = {
			one: -256 + 0xFE,
			two: -256 + 0xDC,
			three: -256 + 0xBA,
			four: -256 + 0x98,
			five: 0x76,
			six: 0x54,
			seven: 0x32,
			eight: 0x10,
		};
		rb.writeRecord(recordType, data);

		assert.deepEqual(rb.getU8(), expected);
	});

	it('int16le', function() {
		let rb = createRecordBuffer(8);

		const recordType = {
			one: RecordType.int.s16le,
			two: RecordType.int.s16le,
			three: RecordType.int.s16le,
			four: RecordType.int.s16le,
		};

		const data = {
			one: -65536 + 0xDCFE,
			two: -65536 + 0x98BA,
			three: 0x5476,
			four: 0x1032,
		};
		rb.writeRecord(recordType, data);

		assert.deepEqual(rb.getU8(), expected);
	});

	it('int16be', function() {
		let rb = createRecordBuffer(8);

		const recordType = {
			one: RecordType.int.s16be,
			two: RecordType.int.s16be,
			three: RecordType.int.s16be,
			four: RecordType.int.s16be,
		};

		const data = {
			one: -65536 + 0xFEDC,
			two: -65536 + 0xBA98,
			three: 0x7654,
			four: 0x3210,
		};
		rb.writeRecord(recordType, data);

		assert.deepEqual(rb.getU8(), expected);
	});

	it('int24le', function() {
		let rb = createRecordBuffer(8);

		const recordType = {
			one: RecordType.int.s24le,
			pad1: RecordType.int.u8,
			two: RecordType.int.s24le,
			pad2: RecordType.int.u8,
		};

		const data = {
			one: 0 - Math.pow(2, 32) + 0xBADCFE,
			pad1: 0x98,
			two: 0x325476,
			pad2: 0x10,
		};
		rb.writeRecord(recordType, data);

		assert.deepEqual(rb.getU8(), expected);
	});

	it('int24be', function() {
		let rb = createRecordBuffer(8);

		const recordType = {
			one: RecordType.int.s24be,
			pad1: RecordType.int.u8,
			two: RecordType.int.s24be,
			pad2: RecordType.int.u8,
		};

		const data = {
			one: 0 - Math.pow(2, 32) + 0xFEDCBA,
			pad1: 0x98,
			two: 0x765432,
			pad2: 0x10,
		};
		rb.writeRecord(recordType, data);

		assert.deepEqual(rb.getU8(), expected);
	});

	it('int32le', function() {
		let rb = createRecordBuffer(8);

		const recordType = {
			one: RecordType.int.s32le,
			two: RecordType.int.s32le,
		};

		const data = {
			one: 0 - Math.pow(2, 32) + 0x98BADCFE,
			two: 0x10325476,
		};
		rb.writeRecord(recordType, data);

		assert.deepEqual(rb.getU8(), expected);
	});

	it('int32be', function() {
		let rb = createRecordBuffer(8);

		const recordType = {
			one: RecordType.int.s32be,
			two: RecordType.int.s32be,
		};

		const data = {
			one: 0 - Math.pow(2, 32) + 0xFEDCBA98,
			two: 0x76543210,
		};
		rb.writeRecord(recordType, data);

		assert.deepEqual(rb.getU8(), expected);
	});

	it('midi', function() {
		const mexpected = Uint8Array.from([
			0xFE, 0xDC, 0xBA, 0x18,
			0x86, 0xD4, 0x32,
			0x90, 0x01,
			0x05,
			0x00,
			0x90, 0x00,
			0x90, 0x80, 0x00,
			0x90, 0x80, 0x80, 0x00,
		]);
		let rb = createRecordBuffer(10);

		const recordType = {
			four: RecordType.int.midi,
			three: RecordType.int.midi,
			two: RecordType.int.midi,
			one: RecordType.int.midi,
			zero: RecordType.int.midi,
			zero2: RecordType.int.midi,
			zero3: RecordType.int.midi,
			zero4: RecordType.int.midi,
		};

		const data = {
			four: 0x0FD71D18,
			three: 0x01AA32,
			two: 0x0801,
			one: 0x05,
			zero: 0x00,
			zero2: 0x800,
			zero3: 0x40000,
			zero4: 0x2000000,
		};
		rb.writeRecord(recordType, data);

		assert.deepEqual(rb.getU8(), mexpected);
	});
});
