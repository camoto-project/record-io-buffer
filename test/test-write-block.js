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

describe('Writes blocks of data correctly', function() {

	it('Writes an array of numbers as a list of bytes', function() {
		let rb = new RecordBuffer(8);

		rb.put([0x12, 0x34]);
		rb.put([0xFF, 0x00]);
		rb.put([0x80, 0x7F, 0x01]);

		assert.deepEqual(rb.getTypedArray(Uint8Array), Uint8Array.from([
			0x12, 0x34, 0xFF, 0x00, 0x80, 0x7F, 0x01,
		]));
	});

	it('Writes a Uint8Array', function() {
		let rb = new RecordBuffer(8);

		let ab = new ArrayBuffer(7);
		let dv = new Uint8Array(ab);
		dv[0] = 0x12;
		dv[1] = 0x34;
		dv[2] = 0xFF;
		dv[3] = 0x00;
		dv[4] = 0x80;
		dv[5] = 0x7F;
		dv[6] = 0x01;

		rb.put(dv);

		assert.deepEqual(rb.getTypedArray(Uint8Array), Uint8Array.from([
			0x12, 0x34, 0xFF, 0x00, 0x80, 0x7F, 0x01,
		]));
	});

	it('Writes an ArrayBuffer', function() {
		let rb = new RecordBuffer(8);

		let ab = new ArrayBuffer(7);
		let dv = new Uint8Array(ab);
		dv[0] = 0x12;
		dv[1] = 0x34;
		dv[2] = 0xFF;
		dv[3] = 0x00;
		dv[4] = 0x80;
		dv[5] = 0x7F;
		dv[6] = 0x01;

		rb.put(ab);

		assert.deepEqual(rb.getTypedArray(Uint8Array), Uint8Array.from([
			0x12, 0x34, 0xFF, 0x00, 0x80, 0x7F, 0x01,
		]));
	});

	it('Enlarges the array as needed', function() {
		let rb = new RecordBuffer(4);

		rb.put([0x12, 0x34]);
		rb.put([0x56, 0x78, 0x9A]);
		rb.put([0xBC, 0xDE]);

		assert.deepEqual(rb.getTypedArray(Uint8Array), Uint8Array.from([
			0x12, 0x34, 0x56, 0x78, 0x9A, 0xBC, 0xDE,
		]));
	});

});
