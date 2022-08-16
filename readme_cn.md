# FelisDB.js
**中文** | [English](./readme.md)

## 概述
**FelisDB.js**是一个操作IndexedDB数据库的工具封装库。它可以帮助简化对IndexedDB数据的操作代码。除了基本的函数式封装外，该库设计了一种Query语法，用于非函数式的数据库查询操作，以方便编码和阅读。
**FelisDB.js** is a toolkit library for operating the IndexedDB. It help coding the operation of the IndexedDB easily. This library designs a sql-like language to query the data from the database as the supplement to calling the functions.

## 基本用法

### 安装
```
npm install felisdb
```

### 创建/打开数据库
```javascript
// 打开名为DBName的数据库，并在库中创建标student，该表具有名为id和name的键以及以此键简历的索引
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
注意，如果要修改一个已存在的数据库的结构，需要提升version数值。

### 获取对一个表的访问实例
```javascript
// 以只读方式打开表student
var accessor = db.accessStore("student", "r");
// 以可读写方式打开表student
var accessor = db.accessStore("student", "rw");
```

### 用Query语法查询表
```javascript
// 在索引id中查找键值大于等于17的记录
accessor.query`* in index id where ${FelisDB.range`>=17`} do ${console.log}`;
```

### 使用常规函数进行数据的添加和查询
```javascript
// 添加记录
accessor.put({id: 1, name: "Jack"}).put({id: 2, name: "Jason"});
// 在索引id中读取键值为2的记录
accessor.index("id").get(2).lastResult().then(console.log);
```

## API
请参考[API文档](./doc/api.md)

----------
Copyright ©2022 [Season Studio](mailto:season-studio@outlook.com)

