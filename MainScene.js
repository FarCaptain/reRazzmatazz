var MainScene = new Phaser.Class({
	Extends: Phaser.Scene,

	preload: function()
	{
        this.load.image('sky', 'assets/sky.png');
        this.load.image('iceberg', 'assets/iceberg.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.image('bullet', 'assets/bullet.png');
        this.load.image('gun', 'assets/gun.png');
        this.load.spritesheet('bear', 
            'assets/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );
	},

	create:function()
	{
		this.lastFired = 0;
        this.bearSpeed = 50;
		this.bearStat = 'right';

		this.add.image(400, 300, 'sky');
        
        this.gun = this.physics.add.sprite(100, 560, 'gun').setScale(0.3);
        this.gun.setCollideWorldBounds(true);

        // this.physics.world.setBounds(0, 0, 800, 550);
        this.bear = this.physics.add.sprite(320, 160, 'bear');
        this.bear.setCollideWorldBounds(true);

        //used to test stuff
        this.testText = this.add.text(16, 16, 'stat: right', { fontSize: '32px', fill: '#000' });


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
            var xpos = Math.floor(Math.random() * 800);
            var ypos = Math.floor(Math.random() * 600);
            // console.log(xpos + ", " + ypos);
            this.gift = new Item(this, xpos, ypos);
            this.gifts.add(this.gift, true);
        }
        this.physics.add.overlap(this.bear, this.gifts, this.giftOverlap);
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

            // testText.setText('Stat : ' + this.bearStat + " " + bearHit.body.velocity.x +" "+bearHit.body.velocity.y);
        }
    }
})