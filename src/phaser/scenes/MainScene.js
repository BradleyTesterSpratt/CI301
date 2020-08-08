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
    this.player = new PhaserUnit(this, {x:400, y:400}, Constants.colour.blue);
    this.enemy = new PhaserUnit(this, {x:600, y:600}, Constants.colour.red);
    this.units = [this.player, this.enemy];
    this.input.on('pointerdown', function (pointer) {
      this.player.setPointer(pointer.x, pointer.y);
    }, this);
    this.updateTimer = 0;
  }

  update() {
    this.map.updateOccupiedTerrain();
    this.units.forEach(unit => {
      unit.update();
    });
    if(this.updateTimer == 0) {
      this.units.forEach(unit => {
        unit.perFrameUpdate();
      });
    }
    this.updateTimer += 0.16;
    if(this.updateTimer >= 1) {
      this.updateTimer = 0;
    }
  }
    
}