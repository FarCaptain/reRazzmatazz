var YouWinScene = new Phaser.Class({
    Extends: Phaser.Scene,
    
    preload: function()
    {
        this.load.image('bg', 'assets/Pixel map draft 2.png');
        this.load.image('youwin', 'assets/youwin.png');
        this.add.text(10, 10, "Now Loading ...", { font: "20px Arial", fill: "#f8b229" });
    },
    
    create:function()
    {
        this.add.image(256, 256, 'bg');
        this.add.image(256, 256, 'youwin');
        this.cursors = this.input.keyboard.createCursorKeys();
    },

    update:function()
    {
        if (this.cursors.space.isDown)
        {
            location.reload();
        }
    },
});