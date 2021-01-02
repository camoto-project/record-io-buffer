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

import assert from 'assert';
import { RecordBuffer, RecordType } from '../index.js';

describe('Reads integer values correctly', function() {

	const input = Uint8Array.from([0xFE, 0xDC, 0xBA, 0x98, 0x76, 0x54, 0x32, 0x10]).buffer;

	it('uint8', function() {
		let rb = new RecordBuffer(input);

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

		const actual = rb.readRecord(recordType);

		assert.equal(actual.one, 0xFE);
		assert.equal(actual.two, 0xDC);
		assert.equal(actual.three, 0xBA);
		assert.equal(actual.four, 0x98);
		assert.equal(actual.five, 0x76);
		assert.equal(actual.six, 0x54);
		assert.equal(actual.seven, 0x32);
		assert.equal(actual.eight, 0x10);
	});

	it('uint16le', function() {
		let rb = new RecordBuffer(input);

		const recordType = {
			one: RecordType.int.u16le,
			two: RecordType.int.u16le,
			three: RecordType.int.u16le,
			four: RecordType.int.u16le,
		};

		const actual = rb.readRecord(recordType);

		assert.equal(actual.one, 0xDCFE);
		assert.equal(actual.two, 0x98BA);
		assert.equal(actual.three, 0x5476);
		assert.equal(actual.four, 0x1032);
	});

	it('uint16be', function() {
		let rb = new RecordBuffer(input);

		const recordType = {
			one: RecordType.int.u16be,
			two: RecordType.int.u16be,
			three: RecordType.int.u16be,
			four: RecordType.int.u16be,
		};

		const actual = rb.readRecord(recordType);

		assert.equal(actual.one, 0xFEDC);
		assert.equal(actual.two, 0xBA98);
		assert.equal(actual.three, 0x7654);
		assert.equal(actual.four, 0x3210);
	});

	it('uint24le', function() {
		let rb = new RecordBuffer(input);

		const recordType = {
			one: RecordType.int.u24le,
			two: RecordType.int.u24le,
		};

		const actual = rb.readRecord(recordType);

		assert.equal(actual.one, 0xBADCFE);
		assert.equal(actual.two, 0x547698);
	});

	it('uint24be', function() {
		let rb = new RecordBuffer(input);

		const recordType = {
			one: RecordType.int.u24be,
			two: RecordType.int.u24be,
		};

		const actual = rb.readRecord(recordType);

		assert.equal(actual.one, 0xFEDCBA);
		assert.equal(actual.two, 0x987654);
	});

	it('uint32le', function() {
		let rb = new RecordBuffer(input);

		const recordType = {
			one: RecordType.int.u32le,
			two: RecordType.int.u32le,
		};

		const actual = rb.readRecord(recordType);

		assert.equal(actual.one, 0x98BADCFE);
		assert.equal(actual.two, 0x10325476);
	});

	it('uint32be', function() {
		let rb = new RecordBuffer(input);

		const recordType = {
			one: RecordType.int.u32be,
			two: RecordType.int.u32be,
		};

		const actual = rb.readRecord(recordType);

		assert.equal(actual.one, 0xFEDCBA98);
		assert.equal(actual.two, 0x76543210);
	});

	it('int8', function() {
		let rb = new RecordBuffer(input);

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

		const actual = rb.readRecord(recordType);

		assert.equal(actual.one, -256 + 0xFE);
		assert.equal(actual.two, -256 + 0xDC);
		assert.equal(actual.three, -256 + 0xBA);
		assert.equal(actual.four, -256 + 0x98);
		assert.equal(actual.five, 0x76);
		assert.equal(actual.six, 0x54);
		assert.equal(actual.seven, 0x32);
		assert.equal(actual.eight, 0x10);
	});

	it('int16le', function() {
		let rb = new RecordBuffer(input);

		const recordType = {
			one: RecordType.int.s16le,
			two: RecordType.int.s16le,
			three: RecordType.int.s16le,
			four: RecordType.int.s16le,
		};

		const actual = rb.readRecord(recordType);

		assert.equal(actual.one, -65536 + 0xDCFE);
		assert.equal(actual.two, -65536 + 0x98BA);
		assert.equal(actual.three, 0x5476);
		assert.equal(actual.four, 0x1032);
	});

	it('int16be', function() {
		let rb = new RecordBuffer(input);

		const recordType = {
			one: RecordType.int.s16be,
			two: RecordType.int.s16be,
			three: RecordType.int.s16be,
			four: RecordType.int.s16be,
		};

		const actual = rb.readRecord(recordType);

		assert.equal(actual.one, -65536 + 0xFEDC);
		assert.equal(actual.two, -65536 + 0xBA98);
		assert.equal(actual.three, 0x7654);
		assert.equal(actual.four, 0x3210);
	});

	it('int24le', function() {
		let rb = new RecordBuffer(input);

		const recordType = {
			one: RecordType.int.s24le,
			pad: RecordType.int.u8,
			two: RecordType.int.s24le,
		};

		const actual = rb.readRecord(recordType);

		assert.equal(actual.one, 0 - Math.pow(2, 24) + 0xBADCFE);
		assert.equal(actual.two, 0x325476);
	});

	it('int24be', function() {
		let rb = new RecordBuffer(input);

		const recordType = {
			one: RecordType.int.s24be,
			pad: RecordType.int.u8,
			two: RecordType.int.s24be,
		};

		const actual = rb.readRecord(recordType);

		assert.equal(actual.one, 0 - Math.pow(2, 24) + 0xFEDCBA);
		assert.equal(actual.two, 0x765432);
	});

	it('int32le', function() {
		let rb = new RecordBuffer(input);

		const recordType = {
			one: RecordType.int.s32le,
			two: RecordType.int.s32le,
		};

		const actual = rb.readRecord(recordType);

		assert.equal(actual.one, 0 - Math.pow(2, 32) + 0x98BADCFE);
		assert.equal(actual.two, 0x10325476);
	});

	it('int32be', function() {
		let rb = new RecordBuffer(input);

		const recordType = {
			one: RecordType.int.s32be,
			two: RecordType.int.s32be,
		};

		const actual = rb.readRecord(recordType);

		assert.equal(actual.one, 0 - Math.pow(2, 32) + 0xFEDCBA98);
		assert.equal(actual.two, 0x76543210);
	});

	it('midi', function() {
		const minput = Uint8Array.from([
			0xFE, 0xDC, 0xBA, 0x18,
			0x86, 0xD4, 0x32,
			0x90, 0x01,
			0x05,
			0x00,
			0x90, 0x00,
			0x90, 0x80, 0x00,
			0x90, 0x80, 0x80, 0x00,
		]).buffer;
		let rb = new RecordBuffer(minput);

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

		const actual = rb.readRecord(recordType);

		assert.equal(actual.four,  0x0FD71D18);
		assert.equal(actual.three,   0x01AA32);
		assert.equal(actual.two,       0x0801);
		assert.equal(actual.one,         0x05);
		assert.equal(actual.zero,        0x00);
		assert.equal(actual.zero2,      0x800);
		assert.equal(actual.zero3,    0x40000);
		assert.equal(actual.zero4,  0x2000000);
	});
});
