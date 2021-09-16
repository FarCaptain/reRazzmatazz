var MainScene = new Phaser.Class({
	Extends: Phaser.Scene,

    init: function()
    {
        this.xMin = 200;
        this.xMax = 600;
        this.yMin = 100;
        this.yMax = 500;
        this.life = 3;
        this.hitCount = 0;
        this.lastFired = 0;
        this.initialBearSpeed = 100;
        this.bearSpeed = this.initialBearSpeed;
        this.gunSpeed = 800;
        this.bearStat = 'right';
        this.giftCount = 0;
        this.giftCollected = 0;
        this.maxGiftCount = 15;
        this.score = 0;
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
		this.add.image(400, 300, 'sky');
        
        this.gun = this.physics.add.sprite(100, 560, 'gun');
        this.gun.setCollideWorldBounds(true);

        // this.physics.world.setBounds(0, 0, 800, 550);
        this.bear = this.physics.add.sprite(320, 220, 'bear');
        this.bear.setCollideWorldBounds(true);

        //used to test stuff
        // this.testText = this.add.text(16, 16, 'stat: right', { fontSize: '32px', fill: '#000' });
        this.scoreText = this.add.text(16, 16, 'Score: ' + this.score, { fontSize: '20px', fill: '#000' });

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
            this.giftCount ++;


            this.physics.add.overlap(this.gift, this.gifts, (giftObject, giftSet) => {
                this.giftSaperate(giftObject, giftSet);
            });
        }
        this.physics.add.overlap(this.bear, this.gifts, (bearObject, bulletObject) => {
            this.giftOverlap(bearObject, bulletObject);
        });
        this.physics.add.overlap(this.bear, this.bullets, (bearHit, bulletHit) => {
        	this.hitCallback(bearHit, bulletHit);
        });
	},

    update: function (time, delta)
    {
        this.gun.setVelocityX(0);
        if (this.cursors.left.isDown)
        {
            this.gun.setVelocityX(-this.gunSpeed);
        }
        else if (this.cursors.right.isDown)
        {
            this.gun.setVelocityX(this.gunSpeed);
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
            this.hitCount = 0;

            if ( this.giftCollected == this.maxGiftCount )
            {
                alert("You Win!");
                location.reload();
            }
            else if ( --this.life == 0 )
            {
                alert("Game Over!");
                location.reload();
            }
            else
                alert("Life lost");

            this.bearSpeed = this.initialBearSpeed;
            this.bear.x = 320;
            this.bear.y = 220;
            this.bear.setVelocityX(this.bearSpeed);
            this.bear.setVelocityY(0);
            this.bearStat = "right";

            // if ( giftCOunt == 0 ) win

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
        this.giftCollected ++;
        this.score += 20;
        this.scoreText.setText("Score: " + this.score);

        //try to generate a new one
        if (this.giftCount < this.maxGiftCount)
        {
            var xpos = Math.floor(Math.random() * (this.xMax - this.xMin)) + this.xMin;
            var ypos = Math.floor(Math.random() * (this.yMax - this.yMin)) + this.yMin;
            // console.log(xpos + ", " + ypos);
            this.gift = new Item(this, xpos, ypos);
            this.gifts.add(this.gift, true);
            this.giftCount ++;
            // this.testText.setText('cnt : ' + this.giftCount );

            this.physics.add.overlap(this.gift, this.gifts, (giftObject, giftSet) => {
                this.giftSaperate(giftObject, giftSet);
            });
        }
    },
    
    giftSaperate: function(giftObject, giftSet)
    {
        giftObject.destroy();
        this.giftCount --;
        // this.testText.setText('cnt : ' + this.giftCount );

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