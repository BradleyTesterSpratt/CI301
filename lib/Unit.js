const Terrain = require("./Terrain");

function Unit(state, position, map) {
  this.id;
  this.state = state;
  this.position = position;
  //give unit a reference to the map it is on for checking terrain
  map.addUnit(this);
  this.map = map;
  this.speed = 2;
  this.actionQueue = [];
  this.destination;
  this.health = 5;
  this.currentHP = this.health;
  this.range = 1;
  this.attackPower = 1;
  this.target;
  //set this to true in test suite for debug output
  this.debug = false;
}

Unit.prototype.setState = function(state) {
  this.state = state;
}

Unit.prototype.setDestination = function(position) {
  if(this.state != "dead") {
    if(this.position != position) {
      this.destination = position;
      this.queueAction("move");
    }
  }
}

Unit.prototype.setTarget = function(target) {
  if(this.state != "dead") {
    if(target.state != "dead") {
      this.target = target;
      this.queueAction("rangeCheck");
    }
  }
}

Unit.prototype.queueAction = function(action) {
  this.actionQueue.push(action);
}

Unit.prototype.performAction = function() {
  if(this.actionQueue.length > 0) {
    action = this.actionQueue.pop()
  if(this.debug) console.log("unit " + this.id + " position x: " + this.position.x + ", " + this.position.y + "\n" + "action to perform: " + action);
    switch (action) {
      case "move":
        this.move();
        break;
      case "attack":
        this.attack();
        break;
      case "rangeCheck":
        this.rangeCheck();
        break;
      default:
        break;
    }
  }
}

Unit.prototype.pointRangeCheck = function(point) {
  if(point == "x") {
    return Math.abs(this.position.x - this.target.position.x) <= this.range;
  } else {
    return Math.abs(this.position.y - this.target.position.y) <= this.range;
  }
}

/**
 * actions
 */

Unit.prototype.move = function() {
  movementAllowence = this.speed;
  for (i=0; movementAllowence > i; i++) {
    var newPosition = {x:null, y:null};
    newPosition.x = this.position.x + Math.sign(this.destination.x - this.position.x);
    newPosition.y = this.position.y + Math.sign(this.destination.y - this.position.y);
    var terrain = this.map.getTerrainByPosition(newPosition)
    if(terrain == null || terrain.traversable && !terrain.occupied) {
      this.position = newPosition;
    };
  };
  if(this.position.x != this.destination.x || this.position.y != this.destination.y) {
    //replace with a state machine or function?
    if(this.state != "closingDistance") {
      this.state = "moving";
      this.queueAction("move");
    }
  } else if(this.state == "closingDistance") {
    this.state = "attacking";
  } else {
    this.state = "idle";
  }
}

Unit.prototype.rangeCheck = function() {
  xInRange = this.pointRangeCheck("x");
  yInRange = this.pointRangeCheck("y");

  if(xInRange && yInRange) {
    this.queueAction("attack");
    this.state = "attacking";
  } else {
    this.queueAction("rangeCheck");
    this.state = "closingDistance";
    this.setDestination(this.target.position);
  }
}

Unit.prototype.attack = function() {
  this.target.receieveAttack(this.attackPower);
  if(this.target.currentHP > 0) {
    if(this.debug) {console.log(this.target.currentHP)};
    this.queueAction("rangeCheck");
  }
}

Unit.prototype.receieveAttack = function(attackPower) {
  this.state = "underAttack";
  this.currentHP = this.currentHP - attackPower;
}

module.exports = Unit;