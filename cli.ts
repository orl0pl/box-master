// Box Master CLI
/* 
  ____                                   _            
 |  _ \                                 | |           
 | |_) | _____  __   _ __ ___   __ _ ___| |_ ___ _ __ 
 |  _ < / _ \ \/ /  | '_ ` _ \ / _` / __| __/ _ \ '__|
 | |_) | (_) >  <   | | | | | | (_| \__ \ ||  __/ |   
 |____/ \___/_/\_\  |_| |_| |_|\__,_|___/\__\___|_|   
                                                                                                            
*/
/* 

█▄▄ █▀█ ▀▄▀   █▀▄▀█ ▄▀█ █▀ ▀█▀ █▀▀ █▀█
█▄█ █▄█ █░█   █░▀░█ █▀█ ▄█ ░█░ ██▄ █▀▄ 
*/
const version = "0.1.0";
import readline from "readline";
import fs from "fs";
import { findBox, getBoxContents, getBoxParent, createBox, moveBox, deleteBox, Box } from "./core";
var boxesData: Box[] = JSON.parse(fs.readFileSync("db.json").toString());

// Convert the attributes of each box to an any type
const boxes = boxesData.map((box: Box) => {
    return {
        ...box,
        attributes: box.attributes,
    };
});

// Create a readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Print a welcome message
console.log("\x1b[36m%s\x1b[0m",`
█▄▄ █▀█ ▀▄▀   █▀▄▀█ ▄▀█ █▀ ▀█▀ █▀▀ █▀█
█▄█ █▄█ █░█   █░▀░█ █▀█ ▄█ ░█░ ██▄ █▀▄`);
console.log(`CLI Version: \x1b[33m${version}\x1b[0m`);
// Define the command prompt
const prompt = () => {
    rl.question("\n Enter a command \nlist, create, move, tree, delete, quit \n >  ", (answer) => {
        switch (answer) {
            case "list":
                listBoxes();
                break;
            case "create":
                createBoxPrompt();
                break;
            case "move":
                moveBoxPrompt();
                break;
            case "delete":
                deleteBoxPrompt();
                break;
            case "quit":
                console.log("Goodbye!");
                rl.close();
                break;
            case "tree":
                treeBoxes();
                break;
            default:
                console.log("Invalid command.");
                prompt();
        }
    });
};

// Define the function to list all boxes
const listBoxes = () => {
    console.log("All boxes:");
    boxes.forEach((box) => {
        console.log(`- ${box.attributes.name} (${box.id})`);
    });
    prompt();
};

// Define the function to prompt for creating a new box
const createBoxPrompt = () => {
    rl.question("Enter the attributes JSON of the new box: ", (json) => {
        const attributes = JSON.parse(json);
        rl.question("Enter the ID of the parent box, or leave blank to make it a root box: ", (parentStr) => {
            if (parentStr === "") {
                createBox(boxes, attributes);
                console.log(`Created box with attributes "${attributes}".`);
                prompt();
            } else {
                const parentId = parseInt(parentStr);
                const parentBox = findBox(boxes, parentId);
                if (!parentBox) {
                    console.log(`No box with ID ${parentId} found.`);
                    prompt();
                    return;
                }
                createBox(boxes, attributes, parentBox);
                console.log(`Created box with attributes "${attributes}".`);
                prompt();
            }
        })

    });
};

// Define the function to prompt for moving a box
const moveBoxPrompt = () => {
    rl.question("Enter the ID of the box to move: ", (idStr) => {
        const id = parseInt(idStr);
        const box = findBox(boxes, id);
        if (!box) {
            console.log(`No box with ID ${id} found.`);
            prompt();
            return;
        }
        rl.question("Enter the ID of the box to move it to, or leave blank to make it a root box: ", (parentStr) => {
            if (parentStr === "") {
                moveBox(boxes, box);
                console.log(`Moved box "${box.attributes.name}" to root.`);
            } else {
                const parentId = parseInt(parentStr);
                const parentBox = findBox(boxes, parentId);
                if (!parentBox) {
                    console.log(`No box with ID ${parentId} found.`);
                    prompt();
                    return;
                }
                moveBox(boxes, box, parentBox);
                console.log(`Moved box "${box.attributes.name}" to "${parentBox.attributes.name}".`);
            }
            prompt();
        });
    });
};

// Define the function to prompt for deleting a box
const deleteBoxPrompt = () => {
    rl.question("Enter the ID of the box to delete: ", (idStr) => {
        const id = parseInt(idStr);
        const box = findBox(boxes, id);
        if (!box) {
            console.log(`No box with ID ${id} found.`);
            prompt();
            return;
        }
        deleteBox(boxes, box);
        console.log(`Deleted box "${box.attributes.name}".`);
        prompt();
    });
};
/**
 * Prints a tree structure of all boxes starting from a given parent ID.
 * @param {number|null} id The ID of the parent box to start from, or `null` to print all top-level boxes.
 * @param {number} depth The depth of the current box in the tree structure.
 */
const treeBoxes = (id: number | null = null, depth = 0) => {
    const children = boxes.filter((box) => {
        return getBoxParent(boxes, box) === id;
    });

    children.forEach((child) => {
        console.log(`${"|  ".repeat(depth)}|-- ${child.attributes.name} (${child.id})`);
        treeBoxes(child.id, depth + 1);
    });
    prompt();
};

// Define the function to list all boxes

// Start the prompt
prompt();
