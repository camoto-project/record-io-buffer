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

describe('Reads blocks of data correctly', function() {

	describe('getView()', function() {

		it('Retrieves the correct window onto the data', function() {
			let rb = new RecordBuffer(Uint8Array.from([
				0x12, 0x34, 0xFF, 0x00, 0x80, 0x7F, 0x01,
			]).buffer);

			let content = rb.getView(2, 4);

			assert.equal(content.getUint8(0), 0xFF);
			assert.equal(content.getUint8(1), 0x00);
			assert.equal(content.getUint8(2), 0x80);
			assert.equal(content.getUint8(3), 0x7F);
			assert.throws(() => content.getUint8(4), RangeError);
		});

	});

	describe('getTypedArray()', function() {

		it('Retrieves the correct window onto the data', function() {
			let rb = new RecordBuffer(Uint8Array.from([
				0x12, 0x34, 0xFF, 0x00, 0x80, 0x7F, 0x01,
			]).buffer);

			let content = rb.getTypedArray(Uint8Array, 2, 4);

			assert.equal(content[0], 0xFF);
			assert.equal(content[1], 0x00);
			assert.equal(content[2], 0x80);
			assert.equal(content[3], 0x7F);
			assert.equal(content[4], undefined);
		});

	});
});
