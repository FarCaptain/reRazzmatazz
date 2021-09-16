var config = {
        type: Phaser.AUTO,
        width: 512,
        height: 512,
        physics: {
        default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                debug: false
            }
        },
        scene: [MainScene]
    };

const game = new Phaser.Game(config);

// game.scene.add('mainscene', MainScene);

// game.scene.start('mainscene');