function Unit(state, position) {
  this.state = state;
  this.position = position;
  this.speed = 2;
  this.actionQueue = [];
  this.destination;
}
Unit.prototype.setDestination = function(position) {
  if(this.state != "dead") {
    if(this.position != position) {
      this.destination = position;
      this.queueAction("move");
    }
  }
}

Unit.prototype.queueAction = function(action) {
  this.actionQueue.push(action);
}

Unit.prototype.performAction = function() {
  if(this.actionQueue.length > 0) {
    action = this.actionQueue.pop()
    switch (action) {
      case "move":
        this.move();
        break;
    
      default:
        break;
    }
  }
}

Unit.prototype.move = function() {
  movementAllowence = this.speed;
  for (i=0; movementAllowence > i; i++) {
    movementRequired = this.destination.x - this.position.x;
    if(movementRequired != 0) {
      this.position.x = this.position.x + Math.sign(movementRequired);
      continue;
    }
    movementRequired = this.destination.y - this.position.y;
    if(movementRequired != 0) {
      this.position.y = this.position.y + Math.sign(movementRequired);
    }
  }
  if(this.position.x != this.destination.x || this.position.y != this.destination.y) {
    this.state = "moving";
    this.queueAction("move");
  } else {
    this.state = "idle";
  }
}

Unit.prototype.setState = function(state) {
  this.state = state;
}

module.exports = Unit;