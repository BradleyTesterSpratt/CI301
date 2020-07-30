class PhaserUnit {
  constructor(game, position, colour) {
    this.unit = new UnitClass(position, game.map);
    const body = game.add.sprite(position.x, position.y, 'unit');
    body.setOrigin(0.5, 0.5);
    this.body = body;
    this.body.tint = colour; 
  }

  update() {
    this.body.x = this.unit.position.x;
    this.body.y = this.unit.position.y;
    this.unit.performAction();
  }

  setPointer(x, y) {
    this.unit.setDestination({x, y});
  }
}