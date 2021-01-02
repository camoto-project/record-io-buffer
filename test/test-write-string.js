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

describe('Writes strings correctly', function() {

	// Functionality is the same for writing these types, so run the same tests
	// for both types.
	const types = {
		noTerm: RecordType.string.fixed.noTerm,
		optTerm: RecordType.string.fixed.optTerm,
	};
	Object.keys(types).forEach(key => {
		describe('string.fixed.' + key, function() {
			const TRecordType = types[key];

			it('Includes nulls in fixed length strings', function() {
				let rb = createRecordBuffer(8);

				const recordType = {
					one: TRecordType(7),
					two: TRecordType(1),
				};

				const data = {
					one: 'AB \u263A\u221A\u0000G', // must write 'G' after a null, no null term
					two: 'H',
				};
				rb.writeRecord(recordType, data);

				assert.deepEqual(rb.getU8(), Uint8Array.from([
					0x41, 0x42, 0x20, 0x01, 0xFB, 0x00, 0x47, 0x48,
				]));
			});

			it('Pads with nulls in fixed length strings', function() {
				let rb = createRecordBuffer(8);

				const recordType = {
					one: TRecordType(7),
					two: TRecordType(1),
				};

				const data = {
					one: 'AB \u263A', // must write 'G' after a null
					two: 'H',
				};
				rb.writeRecord(recordType, data);

				assert.deepEqual(rb.getU8(), Uint8Array.from([
					0x41, 0x42, 0x20, 0x01, 0x00, 0x00, 0x00, 0x48,
				]));
			});

		});
	});

	describe('string.fixed.reqTerm', function() {

		it('Stops writing at a null in fixed length strings', function() {
			let rb = createRecordBuffer(8);

			const recordType = {
				one: RecordType.string.fixed.reqTerm(4),
				two: RecordType.string.fixed.reqTerm(4),
			};

			const data = {
				one: 'A\u263A\u0000D', // should not write 'D' after a null
				two: 'E\u0000\u221A',
			};
			rb.writeRecord(recordType, data);

			assert.deepEqual(rb.getU8(), Uint8Array.from([
				0x41, 0x01, 0x00, 0x00, 0x45, 0x00, 0x00, 0x00,
			]));
		});

		it('Single length field only has room for a null', function() {
			let rb = createRecordBuffer(8);

			const recordType = {
				one: RecordType.string.fixed.reqTerm(4),
				two: RecordType.string.fixed.reqTerm(1),
				three: RecordType.string.fixed.reqTerm(3),
			};

			const data = {
				one: 'A\u263ACD',
				two: '\u263A', // should be cut off as len=1 so only room for null
				three: 'FG',
			};
			rb.writeRecord(recordType, data);

			assert.deepEqual(rb.getU8(), Uint8Array.from([
				0x41, 0x01, 0x43, 0x00, 0x00, 0x46, 0x47, 0x00,
			]));
		});

		it('Truncates string to leave room for terminating null', function() {
			let rb = createRecordBuffer(8);

			const recordType = {
				one: RecordType.string.fixed.reqTerm(6),
				two: RecordType.string.fixed.reqTerm(2),
			};

			const data = {
				one: 'AB \u263A\u221AF', // exact field length
				two: 'GHI',              // beyond field length
			};
			rb.writeRecord(recordType, data);

			assert.deepEqual(rb.getU8(), Uint8Array.from([
				0x41, 0x42, 0x20, 0x01, 0xFB, 0x00, 0x47, 0x00,
			]));
		});

	});

	describe('string.variable.reqTerm', function() {

		it('Stops writing at a null in variable length strings', function() {
			let rb = createRecordBuffer(8);

			const recordType = {
				one: RecordType.string.variable.reqTerm(4),
				two: RecordType.string.variable.reqTerm(4),
			};

			const data = {
				one: 'A\u263A\u0000D', // should not write 'D' after a null
				two: 'E\u0000\u221A',
			};
			rb.writeRecord(recordType, data);

			assert.deepEqual(rb.getU8(), Uint8Array.from([
				0x41, 0x01, 0x00, 0x45, 0x00,
			]));
		});

		it('Single length field only has room for a null', function() {
			let rb = createRecordBuffer(8);

			const recordType = {
				one: RecordType.string.variable.reqTerm(4),
				two: RecordType.string.variable.reqTerm(1),
				three: RecordType.string.variable.reqTerm(3),
			};

			const data = {
				one: 'A\u263ACD',
				two: '\u263A', // should be cut off as len=1 so only room for null
				three: 'FG',
			};
			rb.writeRecord(recordType, data);

			assert.deepEqual(rb.getU8(), Uint8Array.from([
				0x41, 0x01, 0x43, 0x00, 0x00, 0x46, 0x47, 0x00,
			]));
		});

		it('Truncates string to leave room for terminating null', function() {
			let rb = createRecordBuffer(8);

			const recordType = {
				one: RecordType.string.variable.reqTerm(6),
				two: RecordType.string.variable.reqTerm(2),
			};

			const data = {
				one: 'AB \u263A\u221AF', // exact field length
				two: 'GHI',              // beyond field length
			};
			rb.writeRecord(recordType, data);

			assert.deepEqual(rb.getU8(), Uint8Array.from([
				0x41, 0x42, 0x20, 0x01, 0xFB, 0x00, 0x47, 0x00,
			]));
		});

	});

	describe('string.variable.optTerm', function() {

		it('Stops writing at a null in variable length strings', function() {
			let rb = createRecordBuffer(8);

			const recordType = {
				one: RecordType.string.variable.optTerm(4),
				two: RecordType.string.variable.optTerm(4),
			};

			const data = {
				one: 'A\u263A\u0000D', // should not write 'D' after a null
				two: 'E\u0000\u221A',
			};
			rb.writeRecord(recordType, data);

			assert.deepEqual(rb.getU8(), Uint8Array.from([
				0x41, 0x01, 0x00, 0x45, 0x00,
			]));
		});

		it('Single length field does not have room for the optional null', function() {
			let rb = createRecordBuffer(8);

			const recordType = {
				one: RecordType.string.variable.optTerm(4),
				two: RecordType.string.variable.optTerm(1),
				three: RecordType.string.variable.optTerm(3),
			};

			const data = {
				one: 'A\u263ACD',
				two: '\u263A', // should be cut off as len=1 so only room for null
				three: 'FG',
			};
			rb.writeRecord(recordType, data);

			assert.deepEqual(rb.getU8(), Uint8Array.from([
				0x41, 0x01, 0x43, 0x44, 0x01, 0x46, 0x47, 0x00,
			]));
		});

		it('Truncates string but ignores terminating null', function() {
			let rb = createRecordBuffer(8);

			const recordType = {
				one: RecordType.string.variable.optTerm(6),
				two: RecordType.string.variable.optTerm(2),
			};

			const data = {
				one: 'AB \u263A\u221AF', // exact field length
				two: 'GHI',              // beyond field length
			};
			rb.writeRecord(recordType, data);

			assert.deepEqual(rb.getU8(), Uint8Array.from([
				0x41, 0x42, 0x20, 0x01, 0xFB, 0x46, 0x47, 0x48,
			]));
		});

	});
});
