class PhaserUnit {
  constructor(game, position, colour) {
    this.unit = new UnitClass(this.getAdjustedPosition(position.x, position.y), game.map);
    const body = game.add.sprite(position.x, position.y, 'unit');
    body.setOrigin(0.5, 0.5);
    body.setScale(0.5, 0.5);
    this.body = body;
    this.body.tint = colour; 
  }

  update() {
    this.body.x = this.unit.position.x * 32;
    this.body.y = this.unit.position.y * 32;
  }

  perFrameUpdate() {
    this.unit.performAction();
  }

  setPointer(x, y) {
    this.unit.setDestination(this.getAdjustedPosition(x, y));
  }

  getAdjustedPosition(x, y) {
    var newX = Math.round(x/32);
    var newY = Math.round(y/32);
    return {x: newX, y: newY};
  }
}