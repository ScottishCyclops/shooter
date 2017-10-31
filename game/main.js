let animated = null;
let animation = null;

function setup()
{
    canvas.setColor("#333");

    animted = new Entity(innerWidth / 2, innerHeight / 2);
    animation = new Anim("res/anims/test", 3, 250);
}

function loop(deltaTime)
{
    animation.update(animated, deltaTime);
}
