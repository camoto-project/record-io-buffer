# Record I/O library for JS
Copyright 2018 Adam Nielsen <<malvineous@shikadi.net>>  

This is a utility library that can read from and write to memory buffers, in
logical records that are defined in terms of low-level data types.

Example:

    const recordTypes = {
    	header: {
    		signature: Type.string.fixed.noTerm(12),
    		fileCount: Type.int.u32le,
    	},
    };

    let buffer = new RecordBuffer(content);
    let header = buffer.readRecord(recordTypes.header);

    console.log(`There are ${header.fileCount} files.`);

All strings are treated as being in the IBM437 codepage, as this was the most
widely used codepage in DOS.

There are some utility functions too:

    // Convert an array of bytes into a string using IBM437 character codes.
    const data = [0x41, 0x01, 0x02, 0xB0, 0xB1, 0xB2, 0x0D, 0x0A];
    const str = RecordType.string.fromArray(data);
    console.log(str);
    // Outputs: A☺☻░▒▓♪◙

Although the idea is to read and write whole records, individual fields can
be read and written if needed, which may be simpler if the record would
otherwise only have one element:

    let buffer = new RecordBuffer(content);
    let count = buffer.read(RecordType.int.u32le); // read one UINT32LE

## Reference

The data types you can pass to `readRecord()` and `writeRecord()` are:

##### int.u8

Unsigned byte, 0..255.

##### int.s8

Signed byte, -128..127.

##### int.u16le / int.u16be

Unsigned short integer, 0..65535, little or big endian.

##### int.s16le / int.s16be

Signed short integer, -32768..32767, little or big endian.

##### int.u32le / int.u32be

Unsigned integer, 0..4294967295, little or big endian.

##### int.s32le / int.s32be

Signed integer, -2147483648..2147483647, little or big endian.

##### string.fixed.noTerm(len)

Fixed-length string with no null termination.

When reading, the exact length will be read (in bytes) and any null
bytes will be included in the returned string.

When writing, the exact length will be written (in bytes) and if the
string is shorter than this, it will be padded with 0x00 null bytes.
if the string is longer or exactly the given length, no null bytes
will be written.

##### string.fixed.reqTerm(len)

Fixed-length string with mandatory null termination.

When reading, the exact length will be read but the string will stop
at the first 0x00 null byte encountered, which will not be included in
the returned value.  However the given number of bytes will always be
read.

When writing, the exact length will be written in bytes, with any short
strings being padded by 0x00 null bytes.  If the string is the exact
length of the field or longer, it will be truncated so that the last
byte written will always be a null byte.  Thus a field of this type
with a length of X, can only ever store a maximum of X - 1 characters
plus the mandatory 0x00 terminating null character.

##### string.fixed.optTerm(len)

Fixed-length string with optional termination.

When reading, the exact length will be read (in bytes) but the string
will stop at the first null byte encountered.  If there is no null byte
then the full given number of bytes will be read.

When writing, functions the same as string.fixed.noTerm.

##### string.variable.reqTerm(maxLen)

Variable-length string with mandatory null termination.

When reading, bytes will be read and included in the string until the
first null byte is encountered, which will not be included in the
returned string.  The null byte will be included in the number of
characters read from the buffer.  If the maximum length is reached, the
full string will be returned but bytes will not be read beyond this
point.

When writing, one byte will be written for each character in the string
plus an extra one for the final null character.  If the string is
equal to or longer than the maximum length then it will be truncated to
ensure that the terminating null can fit within the allowed length.

##### string.variable.optTerm(maxLen)

Variable-length string with optional termination.

When reading, functions the same as variable.reqTerm.

When writing, one byte will be written for each character in the string
and a final terminating null will only be written if space allows.  If
the string is the maximum length given (or longer), then it will be
truncated but no final null byte will be written.

##### padding(len, value)

Unused bytes for padding and alignment.

When reading, returns a Uint8Array with the data.

When writing, fills the block with a single byte, by default 0x00.
