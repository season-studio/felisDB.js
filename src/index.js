const FelisWebDBTransactionEnd = Symbol("Felis.Web.DB.Transaction.End");
const FelisWebDBClearIndex = Symbol("Felis.Web.DB.Clear.Index");

//#region FelisDBError
/**
 * Error inside the FelisDB
 * @param {Number} _code the code of the Error
 * @param  {Error|String} _msg the message of the Error, or the other error cause the error
 * @returns The instance of the FelisDBError
 * @ignore
 */
 function FelisDBError(_code, _msg) {
    if (this instanceof FelisDBError) {
        let stackError;
        if (_msg instanceof Error) {
            stackError = _msg;
            _msg = _msg.message;
        }
        let instance = Reflect.construct(Error, [_msg, ...Array.prototype.slice(2)]);
        Object.defineProperties(instance, {
            $code: {
                value: _code,
                writable: false,
                configurable: false,
                enumerable: true
            },
            $stackError: {
                value: stackError,
                writable: false,
                configurable: false,
                enumerable: true
            }
        });
        Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
        (Error.captureStackTrace) && Error.captureStackTrace(instance, FelisDBError);
        return instance;
    } else if (_code instanceof FelisDBError) {
        return _code;
    } else if (_code instanceof Error) {
        return new FelisDBError(-1, ...arguments);
    } else {
        return new FelisDBError(...arguments);
    }
}
//#endregion

//#region QueryParser
const QSL_START = 0;
const QSL_IN_OR_COND = 1;
const QSL_INDEX = 2;
const QSL_COND = 3;
const QSL_COND_ORDER = 4;
const QSL_DO = 5;
const QSL_$END = Number.MAX_SAFE_INTEGER;

/**
 * callback function for filteing record by the filter member binding with this function
 * @param {*} _value The value of the record to be filted
 * @param {*} _key The key of the record
 * @param {*} _cursor The current cursor
 * @ignore
 */
function filter(_value, _key, _cursor) {
    if ((typeof this.filter !== "function") || this.filter(_value, _key)) {
        (typeof this.processor === "function") && this.processor(_value, _key, _cursor);
        return true;
    }
}

/**
 * callback function for filteing the first record from the query
 * @param {*} _value The value of the record to be filted
 * @param {*} _key The key of the record
 * @param {*} _cursor The current cursor
 * @ignore
 */
function filterFirst(_value, _key, _cursor) {
    if (filter.call(this, _value, _key, _cursor)) {
        throw null;
    }
}

/**
 * callback function for working with the last result of the query by the function binded as the this object
 * @param {Object} _acc The accessor object
 * @param {Promise<Object>} _ret The promise of the last result
 * @ignore
 */
async function workWithLastResult(_acc, _ret) {
    if (typeof this === "function") {
        let result = await _ret;
        this(result.value, result.key, null, result.error);
    }
}

/**
 * Parser for the where segment
 * @param {Object} _context 
 * @ignore
 */
function where(_context) {
    let next = _context.sourceList[_context.index++];
    if (!next || (typeof next !== "object")) {
        throw FelisDBError(6, "Expect ${...} after where");
    }
    let target = _context.targeList.at(-1);
    let targetArgs = (target && target.args) || [];
    if (typeof next.arg === "function") {
        let arg0 = targetArgs[0];
        (typeof arg0 !== "function") && (arg0 = filter);
        let bindObj = { filter: next.arg, oriFn: arg0 };
        arg0 = arg0.bind(bindObj);
        arg0.$bindObj = bindObj;
        targetArgs[0] = arg0;
    } else {
        targetArgs.push(next.arg);
    }
    _context.stateLevel = QSL_COND_ORDER;
}

/**
 * Parser for the do segment
 * @param {Object} _context 
 * @ignore
 */
