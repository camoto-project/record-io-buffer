# Record I/O library for JS
Copyright 2018 Adam Nielsen <<malvineous@shikadi.net>>  

This is a utility library that can read from and write to Buffer objects, in
logical records that are defined in terms of low-level data types.

Example:

    const recordTypes = {
    	header: {
    		signature: Type.string.fixed.withNulls(12),
    		fileCount: Type.int.u32le,
    	},
    };

    let buffer = new BufferWalk(content);
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
