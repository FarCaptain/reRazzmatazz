var Bird = new Phaser.Class({
    Extends: Phaser.Physics.Arcade.Sprite,

    initialize:
    function Bird(scene)
    {
        // generated outside viewport
        Phaser.Physics.Arcade.Sprite.call(this, scene, 400, 400, 'bird');
        this.speed = 0;
        this.direction = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
    },
    
    fly: function ( startX, startY, destX, destY, speed )
    {
        this.speed = speed;
        this.setPosition(startX, startY); // Initial position
        this.direction = Math.atan( (destX-this.x) / (destY-this.y));

        // Calculate X and y velocity of bullet to moves it from shooter to target
        if (destY >= this.y)
        {
            this.xSpeed = this.speed*Math.sin(this.direction);
            this.ySpeed = this.speed*Math.cos(this.direction);
        }
        else
        {
            this.xSpeed = -this.speed*Math.sin(this.direction);
            this.ySpeed = -this.speed*Math.cos(this.direction);
        }
        if (destX > this.x)
            this.flipX = true;

        this.setVelocity(this.xSpeed, this.ySpeed);
        this.setAngle(this.direction / Math.PI * 180);
    },

    update: function (time, delta)
    {
        if ( this.x > 650 || this.x < -10 || this.y > 650 || this.y < -10 ) //?
            this.destroy();
    },
});