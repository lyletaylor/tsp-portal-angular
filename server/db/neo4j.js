const request = require('request');
const neo4j = require('neo4j');

const nodePropRenames = {
    "_id": "id"
};

const relRenameProps = {
    "_id": "id",
    "_fromId": "source",
    "_toId": "dest"
};

class neo4jWrapper {
    constructor(host, port, username, password) {
        this.db = new neo4j.GraphDatabase(`http://${username}:${password}@${host}:${port}`);

        this.host = host;
        this.port = port;
        this.username = username;
        this.password = password;
    }

    // constructor(baseUrl, username, password) {
    //     if (baseUrl[baseUrl.length - 1] !== '/') {
    //         baseUrl += '/';
    //     }

    //     this.baseUrl = baseUrl;
    //     this.username = username;
    //     this.password = password;
    // }

    createItem(type, item, cb) {
        this.db.cypher({
                query: `CREATE (n:${type} {props}) RETURN id(n)`,
                params: {
                    props: item.properties
                }
            },
            (err, res) => {
                let result = {};
                if (err) {
                    result.status = "error";
                    result.err = err;
                } else {
                    result.status = "success";
                    result.itemId = res[0]['id(n)'];
                }
                cb(result);
            });
    }

    // TODO: Add support for mapping the properties
    createRelationship(type, sourceID, destID, props, cb) {
        this.db.cypher({
                query: `MATCH (a), (b) WHERE ${this._buildWhereExpression('a', sourceID)} AND ${this._buildWhereExpression('b', destID)} ` +
                    `MERGE (a)-[r:${type}]->(b) RETURN r`,
                params: {
                    props: props
                }
            },
            (err, res) => {
                let result = {};
                if (err) {
                    result.status = "error";
                    result.err = err;
                } else {
                    if (res.length > 0) {
                        result.status = "success";
                        result.relation = this._renameProps(res[0].r, relRenameProps);
                    } else {
                        result.status = "error";
                        result.status_code = 404;
                        result.message = "The source or destination node could not be found. Relationship not created."
                    }
                }
                cb(result);
            });
    }

    deleteItemById(id, cb) {
        this.deleteItemByLabelAndId(null, id, cb);
    }

    deleteItemByLabelAndId(label, id, cb) {
        console.log("Query: " + `MATCH (n${(label ? ':' + label : '')}) WHERE ${this._buildWhereExpression('n', id)} DELETE n`);
        this.db.cypher({
                query: `MATCH (n${(label ? ':' + label : '')}) WHERE ${this._buildWhereExpression('n', id)} DELETE n`
            },
            (err, res) => {
                let result = {};
                if (err) {
                    result.status = "error";
                    result.err = err;
                } else {
                    result.status = "success";
                    result.itemId = res;
                }
                cb(result);
            });
    }

    deleteRelationship(type, sourceID, destID, cb) {
        this.db.cypher({
                query: `MATCH (a)-[r:${type}]->(b) ` +
                    `WHERE ${this._buildWhereExpression('a', sourceID)} AND ${this._buildWhereExpression('b', destID)} ` +
                    `DELETE r`
            },
            (err, res) => {
                let result = {};
                if (err) {
                    result.status = "error";
                    result.err = err;
                } else {
                    result.status = "success";
                }
                cb(result);
            });
    }

    getItemById(id, cb) {
        this.getItemByLabelAndId(null, id, cb);
    }

    // Equivalent to getItemById, but will fail if the item does not have the supplied label
    getItemByLabelAndId(label, id, cb) {
        this.db.cypher({
                query: `MATCH (n${(label ? ':' + label : '')}) WHERE ${this._buildWhereExpression('n', id)} RETURN n`
            },
            (err, res) => {
                this._nodeQueryHandler(err, res, function(result) {
                    if (label && result.status_code === 404) {
                        result.message = `A ${label} with id ${id} was not found`;
                    }
                    cb(result);
                });
            });
    }

    // TODO: Need to add support for query filters
    getItemsByLabel(label, cb) {
        this.db.cypher({
                query: `MATCH (n:${label}) RETURN n`
            },
            (err, res) => {
                let result = {};
                if (err) {
                    result.status = "error";
                    result.err = err;
                } else if (!res[0]) {
                    result.status = "error";
                    result.status_code = 404;
                    result.message = `No matching ${label}s were found.`;
                } else {
                    let items = res.map(item => {
                        return this._renameProps(item.n, nodePropRenames);
                    });

                    result.status = "success";
                    result.items = items;
                }
                cb(result);
            });
    }

    updateItemById(id, item, cb) {
        this.updateItemByLabelAndId(null, id, item, cb);
    }

