var fs = require('fs');
var path = require('path');
var emptydb = {
    "boxes": [],
    "globalIdCounter": 0
}

fs.writeFileSync(path.join(__dirname, '../db.json'), JSON.stringify(emptydb, null, 2));