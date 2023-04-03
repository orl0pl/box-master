// Import necessary modules
import * as readline from 'readline';
import * as core from './core';
import * as boxes from './db.json';

// Create a readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Display a prompt and read a line of input from the user
function prompt(question: string): Promise<string> {
  return new Promise(resolve => {
    rl.question(question, resolve);
  });
}

// Define the main function of the CLI
async function main() {
  // Display a welcome message and the list of boxes
  console.log("Welcome to the Box Manager!");
  console.log("Here are the boxes:");
  console.log(core.boxTreeString(boxes));

  // Loop to read and process user commands
  while (true) {
    // Display a prompt for the user to enter a command
    const command = await prompt("\nEnter a command (list, add, move): ");

    // Process the user's command
    switch (command.toLowerCase()) {
      case "list":
        // Display the list of boxes
        console.log(core.boxTreeString(boxes));
        break;

      case "add":
        // Prompt the user for the name of the new box and its parent ID
        const name = await prompt("Enter the name of the new box: ");
        const parentID = parseInt(await prompt("Enter the ID of the parent box: "));

        // Call the createBox function to create the new box
        const newBox = core.createBox(boxes, name, parentID);

        // Display the new box and the updated list of boxes
        console.log(`Created box with ID ${newBox.id}: ${newBox.attributes.name}`);
        console.log(core.boxTreeString(boxes));
        break;

      case "move":
        // Prompt the user for the ID of the box to move and its new parent ID
        const boxID = parseInt(await prompt("Enter the ID of the box to move: "));
        const newParentID = parseInt(await prompt("Enter the ID of the new parent box: "));

        // Call the moveBox function to move the box to its new parent
        core.moveBox(boxes, boxID, newParentID);

        // Display the updated list of boxes
        console.log(core.boxTreeString(boxes));
        break;

      default:
        // Display an error message for unknown commands
        console.log(`Unknown command: ${command}`);
        break;
    }
  }
}

// Call the main function to start the CLI
main();
