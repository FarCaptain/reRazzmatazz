var TitleScene = new Phaser.Class({
Extends: Phaser.Scene,
// initialize:
// function TitleScene()
// {
//     super({
//         key: 'TitleScene'
//     });
// },

preload: function()
{
    this.load.image('bg', 'assets/Pixel map draft 2.png');
    this.load.image('instructions', 'assets/instructionpaper.png');
    this.add.text(10, 10, "Now Loading ...", { font: "20px Arial", fill: "#f8b229" });
    this.load.video('intro', 'assets/title.mp4');
    this.load.audio('flip', 'assets/Sounds/flipover.ogg');
},

create:function()
{
    this.add.image(256, 256, 'bg');
    this.instruction = this.add.image(256, 256, 'instructions');
    this.flip = this.sound.add("flip");

    this.video = this.add.video(256, 256, 'intro');
    this.video.play( );
    this.isPlaying = true;

    this.skipText = this.add.text(340, 10, "press space to skip", { fontSize: '13px', fill: '#f8b229' });

    this.video.on('complete', function(text = this.skipText){
        this.stop();
    });

    this.cursors = this.input.keyboard.createCursorKeys();
    this.pressTime = 0;
},

update:function(time)
{
    if (this.instruction.alpha < 1.0)
        this.instruction.alpha += 0.02;
    if (this.cursors.space.isDown)
    {
        if ( this.isPlaying )
        {
            this.video.stop();
            this.video.destroy();
            this.skipText.destroy( );
            this.isPlaying = false;
            this.pressTime = time;
            this.instruction.alpha = 0.1;
            this.flip.play();
        }
        else if( time > this.pressTime + 1000 )
        {
            // this.skipText.setText("press space to START!");
            this.scene.start('mainscene');
        }
    }

}
});