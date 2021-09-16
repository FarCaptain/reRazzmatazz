var MainScene = new Phaser.Class({
	Extends: Phaser.Scene,

    init: function()
    {
        this.xMin = 200;
        this.xMax = 600;
        this.yMin = 100;
        this.yMax = 500;
    },

	preload: function()
	{
        this.load.image('sky', 'assets/sky.png');
        this.load.image('iceberg', 'assets/iceberg.png');
        this.load.image('present', 'assets/present.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bullet', 'assets/bullet.png');
        this.load.image('gun', 'assets/gun.png');
        this.load.image('bear', 'assets/santa_drone.png');
	},

	create:function()
	{
        this.hitCount = 0;
		this.lastFired = 0;
        this.initialBearSpeed = 50;
        this.bearSpeed = this.initialBearSpeed;
		this.bearStat = 'right';

		this.add.image(400, 300, 'sky');
        
        this.gun = this.physics.add.sprite(100, 560, 'gun');
        this.gun.setCollideWorldBounds(true);

        // this.physics.world.setBounds(0, 0, 800, 550);
        this.bear = this.physics.add.sprite(320, 160, 'bear');
        this.bear.setCollideWorldBounds(true);

        //used to test stuff
        // this.testText = this.add.text(16, 16, 'stat: right', { fontSize: '32px', fill: '#000' });


        this.bullets = this.physics.add.group({
            classType: Bullet,
            maxSize: 3,
            runChildUpdate: true
        });

        this.bear.setVelocityX(this.bearSpeed);
        this.bear.onOverlap = true;

        this.cursors = this.input.keyboard.createCursorKeys();

        this.gifts = this.physics.add.group({
            classType: Item,
            runChildUpdate: false
        })

        for (var i = 8; i >= 0; i--) {
            var xpos = Math.floor(Math.random() * (this.xMax - this.xMin)) + this.xMin;
            var ypos = Math.floor(Math.random() * (this.yMax - this.yMin)) + this.yMin;
            // console.log(xpos + ", " + ypos);
            this.gift = new Item(this, xpos, ypos);
            this.gifts.add(this.gift, true);
        }
        this.physics.add.overlap(this.bear, this.gifts, (bearObject, bulletObject) => {
            this.giftOverlap(bearObject, bulletObject);
        });
        this.physics.add.collider(this.bear, this.bullets, (bearHit, bulletHit) => {
        	this.hitCallback(bearHit, bulletHit);
        });
	},

    update: function (time, delta)
    {
        this.gun.setVelocityX(0);
        if (this.cursors.left.isDown)
        {
            this.gun.setVelocityX(-400);
        }
        else if (this.cursors.right.isDown)
        {
            this.gun.setVelocityX(400);
        }
        if (this.cursors.space.isDown && time > this.lastFired)
        {
            this.bullet = this.bullets.get();
            if (this.bullet)
            {
                this.bullet.fire(this.gun.x, this.gun.y);
                this.lastFired = time + 500;
            }
        }

        if (this.bear.x < this.xMin || this.bear.x > this.xMax || 
            this.bear.y < this.yMin || this.bear.y > this.yMax)
        {
            this.bear.x = 400;
            this.bear.y = 400;
            this.bear.setVelocity(0);
            alert("Life lost");

            // // fake animation
            // bear.setAngle(90);
            // bear.setAngle(180);
            // bear.setAngle(-90);
            // bear.setAngle(0);
        }
    },

	giftOverlap: function(bearObject, giftObject)
    {
        giftObject.destroy();
    },

    hitCallback: function(bearHit, bulletHit)
    {
        // alert("I am an alert box!!");
        // Reduce health of enemy
        if (bulletHit.active === true && bearHit.active === true)
        {
            // Destroy bullet
            bulletHit.destroy();

            bearHit.setVelocityX(0);
            bearHit.setVelocityY(0);
            if (this.bearStat == "right")
            {
                this.bearStat = "up";
                bearHit.setVelocityY(-this.bearSpeed);
            }
            else if (this.bearStat == "left")
            {
                this.bearStat = "down";
                bearHit.setVelocityY(this.bearSpeed)
            }
            else if (this.bearStat == "up")
            {
                this.bearStat = "left";
                bearHit.setVelocityX(-this.bearSpeed)
            }
            else if (this.bearStat == "down")
            {
                this.bearStat = "right";
                bearHit.setVelocityX(this.bearSpeed)
            }

            this.hitCount ++;
            this.bearSpeed = ( Math.tanh(this.hitCount * 0.3 - 4 ) + 2) * 1.5 * this.initialBearSpeed;
        }
    }
})