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

describe('Reads strings correctly', function() {

	describe('string.fixed.noTerm', function() {
		it('Includes nulls in fixed length strings', function() {
			let rb = new RecordBuffer(Uint8Array.from([
				0x41, 0x42, 0x20, 0x01, 0xFB, 0x00, 0x47, 0x48,
			]).buffer);

			const recordType = {
				// Read seven chars to make sure we don't get the eighth in the buffer.
				one: RecordType.string.fixed.noTerm(7),
				two: RecordType.string.fixed.noTerm(1),
			};

			const actual = rb.readRecord(recordType);

			assert.equal(actual.one, 'AB \u263A\u221A\u0000G');
			assert.equal(actual.two, 'H');
		});
	});

	describe('string.fixed.reqTerm', function() {
		it('Terminates at nulls but still reads full field length', function() {
			let rb = new RecordBuffer(Uint8Array.from([
				0x41, 0x42, 0x00, 0x01, 0xFB, 0x00, 0x47, 0x48,
				0x49, 0x4A, 0x4B, 0x4C, 0x4D,
			]).buffer);

			const recordType = {
				one: RecordType.string.fixed.reqTerm(4),
				two: RecordType.string.fixed.reqTerm(4),
				three: RecordType.string.fixed.reqTerm(4),
			};

			const actual = rb.readRecord(recordType);

			assert.equal(actual.one, 'AB');
			assert.equal(actual.two, '\u221A');
			assert.equal(actual.three, 'IJKL');
		});
	});

	describe('string.fixed.optTerm', function() {
		it('Terminates at nulls but still reads full field length', function() {
			let rb = new RecordBuffer(Uint8Array.from([
				0x41, 0x42, 0x00, 0x01, 0xFB, 0x00, 0x47, 0x48,
				0x49, 0x4A, 0x4B, 0x4C, 0x4D,
			]).buffer);

			const recordType = {
				one: RecordType.string.fixed.optTerm(4),
				two: RecordType.string.fixed.optTerm(4),
				three: RecordType.string.fixed.optTerm(4),
			};

			const actual = rb.readRecord(recordType);

			assert.equal(actual.one, 'AB');
			assert.equal(actual.two, '\u221A');
			assert.equal(actual.three, 'IJKL');
		});
	});

	describe('string.variable.reqTerm', function() {
		it('Stops when encountering nulls in variable length strings', function() {
			let rb = new RecordBuffer(Uint8Array.from([
				0x41, 0x42, 0x20, 0x01, 0xFB, 0x00, 0x47, 0x48,
			]).buffer);

			const recordType = {
				// Read seven chars to make sure we don't get the eighth in the buffer.
				test: RecordType.string.variable.reqTerm(7),
			};

			const actual = rb.readRecord(recordType);

			assert.equal(actual.test, 'AB \u263A\u221A');
		});

		it('Reads the max variable length if there is no null', function() {
			let rb = new RecordBuffer(Uint8Array.from([
				0x41, 0x42, 0x20, 0x01, 0xFB, 0x46, 0x47, 0x48,
			]).buffer);

			const recordType = {
				// Read seven chars to make sure we don't get the eighth in the buffer.
				test: RecordType.string.variable.reqTerm(7),
			};

			const actual = rb.readRecord(recordType);

			assert.equal(actual.test, 'AB \u263A\u221AFG');
		});
	});

	// Same as variable.reqTerm
	describe('string.variable.optTerm', function() {
		it('Stops when encountering nulls in variable length strings', function() {
			let rb = new RecordBuffer(Uint8Array.from([
				0x41, 0x42, 0x20, 0x01, 0xFB, 0x00, 0x47, 0x48,
			]).buffer);

			const recordType = {
				// Read seven chars to make sure we don't get the eighth in the buffer.
				test: RecordType.string.variable.optTerm(7),
			};

			const actual = rb.readRecord(recordType);

			assert.equal(actual.test, 'AB \u263A\u221A');
		});

		it('Reads the max variable length if there is no null', function() {
			let rb = new RecordBuffer(Uint8Array.from([
				0x41, 0x42, 0x20, 0x01, 0xFB, 0x46, 0x47, 0x48,
			]).buffer);

			const recordType = {
				// Read seven chars to make sure we don't get the eighth in the buffer.
				test: RecordType.string.variable.optTerm(7),
			};

			const actual = rb.readRecord(recordType);

			assert.equal(actual.test, 'AB \u263A\u221AFG');
		});
	});
});
