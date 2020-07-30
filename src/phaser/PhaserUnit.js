class PhaserUnit {
  constructor(game, position) {
    this.unit = new Unit(position, game.map);
    this.body = game.add.sprite(position.x, position.y, 'unit');
    this.body.tint = Constants.colour.blue; 
  }

  update() {
    this.body.x = this.unit.position.x;
    this.body.y = this.unit.position.y;
  }

  setPointer(x, y) {
    this.unit.setDestination({x, y});
  }
}