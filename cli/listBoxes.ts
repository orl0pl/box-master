import { Box } from "../core";
export default function listBoxes(boxes: Box[]){
    console.log("All boxes:");
    boxes.forEach((box) => {
        console.log(`- ${box.attributes.name|| box.attributes} (${(box.id)})`);
    });
    prompt();
};