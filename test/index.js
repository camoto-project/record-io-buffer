/**
 * @file Test code.
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

const assert = require('assert');

const { RecordBuffer, RecordType } = require('../index.js');

// Override the default colours so we can actually see them
var colors = require('mocha/lib/reporters/base').colors;
colors['diff added'] = '1;33';
colors['diff removed'] = '1;31';
colors['green'] = '1;32';
colors['fail'] = '1;31';
colors['error message'] = '1;31';
colors['error stack'] = '1;37';

const input = Buffer.from([0xFE, 0xDC, 0xBA, 0x98, 0x76, 0x54, 0x32, 0x10]);

describe('Read records', function() {

	describe('Handles unsigned values correctly', function() {

		it('Handles uint8', function() {
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

		it('Handles uint16le', function() {
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

		it('Handles uint16be', function() {
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

		it('Handles uint32le', function() {
			let rb = new RecordBuffer(input);

			const recordType = {
				one: RecordType.int.u32le,
				two: RecordType.int.u32le,
			};

			const actual = rb.readRecord(recordType);

			assert.equal(actual.one, 0x98BADCFE);
			assert.equal(actual.two, 0x10325476);
		});

		it('Handles uint32be', function() {
			let rb = new RecordBuffer(input);

			const recordType = {
				one: RecordType.int.u32be,
				two: RecordType.int.u32be,
			};

			const actual = rb.readRecord(recordType);

			assert.equal(actual.one, 0xFEDCBA98);
			assert.equal(actual.two, 0x76543210);
		});
	});

	describe('Handles signed values correctly', function() {

		it('Handles int8', function() {
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

		it('Handles int16le', function() {
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

		it('Handles int16be', function() {
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

		it('Handles int32le', function() {
			let rb = new RecordBuffer(input);

			const recordType = {
				one: RecordType.int.s32le,
				two: RecordType.int.s32le,
			};

			const actual = rb.readRecord(recordType);

			assert.equal(actual.one, 0 - Math.pow(2, 32) + 0x98BADCFE);
			assert.equal(actual.two, 0x10325476);
		});

		it('Handles int32be', function() {
			let rb = new RecordBuffer(input);

			const recordType = {
				one: RecordType.int.s32be,
				two: RecordType.int.s32be,
			};

			const actual = rb.readRecord(recordType);

			assert.equal(actual.one, 0 - Math.pow(2, 32) + 0xFEDCBA98);
			assert.equal(actual.two, 0x76543210);
		});
	});
});
