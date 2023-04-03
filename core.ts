interface Box {
    id: number;
    attributes: {
        [key: string]: any;
    };
    relationships: {
        inside?: number;
    };
}

/**
 * Finds a box with a given ID.
 *
 * @param {Box[]} boxes - An array of boxes to search.
 * @param {number} id - The ID of the box to find.
 * @returns {Box|undefined} The box with the specified ID, or undefined if it is not found.
 */
function findBox(boxes: Box[], id: number): Box | undefined {
    return boxes.find((box) => box.id === id);
}
/**
 * Gets the contents of a given box.
 *
 * @param {Box[]} boxes - An array of boxes to search.
 * @param {Box} box - The box whose contents to get.
 * @returns {Box[]} An array of boxes that are inside the specified box.
 */
function getBoxContents(boxes: Box[], box: Box): Box[] {
    return boxes.filter((otherBox) => otherBox.relationships.inside === box.id);
}

/**
 * Gets the parent box of a given box.
 * @param {Box[]} boxes The list of all boxes.
 * @param {Box} box The box to find the parent of.
 * @returns {Box|null} The parent box of the given box, or `null` if no parent box is found.
 */
const getBoxParent = (boxes: Box[], box: Box): Box|null => {
    return boxes.find((b) => b.id === box.relationships?.inside) || null;
  };
  

/**
 * Creates a new box with a given name and parent box.
 *
 * @param {Box[]} boxes - An array of boxes to add the new box to.
 * @param {object} attributes - The name of the new box.
 * @param {Box} [parentBox] - The box that will contain the new box, if any.
 * @returns {Box} The new box that was created.
 */
function createBox(boxes: Box[], attributes = {}, parentBox?: Box): Box {
    const newBox: Box = {
        id: boxes.length,
        attributes: attributes,
        relationships: {},
    };
    if (parentBox !== undefined) {
        newBox.relationships.inside = parentBox.id;
    }
    boxes.push(newBox);
    return newBox;
}

/**
 * Moves a box to a new parent box.
 *
 * @param {Box[]} boxes - An array of boxes to modify.
 * @param {Box} box - The box to move.
 * @param {Box} [newParentBox] - The box that will contain the moved box, or undefined to make it a root box.
 */
function moveBox(boxes: Box[], box: Box, newParentBox?: Box): void {
    if (newParentBox !== undefined) {
        box.relationships.inside = newParentBox.id;
    } else {
        delete box.relationships.inside;
    }
}

/**
 * Deletes a box and all of its contents.
 *
 * @param {Box[]} boxes - An array of boxes to modify.
 * @param {Box} box - The box to delete.
 */
function deleteBox(boxes: Box[], box: Box): void {
    const contents = getBoxContents(boxes, box);
    contents.forEach((content) => deleteBox(boxes, content));
    const index = boxes.indexOf(box);
    boxes.splice(index, 1);
}

// Some tests
/*const boxes: Box[] = [
    {
        id: 0,
        attributes: {
            name: "Mega secret box",
        },
        relationships: {},
    },
    {
        id: 1,
        attributes: {
            name: "Secret box",
        },
        relationships: {
            inside: 0,
        },
    },
    {
        id: 2,
        attributes: {
            name: "My best",
        },
        relationships: {},
    },
    {
        id: 3,
        attributes: {
            name: "Small box",
        },
        relationships: {
            inside: 2,
        },
    },
];
console.log(JSON.stringify(boxes));
const secretBox = findBox(boxes, 1);
const smallBox = findBox(boxes, 3);
const newBox = createBox(boxes, "New box", secretBox);

if (secretBox && smallBox) {
    moveBox(boxes, smallBox, newBox);
}
console.log(boxes);
*/

export {
    findBox,
    getBoxContents,
    getBoxParent,
    createBox,
    moveBox,
    deleteBox,
    Box,

}