<a name="StoreAccessor"></a>

## StoreAccessor
Accessor of the store

**Kind**: global class  

* [StoreAccessor](#StoreAccessor)
    * [new StoreAccessor(_dbPromise, _name, _mode)](#new_StoreAccessor_new)
    * [.lastResult()](#StoreAccessor+lastResult) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.newTranscation()](#StoreAccessor+newTranscation) ⇒ [<code>StoreAccessor</code>](#StoreAccessor)
    * [.count(query)](#StoreAccessor+count) ⇒ [<code>StoreAccessor</code>](#StoreAccessor)
    * [.get(query)](#StoreAccessor+get) ⇒ [<code>StoreAccessor</code>](#StoreAccessor)
    * [.all(query, count)](#StoreAccessor+all) ⇒ [<code>StoreAccessor</code>](#StoreAccessor)
    * [.keys(query, count)](#StoreAccessor+keys) ⇒ [<code>StoreAccessor</code>](#StoreAccessor)
    * [.firstKey(query)](#StoreAccessor+firstKey) ⇒ [<code>StoreAccessor</code>](#StoreAccessor)
    * [.add(value, key)](#StoreAccessor+add) ⇒ [<code>StoreAccessor</code>](#StoreAccessor)
    * [.put(value, key)](#StoreAccessor+put) ⇒ [<code>StoreAccessor</code>](#StoreAccessor)
    * [.clear()](#StoreAccessor+clear) ⇒ [<code>StoreAccessor</code>](#StoreAccessor)
    * [.delete(query)](#StoreAccessor+delete) ⇒ [<code>StoreAccessor</code>](#StoreAccessor)
    * [.forEach(_fn, query, direction)](#StoreAccessor+forEach) ⇒ <code>Promise</code>
    * [.forEachKey(_fn, query, direction)](#StoreAccessor+forEachKey) ⇒ <code>Promise</code>
    * [.index(_name)](#StoreAccessor+index) ⇒ [<code>StoreAccessor</code>](#StoreAccessor)
    * [.query()](#StoreAccessor+query) ⇒ [<code>StoreAccessor</code>](#StoreAccessor)

<a name="new_StoreAccessor_new"></a>

### new StoreAccessor(_dbPromise, _name, _mode)
Create the instance of the accessor of the store


| Param | Type | Description |
| --- | --- | --- |
| _dbPromise | <code>Promise.&lt;IDBDatabase&gt;</code> | The promise resolved by an instance of the IDBDatabase |
| _name | <code>String</code> | The name of the store |
| _mode | <code>String</code> | The mode of the accessor. It can be "rw" or "r". Any other value is treated as "r". |

<a name="StoreAccessor+lastResult"></a>

### storeAccessor.lastResult() ⇒ <code>Promise.&lt;Object&gt;</code>
Get the promise resolved by the last result

**Kind**: instance method of [<code>StoreAccessor</code>](#StoreAccessor)  
<a name="StoreAccessor+newTranscation"></a>

### storeAccessor.newTranscation() ⇒ [<code>StoreAccessor</code>](#StoreAccessor)
Force starting a new transaction

**Kind**: instance method of [<code>StoreAccessor</code>](#StoreAccessor)  
**Returns**: [<code>StoreAccessor</code>](#StoreAccessor) - This instance itself  
<a name="StoreAccessor+count"></a>

### storeAccessor.count(query) ⇒ [<code>StoreAccessor</code>](#StoreAccessor)
Get the count of the record

**Kind**: instance method of [<code>StoreAccessor</code>](#StoreAccessor)  
**Returns**: [<code>StoreAccessor</code>](#StoreAccessor) - This instance itself  

| Param | Type | Description |
| --- | --- | --- |
| query | <code>Any</code> | A key or IDBKeyRange object that specifies a range of records |

<a name="StoreAccessor+get"></a>

### storeAccessor.get(query) ⇒ [<code>StoreAccessor</code>](#StoreAccessor)
Get the special record

**Kind**: instance method of [<code>StoreAccessor</code>](#StoreAccessor)  
**Returns**: [<code>StoreAccessor</code>](#StoreAccessor) - This instance itself  

| Param | Type | Description |
| --- | --- | --- |
| query | <code>Any</code> | A key or IDBKeyRange object that specifies a range of records |

<a name="StoreAccessor+all"></a>

### storeAccessor.all(query, count) ⇒ [<code>StoreAccessor</code>](#StoreAccessor)
Get all record in the store or the index

**Kind**: instance method of [<code>StoreAccessor</code>](#StoreAccessor)  
**Returns**: [<code>StoreAccessor</code>](#StoreAccessor) - This instance itself  

| Param | Type | Description |
| --- | --- | --- |
| query | <code>Any</code> | Optional. A key or IDBKeyRange object that specifies a range of records |
| count | <code>Number</code> | Optional. Specifies the number of values to return if more than one is found. |

<a name="StoreAccessor+keys"></a>

### storeAccessor.keys(query, count) ⇒ [<code>StoreAccessor</code>](#StoreAccessor)
Get all keys in the store or the index

**Kind**: instance method of [<code>StoreAccessor</code>](#StoreAccessor)  
**Returns**: [<code>StoreAccessor</code>](#StoreAccessor) - This instance itself  

| Param | Type | Description |
| --- | --- | --- |
| query | <code>Any</code> | Optional. A key or IDBKeyRange object that specifies a range of records |
| count | <code>Number</code> | Optional. Specifies the number of values to return if more than one is found. |

<a name="StoreAccessor+firstKey"></a>

### storeAccessor.firstKey(query) ⇒ [<code>StoreAccessor</code>](#StoreAccessor)
Get the first key in the store or the index

**Kind**: instance method of [<code>StoreAccessor</code>](#StoreAccessor)  
**Returns**: [<code>StoreAccessor</code>](#StoreAccessor) - This instance itself  

| Param | Type | Description |
| --- | --- | --- |
| query | <code>Any</code> | A key or IDBKeyRange object that specifies a range of records |

<a name="StoreAccessor+add"></a>

### storeAccessor.add(value, key) ⇒ [<code>StoreAccessor</code>](#StoreAccessor)
Add a new record in the store

**Kind**: instance method of [<code>StoreAccessor</code>](#StoreAccessor)  
**Returns**: [<code>StoreAccessor</code>](#StoreAccessor) - This instance itself  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>Any</code> | The value of the record. |
| key | <code>Any</code> | Optional. The key of the record. |

<a name="StoreAccessor+put"></a>

### storeAccessor.put(value, key) ⇒ [<code>StoreAccessor</code>](#StoreAccessor)
Update an existed record or add a new record in the store

**Kind**: instance method of [<code>StoreAccessor</code>](#StoreAccessor)  
**Returns**: [<code>StoreAccessor</code>](#StoreAccessor) - This instance itself  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>Any</code> | The value of the record. |
| key | <code>Any</code> | Optional. The key of the record. |

<a name="StoreAccessor+clear"></a>

### storeAccessor.clear() ⇒ [<code>StoreAccessor</code>](#StoreAccessor)
Clear any record in the store

**Kind**: instance method of [<code>StoreAccessor</code>](#StoreAccessor)  
**Returns**: [<code>StoreAccessor</code>](#StoreAccessor) - This instance itself  
<a name="StoreAccessor+delete"></a>

### storeAccessor.delete(query) ⇒ [<code>StoreAccessor</code>](#StoreAccessor)
Delete the special record

**Kind**: instance method of [<code>StoreAccessor</code>](#StoreAccessor)  
**Returns**: [<code>StoreAccessor</code>](#StoreAccessor) - This instance itself  

| Param | Type | Description |
| --- | --- | --- |
| query | <code>Any</code> | A key or IDBKeyRange object that specifies a range of records |

<a name="StoreAccessor+forEach"></a>

### storeAccessor.forEach(_fn, query, direction) ⇒ <code>Promise</code>
Enumerate each record in the store or in the index

**Kind**: instance method of [<code>StoreAccessor</code>](#StoreAccessor)  
**Returns**: <code>Promise</code> - The promise for waiting for the end of the enumerating.  

| Param | Type | Description |
| --- | --- | --- |
| _fn | <code>function</code> | The callback function for processing each record |
| query | <code>Any</code> | Optional. A key or IDBKeyRange object that specifies a range of records |
| direction | <code>String</code> | Optional. A string telling the cursor which direction to travel. The default is "next" |

<a name="StoreAccessor+forEachKey"></a>

### storeAccessor.forEachKey(_fn, query, direction) ⇒ <code>Promise</code>
Enumerate each key in the store or in the index

**Kind**: instance method of [<code>StoreAccessor</code>](#StoreAccessor)  
**Returns**: <code>Promise</code> - The promise for waiting for the end of the enumerating.  

| Param | Type | Description |
| --- | --- | --- |
| _fn | <code>function</code> | The callback function for processing each key |
| query | <code>Any</code> | Optional. A key or IDBKeyRange object that specifies a range of records |
| direction | <code>String</code> | Optional. A string telling the cursor which direction to travel. The default is "next" |

<a name="StoreAccessor+index"></a>

### storeAccessor.index(_name) ⇒ [<code>StoreAccessor</code>](#StoreAccessor)
Special a index for the following request

**Kind**: instance method of [<code>StoreAccessor</code>](#StoreAccessor)  
**Returns**: [<code>StoreAccessor</code>](#StoreAccessor) - This instance itself  

| Param | Type | Description |
| --- | --- | --- |
| _name | <code>String</code> | Optional. The name of the index. If the argument is ignored, the following request will work with the store instead of the index. |

<a name="StoreAccessor+query"></a>

### storeAccessor.query() ⇒ [<code>StoreAccessor</code>](#StoreAccessor)
Evaluate a query string.The best practice is invoking this method followed by a template literals.The syntax of the query template literals is:[*|first|count] <in index [name]> <where ${[key|IDBKeyRange|function]} <[asc|desc] <unique>>> <do ${function}>

**Kind**: instance method of [<code>StoreAccessor</code>](#StoreAccessor)  
**Returns**: [<code>StoreAccessor</code>](#StoreAccessor) - This instance itself  
**Example**  
```js
// query any record in the store and log them in the consoleinstance.query`* do ${console.log}`;
```
**Example**  
```js
// query any record in the index "abc" and log them in the consoleinstance.query`* in index abc do ${console.log}`;
```
**Example**  
```js
// query the records in the store which the key is larger the 17 and log them in the consoleinstance.query`* where ${FelisDB.range`> ${17}`} do ${console.log}`;
```
**Example**  
```js
// query the records in the index abc which contains the job as "teacher" and log them in the consoleinstance.query`* in index abc where ${(item)=> item.job === "teacher"} do ${console.log}`;
```
**Example**  
```js
// query the records in the index abc which the key is larger the 17 and list them in decrease orderinstance.query`* in index abc where ${FelisDB.range`> ${17}`} desc do ${console.log}`
```
**Example**  
```js
// query the unique records in the index abc which the key is larger the 17 and list them in decrease orderinstance.query`* in index abc where ${FelisDB.range`> ${17}`} desc unique do ${console.log}`
```
**Example**  
```js
// query the count in the store which the key is larger the 17 and display the count in the consoleinstance.query`count where ${FelisDB.range`> ${17}`} do ${(r) => console.log(r)}`
```
**Example**  
```js
// query the first record in the store which the key is larger the 17 and display it in the consoleinstance.query`first where ${FelisDB.range`> ${17}`} do ${console.log}`
```
<a name="FelisDB"></a>

## FelisDB
The Class of the FelisDB for operating the indexedDB

**Kind**: global class  

* [FelisDB](#FelisDB)
    * [new FelisDB(_name, _opt)](#new_FelisDB_new)
    * _instance_
        * [.close()](#FelisDB+close) ⇒ <code>Promise</code>
        * [.getDB()](#FelisDB+getDB) ⇒ <code>Promise.&lt;IDBDatabase&gt;</code>
        * [.accessStore(_name, _mode)](#FelisDB+accessStore) ⇒ [<code>StoreAccessor</code>](#StoreAccessor)
        * [.getVersion()](#FelisDB+getVersion) ⇒ <code>Promise.&lt;Number&gt;</code>
        * [.getStores()](#FelisDB+getStores) ⇒ <code>Promise.&lt;DOMStringList&gt;</code>
    * _static_
        * [.range()](#FelisDB.range) ⇒ <code>IDBKeyRange</code>

<a name="new_FelisDB_new"></a>

### new FelisDB(_name, _opt)
Create an instance of the FelisDB.


| Param | Type | Description |
| --- | --- | --- |
| _name | <code>String</code> | The name of the DB. The DB will be opened if it is existed. Otherwise the DB with this name will be created. |
| _opt | <code>Object</code> | The option of the DB |
| _opt.version | <code>Number</code> | Optional. The version of the DB |
| _opt.stores | <code>Object</code> | Optional. The stores contained in the DB. Each key of the object is the name of the store. This argument is used only when the version of the DB is upgraded. |
| _opt.stores.xxx | <code>null</code> \| <code>String</code> \| <code>Array.&lt;String&gt;</code> \| <code>Object</code> | The configuration of the store named "xxx". The value with the typeof string or array means the key of the store. The value with the typeof object means the advance configuration of the store. The value taken as  null means the store with common key and the key is increased automatically. |
| _opt.stores.xxx.keyPath | <code>String</code> \| <code>Array.&lt;string&gt;</code> | The keys of the store named "xxx". |
| _opt.stores.xxx.autoIncrement | <code>Boolean</code> | Optional. Set true means the value of the key in the store named "xxx" will be increased automatically. |
| _opt.stores.xxx.indexs | <code>Object</code> | Optional. The indexs in the store named "xxx". Each key of the object is the name of the special index. |
| _opt.stores.xxx.indexs.yyy | <code>Object</code> | The configuration of the index named "yyy" in store named "xxx". |
| _opt.stores.xxx.indexs.yyy.keyPath | <code>String</code> \| <code>Array</code> | The key for the index named "yyy" to use. |
| _opt.stores.xxx.indexs.yyy.unique | <code>Boolean</code> | If true, the index will not allow duplicate values for a single key. |
| _opt.stores.xxx.indexs.yyy.multiEntry | <code>Boolean</code> | If true, the index will add an entry in the index for each array element when the keyPath resolves to an array. If false, it will add one single entry containing the array. |
| _opt.removeStores | <code>Array.&lt;String&gt;</code> | The names of the store which will be removed from the DB. This argument is used only when the version of the DB is upgraded. |

**Example**  
```js
// Open/Create a database name "TestDB". It's version is 1. // The store named "Table1" will be removed. // The store named "Table2" with a common auto-increment key will be contained in the store.// The store named "Table3" with keys ["id", "name"] will be contained in the store.// The store named "Table4" with keys ["id", "name"] and with index use key "id" named "abc" will be contained in the store.new FelisDB("TestDB", {    version: 1,    stores: {        Table2: null,        Table3: ["id", "name"],        Table4: {            keyPath: ["id", "name"],            indexs: {                abc: {                    keyPath: "id"                }            }        }    },    removeStores: ["Table1"]});
```
<a name="FelisDB+close"></a>

### felisDB.close() ⇒ <code>Promise</code>
Close the DB

**Kind**: instance method of [<code>FelisDB</code>](#FelisDB)  
**Returns**: <code>Promise</code> - The promise for waiting the close action finished.  
<a name="FelisDB+getDB"></a>

### felisDB.getDB() ⇒ <code>Promise.&lt;IDBDatabase&gt;</code>
Get the instance of the IDBDatabase

**Kind**: instance method of [<code>FelisDB</code>](#FelisDB)  
**Returns**: <code>Promise.&lt;IDBDatabase&gt;</code> - The promise resolved by the db  
<a name="FelisDB+accessStore"></a>

### felisDB.accessStore(_name, _mode) ⇒ [<code>StoreAccessor</code>](#StoreAccessor)
Create an instance of StoreAccessor for accessing the content of the a special store

**Kind**: instance method of [<code>FelisDB</code>](#FelisDB)  
**Returns**: [<code>StoreAccessor</code>](#StoreAccessor) - The accessor  

| Param | Type | Description |
| --- | --- | --- |
| _name | <code>String</code> | The name of the store |
| _mode | <code>String</code> | The mode of the accessor. The value can be "rw" or "r". Any other value is treasted as "r". |

<a name="FelisDB+getVersion"></a>

### felisDB.getVersion() ⇒ <code>Promise.&lt;Number&gt;</code>
Get the version of the DB

**Kind**: instance method of [<code>FelisDB</code>](#FelisDB)  
**Returns**: <code>Promise.&lt;Number&gt;</code> - The promise resolved by the version of the DB  
<a name="FelisDB+getStores"></a>

### felisDB.getStores() ⇒ <code>Promise.&lt;DOMStringList&gt;</code>
Get the names of the stores in the DB

**Kind**: instance method of [<code>FelisDB</code>](#FelisDB)  
**Returns**: <code>Promise.&lt;DOMStringList&gt;</code> - The promise resolved by the names of the stores  
<a name="FelisDB.range"></a>

### FelisDB.range() ⇒ <code>IDBKeyRange</code>
Generating an instance of the IDBKeyRangeThe best practice is invoking this method followed by a template literals.

**Kind**: static method of [<code>FelisDB</code>](#FelisDB)  
**Example**  
```js
// The range >=1 and <10FelisDB.range`>= ${1} and < ${10}`
```