    updateItemByLabelAndId(label, id, item, options, cb) {
        let updates = [];
        if (item.labels && item.labels.length && !options.removeLabels) {
            updates.push(`n :${item.labels.join(':')}`);
        }
        if (item.properties) {
            if (options.matchProperties) {
                updates.push('n = $props');
            } else {
                let sets = [];
                for (let prop in item.properties) {
                    if (item.properties[prop]) {
                        sets.push(`n.${prop} = '${item.properties[prop]}'`)
                    } else {
                        sets.push(`n.${prop} = NULL`)
                    }
                }
                updates.push(sets.join(', '));
            }
        }

        var removeLabels = "";
        if (options.removeLabels) {
            removeLabels = `REMOVE n:${item.labels.join(':')}`;
        }

        this.db.cypher({
                query: `MATCH (n${(label ? ':' + label : '')}) WHERE ${this._buildWhereExpression('n', id)} SET ${updates.join(', ')} ${removeLabels} RETURN n`,
                params: {
                    props: item.properties
                }
            },
            (err, res) => {
                this._nodeQueryHandler(err, res, function(result) {
                    if (label && result.status_code === 404) {
                        result.message = `A ${label} with id ${id} was not found`;
                    }
                    cb(result);
                });
            });
    }

    _buildWhereExpression(nodeName, id) {
        if (/[^0-9]/.test(id)) {
            return `${nodeName}.uuid = '${id}'`;
        } else {
            return `id(${nodeName}) = ${id}`;
        }
    }

    // Used for all cases where a single node is being returned from the query
    _nodeQueryHandler(err, res, cb) {
        let result = {};
        if (err) {
            result.status = "error";
            result.err = err;
        } else if (!res[0]) {
            result.status = "error";
            result.status_code = 404;
            result.message = "Item not found";
        } else {
            result.status = "success";
            result.item = this._renameProps(res[0].n, nodePropRenames);
        }
        cb(result);
    }

    // takes the obj and replaces the properties named in the props object and renames them to
    // the names given in the props object. The props object looks like this:
    //{
    //    "oldName": "newName"
    //}
    _renameProps(obj, props) {
        // console.log('Enter _renameProps');
        // console.log(JSON.stringify(obj));
        // console.log(props)
        for (let prop in props) {
            if (prop.indexOf('.') >= 0) {
                var split = prop.split('.');
                var newProps = {};
                newProps[split.slice(1).join('.')] = props[prop];
                this._renameProps(obj[split[0]], newProps);
            } else {
                // console.log(obj);
                if (typeof obj[prop] != undefined) {
                    // console.log(prop + ":" + props[prop]);
                    obj[props[prop]] = obj[prop];
                    delete obj[prop];
                }
                // console.log(obj);
            }
        }
        // console.log("Exit _renameProps");
        return obj;
    }

    // createItem(type, item, cb) {
    //     var statement = {
    //         statements: [{
    //             statement: `CREATE (n:${type} {props}) RETURN id(n)`,
    //             parameters: {
    //                 props: item
    //             }
    //         }]
    //     };

    //     request.post(
    //             this.baseUrl + "db/data/transaction/commit", { json: statement },
    //             (err, res, body) => {
    //                 var result = {};

    //                 if (!err) {
    //                     if (res.statusCode >= 200 && res.statusCode < 300) {
    //                         result.status = "success";
    //                         result.itemId = body.results[0].data[0].row[0];
    //                     } else {
    //                         result.status = "error";
    //                         result.status_code = res.statusCode;
    //                         result.body = res.body;
    //                     }
    //                 } else {
    //                     result.status = "error";
    //                     result.status_code = res.statusCode;
    //                     result.err = err;
    //                 }
    //                 cb(result);
    //             })
    //         .auth(this.username, this.password);
    // }

    // getItemById(id, cb) {
    //     var statement = {
    //         statements: [{
    //             statement: `MATCH (n) WHERE id(n) = ${id} RETURN n`,
    //         }]
    //     };

    //     request.post(
    //             this.baseUrl + "db/data/transaction/commit", { json: statement },
    //             (err, res, body) => {
    //                 var result = {};

    //                 console.log(res);
    //                 if (!res) {
    //                     cb({ status: "error", message: "no result" });
    //                 }
    //                 if (!err) {
    //                     if (res.statusCode >= 200 && res.statusCode < 300) {
    //                         if (body.results[0].data.length > 0) {
    //                             let item = body.results[0].data[0].row[0];
    //                             item.id = body.results[0].data[0].meta[0].id;
    //                             result.status = "success";
    //                             result.item = item;
    //                         } else {
    //                             result.status = "error";
    //                             result.status_code = 404;
    //                             result.message = "Item not found";
    //                         }
    //                     } else {
    //                         result.status = "error";
    //                         result.status_code = res.statusCode;
    //                         result.body = res.body;
    //                     }
    //                 } else {
    //                     result.status = "error";
    //                     result.status_code = res.statusCode;
    //                     result.err = err;
    //                 }
    //                 cb(result);
    //             })
    //         .auth(this.username, this.password);
    // }

};

module.exports = neo4jWrapper;