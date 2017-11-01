let animated = null;

function setup()
{
    canvas.setColor("#333");

    animated = new Entity(innerWidth / 2, innerHeight / 2, {register: true});
    canvas.appendChild(animated);

    animated.addAnimations(
        new Animation("res/anims/test", 4, {delay: 100, iterations: -1, alternate: true}),
        new Animation("res/anims/test2", 4, {delay: 150, iterations: 6, reverse: true})
    );

    animated.playAnimation("test2", {delay: 1000}).queueAnimation("test");
}

function loop(deltaTime)
{
}
