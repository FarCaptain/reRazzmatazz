var TitleScene = new TitleScene();

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
        // scene: [MainScene, TitleScene]
    };

const game = new Phaser.Game(config);

game.scene.add('mainscene', MainScene);
game.scene.add('titlescene', TitleScene);
game.scene.add('gameoverscene', GameOverScene);
game.scene.add('youwinscene', YouWinScene);

game.scene.start('titlescene');