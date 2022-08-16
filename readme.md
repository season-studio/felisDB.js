# FelisDB.js
[中文](./readme_cn.md) | **English**

## Summary
**FelisDB.js** is a toolkit library for operating the IndexedDB. It help coding the operation of the IndexedDB easily. This library designs a sql-like language to query the data from the database as the supplement to calling the functions.

## How to use

### Install
```
npm install felisdb
```

### Create/Open the database
```javascript
// Open a database named "DBName". And create a table named "student". This table has key "id" and "name". And tow index use this keys are created in this table.
var db = new FelisDB("DBName", {
    version: 1,
    stores: {
        student: {
            keyPath: ["id", "name"],
            indexs: {
                id: "id",
                name: "name"
            }
        }
    }
});
```
Note: The version number should be increased if you want to modify the struct of a existing database.

### Get an accessor of a table
```javascript
// Open the table named "student" for read only.
var accessor = db.accessStore("student", "r");
// Open the table named "student" for read write.
var accessor = db.accessStore("student", "rw");
```
### Query records by the sql-like language
```javascript
// Query records in the index "id" with the value of the id is equal to or greater than 17.
accessor.query`* in index id where ${FelisDB.range`>=17`} do ${console.log}`;
```
### Modify and query the record by calling the common functions
```javascript
// Update the record
accessor.put({id: 1, name: "Jack"}).put({id: 2, name: "Jason"});
// Read record in index "id" withe the value of the id is equal to 2
accessor.index("id").get(2).lastResult().then(console.log);
```

## API
See [API Document](./doc/api.md) for more information.

----------
Copyright ©2022 [Season Studio](mailto:season-studio@outlook.com)