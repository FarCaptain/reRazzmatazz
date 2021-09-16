var MainScene = new Phaser.Class({
	Extends: Phaser.Scene,

    init: function()
    {
        this.xMin = 60;
        this.xMax = 452;
        this.yMin = 60;
        this.yMax = 452;
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
        this.load.image('bg', 'assets/Pixel map draft 2.png');
        this.load.image('iceberg', 'assets/iceberg.png');
        this.load.image('present', 'assets/present.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bullet', 'assets/bullet.png');
        this.load.image('gun', 'assets/gun.png');
        this.load.image('bear', 'assets/santa_drone.png');

        this.load.audio('BG_music', 'assets/Sounds/backgroundmusic.ogg');
        this.load.audio('life_lost', 'assets/Sounds/droneoutofarea.ogg');
        this.load.audio('game_over', 'assets/Sounds/gamefinish.ogg');
        this.load.audio('get_gift', 'assets/Sounds/getgift.ogg');
        this.load.audio('snowball_hit', 'assets/Sounds/snowballhitting.ogg');
        this.load.audio('snowball_throw', 'assets/Sounds/throwsnowball.ogg');
	},

	create:function()
	{
        this.music = this.sound.add("BG_music");
        this.life_lost = this.sound.add("life_lost");
        this.game_over = this.sound.add("game_over");
        this.get_gift = this.sound.add("get_gift");
        this.snowball_hit = this.sound.add("snowball_hit");
        this.snowball_throw = this.sound.add("snowball_throw");

        this.music.play();

		this.add.image(256, 256, 'bg');
        
        this.gun = this.physics.add.sprite(100, 580, 'gun').setScale(1.2);
        this.gun.setCollideWorldBounds(true);

        // this.physics.world.setBounds(0, 0, 800, 550);
        this.bear = this.physics.add.sprite(100, 400, 'bear').setScale(1.5);
        this.bear.setCollideWorldBounds(true);

        this.droneLogo = this.add.image(21, 467, 'bear');

        //used to test stuff
        // this.testText = this.add.text(16, 16, 'stat: right', { fontSize: '32px', fill: '#000' });
        this.scoreText = this.add.text(16, 16, 'SCORE: ' + this.score + "      GIFTS: " + (this.maxGiftCount - this.giftCollected), { fontSize: '20px', fill: '#FFFFFF' });
        this.lifeText = this.add.text(10, 490, this.life, { fontSize: '20px', fill: '#FFFFFF' });

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
                this.snowball_throw.play();
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
                this.game_over.play();
                alert("Game Over!");
                this.lifeText.setText(this.life);
                location.reload();
            }
            else
            {

                this.life_lost.play();
                alert("Life lost");
                this.lifeText.setText(this.life);
            }

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
        this.score += 100;
        this.scoreText.setText('SCORE: ' + this.score + "      GIFTS: " + (this.maxGiftCount - this.giftCollected));
        this.get_gift.play();

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
            this.snowball_hit.play();
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