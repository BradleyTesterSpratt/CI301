class PhaserUnit {
  constructor(game, position, colour, speed = 2) {
    this.game = game;
    this.unit = new UnitClass(this.getAdjustedPosition(position.x, position.y), this.game.map, speed);
    const body = game.add.sprite(position.x, position.y, 'unit');
    // body.setOrigin(0.5, 0.5);
    body.setScale(0.5, 0.5);
    this.body = body;
    this.body.tint = colour; 
  }

  update() {
    if (this.unit.state == "underAttack") {
      this.takeDamage();
    } else {
      this.body.x = this.unit.position.x * 32;
      this.body.y = this.unit.position.y * 32;
    }
  }

  perFrameUpdate() {
    this.unit.performAction();
  }

  setPointer(x, y) {
    var adjLoc = this.getAdjustedPosition(x, y);
    var unit = this.game.map.findUnitByPosition(adjLoc);
    if(unit != null && unit != this) this.unit.setTarget(unit); 
    else this.unit.setDestination(this.getAdjustedPosition(x, y));
  }

  getAdjustedPosition(x, y) {
    var newX = Math.round(x/32);
    var newY = Math.round(y/32);
    return {x: newX, y: newY};
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  takeDamage() {
    var rand = Math.random();
    var direction = 1;
    if(rand >= 0.5) {
      direction = -1;
    }
    this.body.x += this.getRandomInt(2) * direction;
    this.body.y += this.getRandomInt(2) * direction;
  }
}