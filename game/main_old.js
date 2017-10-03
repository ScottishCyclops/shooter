let canvas = undefined;
let pawn = undefined;
let box2 = undefined;
let ground = undefined;

function setup()
{
    canvas = new Canvas(800, 600);
    canvas.fill("#ccc");

    pawn = new Pawn(0, canvas.getDimensions().y -100, meter);
    pawn.fill("#333");
    canvas.appendChild(pawn);

    ground = new Entity(0, canvas.getDimensions().y - 5, canvas.getDimensions().x, 30);
    ground.fill("green");
    ground.setCollide(true);
    canvas.appendChild(ground);

    box2 = new Entity(100, 100, 100, 30);
    box2.fill("blue");
    box2.setCollide(true);
    canvas.appendChild(box2);

    //addInputEvent("escape", true, false, () => { console.log("YOLO"); });

    //setFrameRate(120);
}

function loop(delta)
{
    //
}

function mouseDownEvent(e)
{
    //console.log(e);
}

function keyDownEvent(e)
{
    //console.log(e);
}