function parserDo(_context) {
    let next = _context.sourceList[_context.index++];
    if (!next || (typeof next.arg !== "function")) {
        throw FelisDBError(7, "Expect ${function} after do");
    }
    let target = _context.targeList.at(-1);
    if (target.action === "forEach") {
        let targetArgs = (target && target.args) || [];
        let arg0 = targetArgs[0];
        if (typeof arg0 === "function") {
            let bindObj = arg0.$bindObj || {};
            let oriFn = (bindObj.oriFn || arg0);
            bindObj.processor = next.arg;
            targetArgs[0] = oriFn.bind(bindObj);
        } else {
            targetArgs[0] = next.arg;
        }
    } else {
        _context.targeList.push({action:"request", args:[workWithLastResult.bind(next.arg)]});
    }
    _context.stateLevel = QSL_$END;
}

/**
 * The state machine for parse the query
 * @ignore
 */
const QueryParserStateMachine = {
    [QSL_START]: {
        "*": function (_context) {
            _context.targeList.push({action:"forEach", args:[null]});
            _context.stateLevel = QSL_IN_OR_COND;
        },
        "count": function (_context) {
            _context.targeList.push({action:"count", args:[]});
            _context.stateLevel = QSL_IN_OR_COND;
        },
        "first": function (_context) {
            _context.targeList.push({action:"forEach", args:[filterFirst]});
            _context.stateLevel = QSL_IN_OR_COND;
        }
    }, 
    [QSL_IN_OR_COND]: {
        "in": function (_context) {
            _context.stateLevel = QSL_INDEX;
        },
        where,
        "do": parserDo
    }, 
    [QSL_INDEX]: {
        "index": function (_context) {
            let next = _context.sourceList[_context.index++];
            next && (typeof next === "object") && (next = next.arg || String(next.arg));
            _context.targeList.unshift({action:"index", args:[next]});
            _context.stateLevel = QSL_COND;
        }
    }, 
    [QSL_COND]: {
        where,
        "do": parserDo
    }, 
    [QSL_COND_ORDER]: {
        "asc": function (_context) {
            let target = _context.targeList.at(-1);
            let targetArgs = (target && target.args) || [];
            let next = _context.sourceList[_context.index];
            if (next === "unique") {
                targetArgs.push("nextunique");
                _context.index += 1;
            } else {
                targetArgs.push("next");
            }
            _context.stateLevel = QSL_DO;
        },
        "desc": function (_context) {
            let target = _context.targeList.at(-1);
            let targetArgs = (target && target.args) || [];
            let next = _context.sourceList[_context.index];
            if (next === "unique") {
                targetArgs.push("prevunique");
                _context.index += 1;
            } else {
                targetArgs.push("prev");
            }
            _context.stateLevel = QSL_DO;
        },
        "do": parserDo
    }, 
    [QSL_DO]: {
        "do": parserDo
    }
};
//#endregion

/**
 * Accessor of the store
 * @class
 */
class StoreAccessor {

    #requestPromise;
    #resultPromise;
    #lastError;

