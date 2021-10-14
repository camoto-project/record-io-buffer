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

describe('Reads blocks of data correctly', function() {

	describe('constructor()', function() {

		it('Accepts Uint8Array', function() {
			let ua = Uint8Array.from([
				0x12, 0x34, 0xFF, 0x00, 0x80, 0x7F, 0x01,
			]);
			let u2 = new Uint8Array(ua.buffer, 2, 4);

			let rb = new RecordBuffer(u2);

			assert.equal(rb.length, 4);

			let content = rb.getU8(1, 2);
			assert.equal(content[0], 0x00);
			assert.equal(content[1], 0x80);
			assert.equal(content.length, 2);
		});

		it('Accepts ArrayBuffer', function() {
			let ab = new ArrayBuffer(5);
			let rb = new RecordBuffer(ab);

			assert.equal(rb.length, 5);
		});

		it('Accepts a Number', function() {
			let rb = new RecordBuffer(6);

			// Buffer looks empty
			assert.equal(rb.length, 0);

			// But has space preallocated
			assert.equal(rb.buffer.byteLength, 6);
		});

	});

	describe('getU8()', function() {

		it('Retrieves the correct window onto the data', function() {
			let rb = new RecordBuffer(Uint8Array.from([
				0x12, 0x34, 0xFF, 0x00, 0x80, 0x7F, 0x01,
			]).buffer);

			let content = rb.getU8(2, 4);

			assert.equal(content[0], 0xFF);
			assert.equal(content[1], 0x00);
			assert.equal(content[2], 0x80);
			assert.equal(content[3], 0x7F);
			assert.equal(content[4], undefined);
		});

		it('Retrieves the correct window without a supplied length', function() {
			let rb = new RecordBuffer(Uint8Array.from([
				0x12, 0x34, 0xFF, 0x00, 0x80, 0x7F, 0x01,
			]).buffer);

			let content = rb.getU8(4);

			assert.equal(content.length, 3);
			assert.equal(content[0], 0x80);
			assert.equal(content[1], 0x7F);
			assert.equal(content[2], 0x01);
			assert.equal(content[4], undefined);
		});

		it('Retrieves the correct window with a zero length', function() {
			let rb = new RecordBuffer(Uint8Array.from([
				0x12, 0x34, 0xFF, 0x00, 0x80, 0x7F, 0x01,
			]).buffer);

			let content = rb.getU8(4, 0);

			assert.equal(content.length, 0);
		});

	});

	describe('get()', function() {

		it('Retrieves the correct window onto the data', function() {
			let rb = new RecordBuffer(Uint8Array.from([
				0x12, 0x34, 0xFF, 0x00, 0x80, 0x7F, 0x01,
			]).buffer);

			{
				let content = rb.get(2);

				assert.equal(content[0], 0x12);
				assert.equal(content[1], 0x34);
				assert.equal(content[2], undefined);
			}
			{
				let content = rb.get(3);

				assert.equal(content[0], 0xFF);
				assert.equal(content[1], 0x00);
				assert.equal(content[2], 0x80);
				assert.equal(content[3], undefined);
			}
		});

	});

	describe('as RecordType', function() {

		it('read', function() {
			let ua = Uint8Array.from([
				0x12, 0x34, 0xFF, 0x00, 0x80, 0x7F, 0x01,
			]);
			let rb = new RecordBuffer(ua);

			const recordType = {
				one: RecordType.int.u8,
				two: RecordType.block(3),
				three: RecordType.int.u8,
			};

			const actual = rb.readRecord(recordType);

			assert.equal(actual.one, 0x12);
			assert.equal(actual.two[0], 0x34);
			assert.equal(actual.two[1], 0xFF);
			assert.equal(actual.two[2], 0x00);
			assert.equal(actual.three, 0x80);
		});

	});
});
