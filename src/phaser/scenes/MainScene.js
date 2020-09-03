class MainScene extends Phaser.Scene {
  constructor() {
    super('mainScene');
  }

  preload() {
    this.load.image('unit', 'src/assets/unit.png');
    this.load.image('block', 'src/assets/block.png');
  }

  create() {
    this.map = new GameMapClass(25, 25);
    this.pointer = this.input.activePointer;
    this.player = new PhaserUnit(this, {x:200, y:200}, Constants.colour.blue);
    this.enemy = new PhaserUnit(this, {x:700, y:700}, Constants.colour.red, 1);
    this.units = [this.player, this.enemy];
    this.input.on('pointerdown', function (pointer) {
      this.player.setPointer(pointer.x, pointer.y);
    }, this);
    this.updateTimer = 0;
    for(let i=0; i<100; i++) {
      let pos = {x:0, y:0};
      pos.x = Math.floor(Math.random()*25);
      pos.y = Math.floor(Math.random()*25);
      this.map.addTerrain(new TerrainClass(this.map.grid, pos, false));
      let body = this.add.sprite(Math.round(pos.x*32), Math.round(pos.y*32), 'block');
      body.tint = Constants.colour.yellow;
      body.setScale(0.5, 0.5);
      body.setOrigin(0.5, 0.5);
    };
  }


  update() {
    this.enemy.unit.huntUnit(this.player.unit);
    this.units.forEach(unit => {
      unit.update();
      this.map.updateOccupiedTerrain();
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