    /**
     * Translate the input as the result
     * @param {*} _resultPromie The input object should be translated. It may be the promise of the IDBRequest or IDBCursor or anything else.
     * @returns {Object<value, error, key>} The object of the result
     * @static
     * @ignore
     */
    static async #TranslateResult(_resultPromie) {
        let ret = (_resultPromie instanceof Promise ? await _resultPromie : _resultPromie);
        if (ret instanceof IDBRequest) {
            ret = {
                value: ret.result,
                error: ret.error
            };
            if (ret.value instanceof IDBCursor) {
                ret.key = ret.value.key;
                ret.primaryKey = ret.value.primaryKey;
                ret.value = ret.value.value;
            }
        } else if (ret instanceof Error) {
            ret = {
                error: ret
            };
        } else {
            ret = {
                value: ret
            };
        }
        return ret;
    }

    /**
     * Create the instance of the accessor of the store
     * @param {Promise<IDBDatabase>} _dbPromise The promise resolved by an instance of the IDBDatabase
     * @param {String} _name The name of the store
     * @param {String} _mode The mode of the accessor. It can be "rw" or "r". Any other value is treated as "r".
     */
    constructor(_dbPromise, _name, _mode) {
        _mode = ((_mode === "rw") ? "readwrite" : "readonly");
        
        this.#requestPromise = undefined;
        this.#resultPromise = undefined;
        this.#lastError = undefined;

        // make up the generator for starting up a request
        Object.defineProperties(this, {
            request: {
                writable: false,
                configurable: false,
                enumerable: false,
                value: (fn, forceNewTransaction) => {
                    if (typeof fn === "function") {
                        let thisError = undefined;
                        // wait for the last request
                        this.#requestPromise = Promise.resolve(this.#requestPromise)
                        .then(ret => {
                            // check if there is an available transcation, otherwise start a new one
                            return (forceNewTransaction || !ret || !(ret.objectStore instanceof IDBObjectStore) || ret.objectStore.transaction[FelisWebDBTransactionEnd]) ? Promise.resolve(Promise.resolve(_dbPromise).then(db => {
                                let tx = db.transaction(_name, _mode);
                                if (tx) {
                                    let finalFn = () => tx[FelisWebDBTransactionEnd] = true;
                                    tx.addEventListener("complete", finalFn);
                                    tx.addEventListener("abort", finalFn);
                                    return { objectStore: tx.objectStore(_name) };
                                }
                            })) : ret;
                        }).then(async accessor => { 
                            if (!accessor || !(accessor.objectStore instanceof IDBObjectStore)) {
                                throw FelisDBError(3, "Can not start transaction");
                            }
                            // callback for the request action
                            let maybeReq;
                            try {
                                maybeReq = fn(accessor, StoreAccessor.#TranslateResult(this.#resultPromise), Promise.resolve(this.#resultPromise));
                            } catch(err) {
                                console.warn("Uncatched exception in processing request action", err);
                            }
                            const req = await Promise.resolve(maybeReq);
                            if (req instanceof IDBRequest) {
                                // If the request action generates a instance of IDBRequest, update the record of the last result.
                                // And generating a promise for waiting the pending request.
                                if (req.readyState !== "pending") {
                                    this.#resultPromise = Promise.resolve(req);
                                    return accessor;
                                } else {
                                    let resultResolver;
                                    this.#resultPromise = new Promise(resolve => resultResolver = resolve);
                                    return new Promise(resolveReq => {
                                        req.onerror = (req.onsuccess = (e) => {
                                            resultResolver(e.target || { error: FelisDBError(2, "Lost target on event") });
                                            resolveReq(accessor);
                                        });
                                    });
                                }
                            } else if (req instanceof IDBIndex) {
                                // Update the index
                                return req;
                            } else if ((req === FelisWebDBClearIndex) && (accessor instanceof IDBIndex)) {
                                // Clear the index
                                return accessor.objectStore;
                            } else {
                                return accessor;
                            }
                        }).catch(err => {
                            thisError = err;
                        }).finally(() => {
                            this.#lastError = thisError;
                            if (thisError) {
                                let errEvent = new ErrorEvent("error", {
                                    message: thisError.message || String(thisError),
                                });
                                Object.defineProperties(errEvent, {
                                    $stackError: {
                                        value: thisError,
                                        writable: false,
                                        configurable: false
                                    }
                                });
                                window.dispatchEvent(errEvent);
                            }
                        });
                    }
                    return this;
                }
            }
        });
    }

    /**
     * Get the promise resolved by the last result
     * @returns {Promise<Object>}
     */
    async lastResult() {
        await this.#requestPromise;
        return StoreAccessor.#TranslateResult(this.#resultPromise);
    }

    get lastError() {
        return this.#lastError;
    }

    /**
     * Force starting a new transaction
     * @return {StoreAccessor} This instance itself
     */
    newTranscation() {
        return this.request(function () {}, true);
    }

    /**
     * Get the count of the record
     * @param {Any} query A key or IDBKeyRange object that specifies a range of records
     * @return {StoreAccessor} This instance itself
     */
    count(query) {
        return this.request(accessor => {
            (accessor instanceof IDBIndex) || (accessor = accessor.objectStore);
            return accessor.count.apply(accessor, Array.prototype.slice.call(arguments, 0));
        });
    }

    /**
     * Get the special record
     * @param {Any} query A key or IDBKeyRange object that specifies a range of records
     * @return {StoreAccessor} This instance itself
     */
    get(query) {
        return this.request(accessor => {
            (accessor instanceof IDBIndex) || (accessor = accessor.objectStore);
            return accessor.get.apply(accessor, Array.prototype.slice.call(arguments, 0));
        });
    }

    /**
     * Get all record in the store or the index
     * @param {Any} query Optional. A key or IDBKeyRange object that specifies a range of records
     * @param {Number} count Optional. Specifies the number of values to return if more than one is found.
     * @return {StoreAccessor} This instance itself
     */
    all(query) {
        return this.request(accessor => {
            (accessor instanceof IDBIndex) || (accessor = accessor.objectStore);
            return accessor.getAll.apply(accessor, Array.prototype.slice.call(arguments, 0));
        });
    }

    /**
     * Get all keys in the store or the index
     * @param {Any} query Optional. A key or IDBKeyRange object that specifies a range of records
     * @param {Number} count Optional. Specifies the number of values to return if more than one is found.
     * @return {StoreAccessor} This instance itself
     */
    keys(query, count) {
        return this.request(accessor => {
            (accessor instanceof IDBIndex) || (accessor = accessor.objectStore);
            return accessor.getAllKeys.apply(accessor, Array.prototype.slice.call(arguments, 0));
        });
    }

    /**
     * Get the first key in the store or the index
     * @param {Any} query A key or IDBKeyRange object that specifies a range of records 
     * @return {StoreAccessor} This instance itself
     */
    firstKey(query) {
        return this.request(accessor => {
            (accessor instanceof IDBIndex) || (accessor = accessor.objectStore);
            return accessor.getKey.apply(accessor, Array.prototype.slice.call(arguments, 0));
        });
    }

    /**
     * Add a new record in the store
     * @param {Any} value The value of the record.
     * @param {Any} key Optional. The key of the record.
     * @return {StoreAccessor} This instance itself
     */
    add(value, key) {
        return this.request(accessor => IDBObjectStore.prototype.add.apply(accessor.objectStore, Array.prototype.slice.call(arguments, 0)));
    }

    /**
     * Update an existed record or add a new record in the store
     * @param {Any} value The value of the record.
     * @param {Any} key Optional. The key of the record.
     * @return {StoreAccessor} This instance itself
     */
    put() {
        return this.request(accessor => IDBObjectStore.prototype.put.apply(accessor.objectStore, Array.prototype.slice.call(arguments, 0)));
    }

    /**
     * Clear any record in the store
     * @return {StoreAccessor} This instance itself
     */
    clear() {
        return this.request(accessor => accessor.objectStore.clear());
    }

    /**
     * Delete the special record
     * @param {Any} query A key or IDBKeyRange object that specifies a range of records 
     * @return {StoreAccessor} This instance itself
     */
    delete() {
        return this.request(accessor => IDBObjectStore.prototype.delete.apply(accessor.objectStore, Array.prototype.slice.call(arguments, 0)));
    }

    /**
     * Enumerate each record in the store or in the index
     * @param {Function} _fn The callback function for processing each record
     * @param {Any} query Optional. A key or IDBKeyRange object that specifies a range of records
     * @param {String} direction Optional. A string telling the cursor which direction to travel. The default is "next"
     * @return {Promise} The promise for waiting for the end of the enumerating.
     */
    async forEach(_fn, query, direction) {
        if (typeof _fn === "function") {
            this.request(accessor => {
                (accessor instanceof IDBIndex) || (accessor = accessor.objectStore);
                let req = accessor.openCursor.apply(accessor, Array.prototype.slice.call(arguments, 1));
                return req && new Promise(resolve => {
                    req.onsuccess = (e) => {
                        try {
                            let cursor = e.target.result;
                            if(cursor) {
                                _fn(cursor.value, cursor.key, cursor);
                                cursor.continue();
                            } else {
                                resolve(req);
                            }
                        } catch(err) {
                            resolve(err || req);
                        }
                    };
                    req.onerror = (e) => resolve(req);
                });
            });

            await this.#requestPromise;
        }
    }

    /**
     * Enumerate each key in the store or in the index
     * @param {Function} _fn The callback function for processing each key
     * @param {Any} query Optional. A key or IDBKeyRange object that specifies a range of records
     * @param {String} direction Optional. A string telling the cursor which direction to travel. The default is "next"
     * @return {Promise} The promise for waiting for the end of the enumerating.
     */
    async forEachKey(_fn, query, direction) {
        if (typeof _fn === "function") {
            this.request(accessor => {
                (accessor instanceof IDBIndex) || (accessor = accessor.objectStore);
                let req = accessor.openKeyCursor.apply(accessor, Array.prototype.slice.call(arguments, 1));
                return req && new Promise(resolve => {
                    req.onsuccess = (e) => {
                        try {
                            let cursor = e.target.result;
                            if(cursor) {
                                _fn(cursor.key, cursor);
                                cursor.continue();
                            } else {
                                resolve(req);
                            }
                        } catch (err) {
                            resolve(err || req);
                        }
                    };
                    req.onerror = (e) => resolve(req);
                });
            });

            await this.#requestPromise;
        }
    }

    /**
     * Special a index for the following request
     * @param {String} _name Optional. The name of the index. If the argument is ignored, the following request will work with the store instead of the index.
     * @return {StoreAccessor} This instance itself
     */
    index(_name) {
        return this.request(accessor => 
            (arguments.length === 0) 
                ? FelisWebDBClearIndex 
                : IDBObjectStore.prototype.index.apply(accessor.objectStore, Array.prototype.slice.call(arguments, 0))
        );
    }

    /**
     * Evaluate a query string.
     * The best practice is invoking this method followed by a template literals.
     * The syntax of the query template literals is:
     * [*|first|count] <in index [name]> <where ${[key|IDBKeyRange|function]} <[asc|desc] <unique>>> <do ${function}>
     * @example 
     * // query any record in the store and log them in the console
     * instance.query`* do ${console.log}`;
     * @example 
     * // query any record in the index "abc" and log them in the console
     * instance.query`* in index abc do ${console.log}`;
     * @example 
     * // query the records in the store which the key is larger the 17 and log them in the console
     * instance.query`* where ${FelisDB.range`> ${17}`} do ${console.log}`;
     * @example
     * // query the records in the index abc which contains the job as "teacher" and log them in the console
     * instance.query`* in index abc where ${(item)=> item.job === "teacher"} do ${console.log}`;
     * @example
     * // query the records in the index abc which the key is larger the 17 and list them in decrease order
     * instance.query`* in index abc where ${FelisDB.range`> ${17}`} desc do ${console.log}`
     * @example
     * // query the unique records in the index abc which the key is larger the 17 and list them in decrease order
     * instance.query`* in index abc where ${FelisDB.range`> ${17}`} desc unique do ${console.log}`
     * @example
     * // query the count in the store which the key is larger the 17 and display the count in the console
     * instance.query`count where ${FelisDB.range`> ${17}`} do ${(r) => console.log(r)}`
     * @example
     * // query the first record in the store which the key is larger the 17 and display it in the console
     * instance.query`first where ${FelisDB.range`> ${17}`} do ${console.log}`
     * @return {StoreAccessor} This instance itself
     */
    query(_strList) {
        const sourceList = _strList.map((item, index) => {
            let itemAttr = String(item).split(/\s+/ig);
            (index > 0) && itemAttr.unshift({ arg: arguments[index] });
            return itemAttr;
        }).flat().filter(item => item);
        const parseContext = {
            index: QSL_START,
            sourceList,
            stateLevel: 0,
            targeList: []
        };

        const count = parseContext.sourceList.length;
        while (parseContext.index < count) {
            let item = String(sourceList[parseContext.index++]).toLowerCase();
            let parserList = QueryParserStateMachine[parseContext.stateLevel];
            let fn = parserList && parserList[item];
            if (typeof fn !== "function") {
                throw FelisDBError(5, `Unexpected "${item}"`);
            }
            fn(parseContext);
        }

        this.index();
        parseContext.targeList.forEach(item => {
            this[item.action].apply(this, item.args);
        });

        return this;
    }
}

