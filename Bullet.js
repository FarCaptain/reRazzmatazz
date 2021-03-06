var Bullet = new Phaser.Class({
	Extends: Phaser.GameObjects.Image,

	initialize:
    function Bullet (scene)
    {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');

        this.speed = 1.2;
        this.direction = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.setSize(5, 5, true);
        this.solidX = 0;
        this.scaleX = 0.7;
        this.scaleY = 0.7;
    },

    fire: function (x, y)
    {
        this.setPosition(x, y - 50);
        // tilting happens after collision
        // force the bullet to stay on the vertical trace
        this.solidX = x;

        this.setActive(true);
        this.setVisible(true);
    },

    update: function (time, delta)
    {
        this.x = this.solidX;
        this.y -= this.speed * delta;
        // testText.setText('pos : ' + this.x + " " + this.y );

        if (this.y < -50)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }
})