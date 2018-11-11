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
