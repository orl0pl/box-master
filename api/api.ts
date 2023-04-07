import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import fs from "fs";
import { findBox, getBoxContents, getBoxParent, createBox, moveBox, deleteBox, Box, filterBoxes, editBox } from "../core";
var boxes: Box[] = JSON.parse(fs.readFileSync("db.json").toString()).boxes;
var globalIdCounter = JSON.parse(fs.readFileSync("db.json").toString()).globalIdCounter;
if (globalIdCounter == 0) {
    globalIdCounter = -1;
}
interface PostOptions {
    action: "create" | "move" | "delete" | "edit";
    data: PostOptionsData;
}

type PostOptionsData = | {
    targetId: number | 'root'; // Only used when action is "move"
} & ({ attributes?: never }) // Only used when action is not "add"
    | {
        attributes: object; // Only used when action is "add"
    } & ({ targetId?: never }) // Only used when action is not "move"  
function saveBoxData() {
    fs.writeFileSync("db.json", JSON.stringify({
        boxes: boxes,
        globalIdCounter: globalIdCounter
    }, null, 2));
}
const app: Express = express();
app.use(bodyParser.json());
const port = 939;
//GET routes
app.get('/boxes', (req: Request, res: Response) => {
    if (req.query.filter) {
        res.send(boxes.filter(
            eval(req.query.filter.toString())
        ));
    }
    else {
        res.send(boxes);
    }

});
app.get('/boxes/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const box = findBox(boxes, id);
    if (box) {
        res.send(box);
    }
    else {
        res.sendStatus(404);
    }
})

//POST routes
app.post('/boxes/:id', (req: Request, res: Response) => {
    const options: PostOptions = req.body;
    console.log(options);
    if (options.action == "create") {
        const attributes = options.data.attributes;
        if (attributes) {
            const parentId = parseInt(req.params.id);
            const parentBox = findBox(boxes, parentId);
            if (parentBox) {
                createBox(boxes, globalIdCounter, attributes, parentBox);
                globalIdCounter = globalIdCounter + 1;
                saveBoxData();
                res.status(201).send("Successfully created box.");
            }
            else {
                res.status(404).send("Parent box not found.");
            }
        }
        else {
            res.status(400).send("Missing attributes object in data.");
        }
    }
    else if (options.action == "move") {
        if (options.data.targetId == 'root') {
            const box = findBox(boxes, parseInt(req.params.id));
            if (box) {
                moveBox(boxes, box);
                saveBoxData();
                res.status(200).send("Successfully moved box.");
            }
            else {
                res.status(404).send("Box not found.");
            }
        }
        else {
            const box = findBox(boxes, parseInt(req.params.id));
            const parentId = options.data.targetId;
            if (box && parentId) {
                const parentBox = findBox(boxes, parentId);
                if (parentBox) {
                    moveBox(boxes, box, parentBox);
                    saveBoxData();
                    res.status(200).send("Successfully moved box.");
                }
                else {
                    res.status(404).send("Parent box not found.");
                }
            }
            else {
                res.status(404).send("Box not found.");
            }
        }

    }
    else if (options.action == "delete") {
        const box = findBox(boxes, parseInt(req.params.id));
        if (box) {
            deleteBox(boxes, box);
            saveBoxData();
            res.status(200).send("Successfully deleted box.");
        }
        else {
            res.status(404).send("Box not found.");
        }
    }
    else if (options.action == "edit") {
        const box = findBox(boxes, parseInt(req.params.id));
        if (box) {
            if (options.data.attributes) {
                editBox(boxes, box, options.data.attributes);
                saveBoxData();
                res.status(200).send("Successfully edited box.");
            }
            else {
                res.status(400).send("Missing attributes object in data.");
            }
        }
        else {
            res.status(404).send("Box not found.");
        }
    }
    else {
        res.sendStatus(400);
    }

})
app.post('/boxes', (req: Request, res: Response) => {
    const options: PostOptions = req.body;
    console.log(options);
    if (options.action == "create" && options.data) {
        const attributes = options.data.attributes;
        if (attributes) {
            createBox(boxes, globalIdCounter, attributes);
            globalIdCounter = globalIdCounter + 1;
            saveBoxData();
            res.status(201).send("Successfully created box.");
        }
        else {
            res.status(400).send("Missing attributes object in data.");
        }
    }
    else {
        res.sendStatus(400);
    }
})
app.listen(port, () => {
    console.log(`📦 Box master server is running at: http://localhost:${port}`);
});