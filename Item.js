var Item = new Phaser.Class({
    Extends: Phaser.Physics.Arcade.Image,

    initialize:
    function Item(scene, xpos, ypos)
    {
        Phaser.Physics.Arcade.Image.call(this, scene, xpos, ypos, 'star');
    },
});