// The map for translate the IDBKeyRange
const DBRangeMap = {
    single: {
        ">": function (_args) {
            return IDBKeyRange.lowerBound(_args[0], true);
        },
        ">=": function (_args) {
            return IDBKeyRange.lowerBound(_args[0]);
        },
        "<": function (_args) {
            return IDBKeyRange.upperBound(_args[0], true);
        },
        "<=": function (_args) {
            return IDBKeyRange.upperBound(_args[0]);
        },
        "=": function (_args) {
            return IDBKeyRange.only(_args[0]);
        }
    }, 
    and: {
        ">= <=": function (_args) {
            return IDBKeyRange.bound(_args[0], _args[1]);
        },
        "> <": function (_args) {
            return IDBKeyRange.bound(_args[0], _args[1], true, true);
        },
        ">= <": function (_args) {
            return IDBKeyRange.bound(_args[0], _args[1], false, true);
        },
        "> <=": function (_args) {
            return IDBKeyRange.bound(_args[0], _args[1], true, false);
        }
    }
} 

/**
 * The Class of the FelisDB for operating the indexedDB
 * @class
 */
class FelisDB {
    #openPromise;

    /**
     * Generating an instance of the IDBKeyRange
     * The best practice is invoking this method followed by a template literals.
     * @example
     * // The range >=1 and <10
     * FelisDB.range`>= ${1} and < ${10}`
     * @returns {IDBKeyRange}
     * @static
     */
    static range(_strList, ..._args) {
        if (_args.length === 1) {
            let fn = DBRangeMap.single[String(_strList[0]).trim()];
            return fn ? fn(_args) : undefined;
        } else if (_args.length > 1) {
            let op2 = String(_strList[1]).trim().toLowerCase();
            for (let key in DBRangeMap) {
                if (op2.startsWith(key)) {
                    let op = `${String(_strList[0]).trim()} ${op2.substring(key.length).trim()}`;
                    let fn = DBRangeMap[key][op];
                    return fn ? fn(_args) : undefined;
                }
            }
        }
    }

