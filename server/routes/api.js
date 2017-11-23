const express = require('express');
const cors = require('cors');
const router = express.Router();
const neo4j = require('../db/neo4j');
const uuidv4 = require('uuid/v4');

var db = new neo4j("localhost", 7474, "neo4j", "tasktracker");

/* GET api listing. */
router.get('/', (req, res) => {
    res.send('api works');
});

// uiid
// Get one or more uuids
// GET /api/uuid[?count=n]
router.get('/uuid', cors(), (req, res) => {
    let count = req.query.count && parseInt(req.query.count) ? parseInt(req.query.count) : 1;
    var uuids = [];

    for (let i = 0; i < count; ++i) {
        uuids.push(uuidv4());
    }
    res.send({ data: uuids });
});

// neo4j functions
router.delete('/items/:type/:id', cors(), (req, res) => {
    db.deleteItemByLabelAndId(req.params.type, req.params.id, (result) => {
        if (result.status === "success") {
            res.send({ status: "success" });
        } else {
            res.status(result.status_code || 500);
            res.send(result);
        }
    });
});

router.delete('/relations/:type/:source/:dest', cors(), (req, res) => {
    db.deleteRelationship(req.params.type, req.params.source, req.params.dest, (result) => {
        if (result.status === "success") {
            res.send(result);
        } else {
            res.status(result.status_code || 500);
            res.send(result);
        }
    });
});

// Get an list of items
router.get('/items/:type', cors(), (req, res) => {
    db.getItemsByLabel(req.params.type, (result) => {
        if (result.status === "success") {
            res.send({ status: "success", items: result.items });
        } else {
            res.status(result.status_code || 500);
            res.send(result);
        }
    });
});


// Get an item
// :type is actually irrelevant in this case, since id is globally unique. But it keeps the URL consistent
router.get('/items/:type/:id', cors(), (req, res) => {
    db.getItemByLabelAndId(req.params.type, req.params.id, (result) => {
        if (result.status === "success") {
            res.send({ status: "success", item: result.item });
        } else {
            res.status(result.status_code || 500);
            res.send(result);
        }
    });
});

// Create an item
// Need to think about whether I want to just allow any type to be created or only support a fixed and validated list
router.post('/items/:type', cors(), (req, res) => {
    db.createItem(req.params.type, req.body, (result) => {
        if (result.status === "success") {
            res.send({ status: "success", id: result.itemId });
        } else {
            res.status(result.status_code || 500);
            res.send(result);
        }
    });
});

// Create a relationship
// Need to think about whether I want to just allow any type to be created or only support a fixed and validated list
router.post('/relations/:type/:source/:dest', cors(), (req, res) => {
    db.createRelationship(req.params.type, req.params.source, req.params.dest, req.body, (result) => {
        if (result.status === "success") {
            res.send(result);
        } else {
            res.status(result.status_code || 500);
            res.send(result);
        }
    });
});

// update an item
// :type is actually irrelevant in this case, since id is globally unique. But it keeps the URL consistent
// Supported URL query paraments
//      removeLabels - If true, it will remove any labels specified in the object's labels property
//      matchProperties - If true, it will make the node's properties exactly match those
//          specified in the object's properties property. Otherwise, it will only try to update
//          the properties present in the object
router.put('/items/:type/:taskId', cors(), (req, res) => {
    let options = {};
    if (req.query.removeLabels === 'true') {
        options.removeLabels = true;
    }
    if (req.query.matchProperties === 'true') {
        options.matchProperties = true;
    }

    db.updateItemByLabelAndId(req.params.type, req.params.taskId, req.body, options, (result) => {
        if (result.status === "success") {
            res.send({ status: "success", item: result.item });
        } else {
            res.status(result.status_code || 500);
            res.send(result);
        }
    });
});

module.exports = router;