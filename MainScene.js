var MainScene = new Phaser.Class({
	Extends: Phaser.Scene,

    init: function()
    {
        this.xMin = 60;
        this.xMax = 452;
        this.yMin = 60;
        this.yMax = 452;
        this.droneStartX = 100;
        this.droneStartY = 400;
        this.timedEvent;
        this.life = 3;
        this.hitCount = 0;
        this.lastFired = 0;
        this.fireInterval = 200;
        this.lastSpawned = 0;
        this.spawnInterval = 1000 ;
        this.rand = 0;
        this.initialBearSpeed = 100;
        this.bearSpeed = this.initialBearSpeed;
        this.gunSpeed = 400;
        this.bearStat = 0; //0-right, 1-up, 2-left, 3-down
        this.isHovering = true;
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
        this.load.spritesheet('gun', 'assets/gun.png', { frameWidth: 32, frameHeight: 32 } );
        this.load.spritesheet('bear', 'assets/drone_loop.png', { frameWidth: 32, frameHeight: 32 } );
        this.load.spritesheet('bird', 'assets/bird.png', { frameWidth: 32, frameHeight: 32 } );

        this.load.audio('BG_music', 'assets/Sounds/backgroundmusic.ogg');
        this.load.audio('life_lost', 'assets/Sounds/droneoutofarea.ogg');
        this.load.audio('you_win', 'assets/Sounds/gamefinish.ogg');
        this.load.audio('game_over', 'assets/Sounds/lose.ogg');
        this.load.audio('get_gift', 'assets/Sounds/getgift.ogg');
        this.load.audio('snowball_hit', 'assets/Sounds/snowballhitting.ogg');
        this.load.audio('snowball_throw', 'assets/Sounds/throwsnowball.ogg');
        this.load.audio('drone_rotate', 'assets/Sounds/dronerotate.ogg');
	},

	create:function()
	{
        // sounds
        this.music = this.sound.add("BG_music");
        this.life_lost = this.sound.add("life_lost");
        this.you_win = this.sound.add("you_win");
        this.game_over = this.sound.add("game_over");
        this.get_gift = this.sound.add("get_gift");
        this.snowball_hit = this.sound.add("snowball_hit");
        this.drone_rotate = this.sound.add("drone_rotate");
        this.snowball_throw = this.sound.add("snowball_throw");

        // animations
        this.anims.create({
            key: 'throw',
            frames: this.anims.generateFrameNumbers('gun', { start: 1, end: 0 }),
            frameRate: 5,
            repeat: 0
        });
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('bear', { start: 0, end: 0 }),
            frameRate: 1,
            repeat: 0
        });
        this.anims.create({
            key: 'rotate',
            frames: this.anims.generateFrameNumbers('bear', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: 0
        });
        this.anims.create({
            key: 'fall',
            frames: this.anims.generateFrameNumbers('bear', { start: 5, end: 9 }),
            frameRate: 15,
            repeat: 0
        });
        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('bird', { start: 0, end: 3 }),
            frameRate: 3,
            repeat: -1
        });

        this.music.play();

		this.add.image(256, 256, 'bg');

        // sprites
        this.gun = this.physics.add.sprite(100, 580, 'gun').setScale(1.2);
        this.gun.setCollideWorldBounds(true);

        // this.physics.world.setBounds(0, 0, 800, 550);
        this.bear = this.physics.add.sprite(this.droneStartX, this.droneStartY, 'bear').setScale(1.5);
        this.bear.setCollideWorldBounds(true);
        // this.bear.on('animationcomplete', this.stopHovering);

        this.birds = this.physics.add.group({
            classType: Bird,
            maxSize: 8,
            runChildUpdate: true
        })

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

        this.timedEvent = this.time.delayedCall(700, this.onStart, [], this);
	},

    onStart: function()
    {
        //TODO. 'press any key to continue' would make more sense
        this.isHovering = false;
        this.bearStat = 0;
        this.bear.setVelocityX(this.bearSpeed);// drone starts go right
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
            this.gun.anims.play('throw', true);
            this.bullet = this.bullets.get();
            if (this.bullet)
            {
                this.bullet.fire(this.gun.x, this.gun.y);
                this.snowball_throw.play();
                this.lastFired = time + this.fireInterval;
            }
        }

        
        this.spawnInterval = (1 + (this.maxGiftCount - this.giftCollected) * (4 /15)) * 1000;
        console.log(this.spawnInterval);
        console.log(this.giftCount );
 
        if (time > this.lastSpawned)
        {
            this.bird = this.birds.get();
            this.bird.anims.play('fly', true);
            if (this.bird)
            { 
                var rand = Math.floor(Math.random() * 3 + 1);
                if(rand == 1)this.bird.fly(0, Math.floor(Math.random() * 512), 512, Math.floor(Math.random() * 512), 100);
                if(rand == 2)this.bird.fly(512, Math.floor(Math.random() * 512), 0, Math.floor(Math.random() * 512), 100);
                if(rand == 3)this.bird.fly(Math.floor(Math.random() * 512), 0, Math.floor(Math.random() * 512), 512, 100);
                if(rand == 4)this.bird.fly(Math.floor(Math.random() * 512), 512, Math.floor(Math.random() * 512), 0, 100);
                this.physics.add.overlap(this.bear, this.bird, (bearHit, birdHit) => {
                    this.hitCallback(bearHit, birdHit);
                });
                this.lastSpawned = time + this.spawnInterval;
            }
        }

        if (this.bear.x < this.xMin || this.bear.x > this.xMax || 
            this.bear.y < this.yMin || this.bear.y > this.yMax)
        {
            if( this.isHovering )
                return;

            this.hitCount = 0;

            if ( this.giftCollected == this.maxGiftCount )
            {
                this.you_win.play();
                this.scene.start('youwinscene');
            }
            else if ( --this.life == 0 )
            {
                this.game_over.play();
                // alert("Game Over!");
                this.lifeText.setText(this.life);
                // location.reload();
                this.scene.start('gameoverscene');
            }
            else
            {
                this.life_lost.play();
                this.bear.anims.play('fall', true);
                this.isHovering = true;
                this.bear.setVelocity(0);
                this.time.addEvent({
                    delay: 700, // in ms
                    callback: () => {
                        this.bear.anims.play('idle', true); 
                        this.bear.x = this.droneStartX;
                        this.bear.y = this.droneStartY;
                        this.bearSpeed = this.initialBearSpeed;
                        this.timedEvent = this.time.delayedCall(700, this.onStart, [], this);
                    }
                })
                this.lifeText.setText(this.life);
                // TODO. play falling anim + delay
                // alert("Life lost");
            }
        }
    },

	giftOverlap: function(bearObject, giftObject)
    {
        giftObject.destroy();
        this.giftCollected ++;
        this.score += this.giftCollected * 100;
        this.scoreText.setText('SCORE: ' + this.score + "      GIFTS: " + (this.maxGiftCount - this.giftCollected));
        this.get_gift.play();

        //try to generate a new one
        if (this.giftCount < this.maxGiftCount)
        {
            var xpos = Math.floor(Math.random() * (this.xMax - this.xMin)) + this.xMin;
            var ypos = Math.floor(Math.random() * (this.yMax - this.yMin)) + this.yMin;
            this.gift = new Item(this, xpos, ypos);
            this.gifts.add(this.gift, true);
            this.giftCount ++;

            this.physics.add.overlap(this.gift, this.gifts, (giftObject, giftSet) => {
                this.giftSaperate(giftObject, giftSet);
            });
        }
    },
    
    giftSaperate: function(giftObject, giftSet)
    {
        giftObject.destroy();
        this.giftCount --;
    },

    hitCallback: function(bearHit, bulletHit)
    {
        // Reduce health of enemy
        if (bulletHit.active === true && bearHit.active === true)
        {
            // Destroy bullet
            bulletHit.destroy();
            this.snowball_hit.play();
            this.drone_rotate.play();

            if ( this.isHovering )
                return;

            this.isHovering = true;

            // counterclockwise
            this.bearStat += 1;
            this.bearStat %= 4;

            this.hitCount ++;
            // this.bearSpeed = ( Math.tanh(this.hitCount * 0.5 - 4 ) + 2) * 1.3 * this.initialBearSpeed;
            // this.bearSpeed = this.initialBearSpeed + (this.hitCount * this.hitCount * 1.3);
            this.bearSpeed = this.initialBearSpeed*1.5 + Math.tanh((this.hitCount * 50 - 100) * 0.005 ) * 100;

            // swap x y speed
            var vec = bearHit.body.velocity;
            var x = 0, y = 0;
            if( vec.y == 0 )//change sign
                x = (vec.x < 0) ? this.bearSpeed : -this.bearSpeed;
            else
                y = (vec.y < 0) ? -this.bearSpeed : this.bearSpeed;

            bearHit.setVelocity(0);

            bearHit.anims.play('rotate', true);
            this.time.addEvent({
                delay: 500, // in ms
                callback: () => {
                    bearHit.setVelocity(y, x);
                    this.isHovering = false;
                }
            })
        }
    }
})