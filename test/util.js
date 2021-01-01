/*
 * Test utility functions.
 *
 * Copyright (C) 2010-2021 Adam Nielsen <malvineous@shikadi.net>
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

const { RecordBuffer } = require('../index.js');

// Create a record buffer but initialise all the bytes to non-zero values.
function createRecordBuffer(len) {
	let rb = new RecordBuffer(len);
	for (let i = 0; i < rb.buffer.byteLength; i++) {
		rb.dataview.setUint8(i, 0xFF);
	}
	return rb;
}

module.exports = {
	createRecordBuffer,
};
