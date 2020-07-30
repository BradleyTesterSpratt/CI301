class MainScene extends Phaser.Scene {
  constructor() {
    super('mainScene');
  }

  preload() {
    this.load.image('unit', 'src/assets/unit.png');
  }

  create() {
    map = new GameMap();
    this.player = new PhaserUnit(this, {x:0, y:0});
    this.gameInput = new Input(this);
    this.gameInput.leftClick(function() {
      player.setPointer(this.pointer.worldX, this.pointer.worldY);
    });
    game.input.setPollAlways();
  }

  update() {
    this.gameInput.update();
    this.player.update();
  }
}