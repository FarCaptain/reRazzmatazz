var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
        default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                debug: true
            }
        },
        scene: [MainScene]
    };

const game = new Phaser.Game(config);

// game.scene.add('mainscene', MainScene);

// game.scene.start('mainscene');