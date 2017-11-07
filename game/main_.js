/// <reference path="../typings/pixi.js.d.ts" />

const scale = 4;
const toLoad =
[
    {name: "walk0", url:"res/anims/spaceguy/walk/0.png"},
    {name: "walk1", url: "res/anims/spaceguy/walk/1.png"}
];

let e = null;
let world = null;

function setup()
{
    // make all pixel art sharp
    for(const img in res)
    {
        res[img].texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    }

    world = new Container;


    e = new Entity(100, 0, res["walk0"], {scale: scale, register: true});

    e.addActions(new Action("walk", 2, {delay: 250, iterations: -1}));

    e.playAction("walk");

    world.appendChild(e);
}

function loop()
{
    //
}
