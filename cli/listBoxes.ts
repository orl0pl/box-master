import { Box } from "../core";
export default function listBoxes(boxes: Box[]){
    console.log("\x1b[90m-\x1b[0m");
    boxes.forEach((box) => {
        console.log(`\x1b[90m-\x1b[0m ${box.attributes.name|| box.attributes} (${(box.id)})`);
    });
    
};