    /**
     * Create an instance of the FelisDB.
     * @param {String} _name The name of the DB. The DB will be opened if it is existed. Otherwise the DB with this name will be created.
     * @param {Object} _opt The option of the DB
     * @param {Number} _opt.version Optional. The version of the DB
     * @param {Object} _opt.stores Optional. The stores contained in the DB. Each key of the object is the name of the store. This argument is used only when the version of the DB is upgraded.
     * @param {null|String|Array<String>|Object} _opt.stores.xxx The configuration of the store named "xxx". The value with the typeof string or array means the key of the store. The value with the typeof object means the advance configuration of the store. The value taken as  null means the store with common key and the key is increased automatically.
     * @param {String|Array<string>} _opt.stores.xxx.keyPath The keys of the store named "xxx".
     * @param {Boolean} _opt.stores.xxx.autoIncrement Optional. Set true means the value of the key in the store named "xxx" will be increased automatically.
     * @param {Object} _opt.stores.xxx.indexs Optional. The indexs in the store named "xxx". Each key of the object is the name of the special index.
     * @param {Object} _opt.stores.xxx.indexs.yyy The configuration of the index named "yyy" in store named "xxx".
     * @param {String|Array} _opt.stores.xxx.indexs.yyy.keyPath The key for the index named "yyy" to use.
     * @param {Boolean} _opt.stores.xxx.indexs.yyy.unique If true, the index will not allow duplicate values for a single key.
     * @param {Boolean} _opt.stores.xxx.indexs.yyy.multiEntry If true, the index will add an entry in the index for each array element when the keyPath resolves to an array. If false, it will add one single entry containing the array.
     * @param {Array<String>} _opt.removeStores The names of the store which will be removed from the DB. This argument is used only when the version of the DB is upgraded.
     * @example
     * // Open/Create a database name "TestDB". It's version is 1. 
     * // The store named "Table1" will be removed. 
     * // The store named "Table2" with a common auto-increment key will be contained in the store.
     * // The store named "Table3" with keys ["id", "name"] will be contained in the store.
     * // The store named "Table4" with keys ["id", "name"] and with index use key "id" named "abc" will be contained in the store.
     * new FelisDB("TestDB", {
     *     version: 1,
     *     stores: {
     *         Table2: null,
     *         Table3: ["id", "name"],
     *         Table4: {
     *             keyPath: ["id", "name"],
     *             indexs: {
     *                 abc: {
     *                     keyPath: "id"
     *                 }
     *             }
     *         }
     *     },
     *     removeStores: ["Table1"]
     * });
     */
    constructor(_name, _opt) {
        _opt || (_opt = {});
        this.#openPromise = new Promise((_resolve, _reject) => {
            let dbRequest = indexedDB.open(_name, _opt.version);
            dbRequest.onupgradeneeded = (e) => {
                let db = e.target.result;
                let tx = e.target.transaction;
                (_opt.removeStores instanceof Array) && _opt.removeStores.forEach(item => db.objectStoreNames.contains(item) && db.deleteObjectStore(item));
                if (_opt.stores) {
                    for (let key in _opt.stores) {
                        let store;
                        let storeOpt = _opt.stores[key];
                        if (!db.objectStoreNames.contains(key)) {
                            store = db.createObjectStore(key, ((typeof storeOpt === "string" || (storeOpt instanceof Array)) ? { keyPath: storeOpt } : (storeOpt || { autoIncrement: true })));
                        } else {
                            store = tx.objectStore(key);
                        }
                        if (store) {
                            for (let oldIndex of store.indexNames) {
                                store.deleteIndex(oldIndex);
                            }
                            if (storeOpt && storeOpt.indexs) {
                                for (let indexName in storeOpt.indexs) {
                                    let indexOpt = storeOpt.indexs[indexName];
                                    if (!store.indexNames.contains(indexName) && indexOpt) {
                                        let keyPath = (typeof indexOpt === "string" || (indexOpt instanceof Array)) ? indexOpt : indexOpt.keyPath;
                                        if (keyPath) {
                                            (indexOpt !== keyPath) 
                                                ? store.createIndex(indexName, keyPath, indexOpt)
                                                : store.createIndex(indexName, keyPath);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                _resolve(db);
            };
            dbRequest.onsuccess = (e) => {
                _resolve(e.target.result);
            };
            dbRequest.onerror = (e) => {
                _reject(FelisDBError(1, e.target && e.target.error));
            };
            dbRequest.onblocked = (e) => {
                _reject(FelisDBError(1, e.target && e.target.error));
            }
        });
        
    }

    /**
     * Close the DB
     * @return {Promise} The promise for waiting the close action finished.
     */
    async close() {
        let db = await this.#openPromise;
        db.close();
    }

    /**
     * Get the instance of the IDBDatabase
     * @return {Promise<IDBDatabase>} The promise resolved by the db
     */
    getDB() {
        return this.#openPromise;
    }

    /**
     * Create an instance of StoreAccessor for accessing the content of the a special store
     * @param {String} _name The name of the store
     * @param {String} _mode The mode of the accessor. The value can be "rw" or "r". Any other value is treasted as "r".
     * @returns {StoreAccessor} The accessor
     */
    accessStore(_name, _mode) {
        return new StoreAccessor(this.#openPromise, _name, _mode);
    }

    /**
     * Get the version of the DB
     * @returns {Promise<Number>} The promise resolved by the version of the DB
     */
    async getVersion() {
        let db = await this.#openPromise;
        return db.version;
    }

    /**
     * Get the names of the stores in the DB
     * @returns {Promise<DOMStringList>} The promise resolved by the names of the stores
     */
    async getStores() {
        let db = await this.#openPromise;
        return db.objectStoreNames;
    }
}

export default FelisDB;