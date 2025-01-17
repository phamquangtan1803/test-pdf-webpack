import { addOpacity, addOverlayColor, addRotate, addOverlayColorStarRating, addOverlayColorImage } from "./addPropsToDoc.js";
import { createShadow, createFiller, createStroke, createFillerStarRating, createStrokeStarRating, calculateAngleFromTan, createFillerImage, createStrokeImage } from "./helper.js";
export const drawShapes = async (item, doc) => {
        switch (item.elementType) {
            case "graphicShape": {
                await drawShape(item, doc, item.name);
                break;
            }
            case "image": {
                await drawShape(item, doc, "Rectangle");
                break;
            }
            case "line": {
                drawLine(item, doc);
                break;
            }
            case "line_outline": {
                drawLine(item, doc);
                break;
            } 
            case "star_rating": {
                drawComponent(item, doc);
                break;
            }
            default: 
                console.log("Unsupported shape type:", item.elementType);
                break;
        }
}

async function drawShape(item, doc, shape) {
    doc.save();

    await createShadow(item, doc, shape);
    addRotate(item.x, item.y , doc, item.rotation);
    addOpacity(item, doc);
    await createFiller(item, doc, shape);
    
    createStroke(item, doc, shape);
    addOverlayColor(item, doc, shape);
    doc.restore();
}

async function drawCustom(item, doc, shape) {
    doc.save();

    await createShadow(item, doc, shape);
    addRotate(item.x, item.y , doc, item.rotation);
    
    addOpacity(item, doc);
    await createFiller(item, doc, shape);
    createStroke(item, doc, shape);
    addOverlayColor(item, doc, shape);
    
    doc.restore();
}

// async function drawImage(item, doc) {
//     doc.save();

//     await createShadow(item, doc, "Rectangle")

//     addOpacity(item, doc);
//     addRotate(item.x, item.y, doc, item.rotation);

//     await createFillerImage(item, doc);
//     addOverlayColorImage(item, doc);
//     createStrokeImage(item, doc);
// }

function drawLine(item, doc) {
    doc.save();

    addOpacity(item, doc);
    const angle = calculateAngleFromTan(item.points[2], item.points[3])
    addRotate(item.x, item.y + item.height/2, doc, angle);
  
    //draw original line
    doc.moveTo(item.x, item.y + item.height/2).lineTo(item.x + item.width, item.y + item.height/2);
    doc.lineWidth(item.height)
    if (item.dash.length !== 0) doc.dash(item.dash);
    doc.stroke(item.stroke);

    //draw overlay line
    doc.moveTo(item.x, item.y + item.height/2).lineTo(item.x + item.width, item.y + item.height/2);
    doc.lineWidth(item.height)
    if (item.dash.length !== 0) doc.dash(item.dash);
    doc.strokeOpacity(item.alpha);
    doc.stroke(item.overlayFill);

    //create svg of line's shadow
    const path = "M " + item.x 

    doc.restore();
}

function drawComponent(item, doc) {
    doc.save();

    addOpacity(item, doc);
    addRotate(item.x, item.y, doc, item.rotation);

    createFillerStarRating(item, doc, item.elementType);
    addOverlayColorStarRating(item, doc, item.elementType);
    createStrokeStarRating(item, doc, item.elementType);
    
    doc.restore();
}