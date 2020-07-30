class MainScene extends Phaser.Scene {
  constructor() {
    super('mainScene');
  }

  preload() {
    this.load.image('unit', 'src/assets/unit.png');
  }

  create() {
    this.map = new GameMapClass();
    this.pointer = this.input.activePointer;
    this.player = new PhaserUnit(this, {x:400, y:400});
    // this.gameInput = new Input(this);
    // this.gameInput.leftClick(function() {
      // this.player.setPointer(this.pointer.worldX, this.pointer.worldY);
    // this.input.setPollAlways();
    // });
    this.input.on('pointerdown', function (pointer) {
      this.player.setPointer(pointer.x, pointer.y);
    }, this);
  }

  update() {
    // this.gameInput.update();
    this.player.update();
  }
}