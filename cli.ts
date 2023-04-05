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
var boxesData: Box[] = JSON.parse(fs.readFileSync("db.json").toString()).boxes;
var globalIdCounter = JSON.parse(fs.readFileSync("db.json").toString()).globalIdCounter - 1;
function saveBoxData() {
    fs.writeFileSync("db.json", JSON.stringify({
        boxes: boxes,
        globalIdCounter: globalIdCounter
    }, null, 2));
}
// Convert the attributes of each box to an any type
const boxes = boxesData;

// Create a readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Print a welcome message
console.log("\x1b[36m%s\x1b[0m", `
█▄▄ █▀█ ▀▄▀   █▀▄▀█ ▄▀█ █▀ ▀█▀ █▀▀ █▀█
█▄█ █▄█ █░█   █░▀░█ █▀█ ▄█ ░█░ ██▄ █▀▄`);
console.log(`CLI Version: \x1b[33m${version}\x1b[0m`);
console.log('\n Enter a command \nlist, tree, create, move, delete, quit ')
// log text in gray color
// Define the command prompt

const prompt = () => {
    rl.question("\n \x1b[90m>\x1b[0m ", (answer) => {
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
                treeBoxes(null);
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
        console.log(`- ${box.attributes.name || box.attributes} (${(box.id)})`);
    });
    prompt();
};

// Define the function to prompt for creating a new box
const createBoxPrompt = () => {
    rl.question("Enter the attributes JSON of the new box: ", (json) => {
        const attributes = JSON.parse(json);
        rl.question("Enter the ID of the parent box, or leave blank to make it a root box: ", (parentStr) => {
            if (parentStr === "") {
                createBox(boxes,globalIdCounter, attributes);
                globalIdCounter++;
                console.log(`Created box with attributes "${attributes}".`);
                saveBoxData();
                prompt();
            } else {
                const parentId = parseInt(parentStr);
                const parentBox = findBox(boxes, parentId);
                if (!parentBox) {
                    console.log(`No box with ID ${parentId} found.`);
                    prompt();
                    return;
                }
                createBox(boxes,globalIdCounter, attributes, parentBox);
                globalIdCounter++;
                console.log(`Created box with attributes "${attributes}".`);
                saveBoxData();
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
                saveBoxData();
                console.log(`Moved box "${box.attributes.name}" to root.`);
            } else {
                const parentId = parseInt(parentStr);
                const parentBox = findBox(boxes, parentId);
                if (!parentBox) {
                    console.log(`No box with ID ${parentId} found.`);
                    prompt();
                    return;
                }
                saveBoxData();
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
        saveBoxData();
        prompt();
    });
};
/**
 * 
 * @param num The ID for converting
 * @returns {string} string representation of the ID
 */
function numToString(num: number): string {
  const charSet = "ABCDEFGHJKLMNOPQRSTUVWXYZ";
  let result = "";
  while (num > 0) {
    const remainder = (num - 1) % 25;
    result = charSet[remainder] + result;
    num = Math.floor((num - remainder) / 25);
  }
  return result;
}
function stringToNum(str: string): number {
  const charSet = "ABCDEFGHJKLMNOPQRSTUVWXYZ";
  let result = 0;
  for (let i = 0; i < str.length; i++) {
    const charIndex = charSet.indexOf(str[i]);
    result = result * 25 + (charIndex + 1);
  }
  return result;
}

/**
 * Prints a tree structure of all boxes starting from a given parent ID.
 * @param {number|null} id The ID of the parent box to start from, or `null` to print all top-level boxes.
 * @param {number} depth The depth of the current box in the tree structure.
 */
const treeBoxes = (id: number | null = null, depth = 0) => {
    const treeBoxes2 = (id: number | null = null, depth = 0) => {
        const parentBoxes = id === null ? boxes.filter((box) => !box.relationships?.inside) : boxes.filter((box) => box.id === id);
        for (const box of parentBoxes) {
            console.log(`${"  ".repeat(depth)}\x1b[90m|--\x1b[0m ${box.attributes.name} (${box.id})`);
            const childBoxes = boxes.filter((child) => child.relationships?.inside === box.id);
            for (const child of childBoxes) {
                treeBoxes2(child.id, depth + 1);
            }
        }
    
    };
    const parentBoxes = id === null ? boxes.filter((box) => !box.relationships?.inside) : boxes.filter((box) => box.id === id);
    for (const box of parentBoxes) {
        console.log(`${"  ".repeat(depth)}\x1b[90m|--\x1b[0m ${box.attributes.name} (${box.id})`);
        const childBoxes = boxes.filter((child) => child.relationships?.inside === box.id);
        for (const child of childBoxes) {
            treeBoxes2(child.id, depth + 1);
        }
    }
    prompt();
};



// Start the prompt
prompt();
