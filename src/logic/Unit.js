function Unit(position, map) {
  this.id;
  this.state = "idle";
  this.position = position;
  this.speed = 2;
  this.actionQueue = [];
  this.destination;
  this.health = 5;
  this.currentHP = this.health;
  this.range = 1;
  this.attackPower = 1;
  this.target;
  this.size = 64;
  //give unit a reference to the map it is on for checking terrain
  map.addUnit(this);
  this.map = map;
  //set this to true in test suite for debug output
  this.debug = false;
}

Unit.prototype.setState = function(state) {
  this.state = state;
}

Unit.prototype.setDestination = function(position) {
  if(this.state != "dead") {
    if(this.position != position) {
      if(this.debug) {console.log(`destination is now ${JSON.stringify(this.destination)}`)};
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
  //change this so that actions queue underneath a take damage action
  if(this.state == "underAttack") {
    var queuePosition = this.actionQueue.length - this.actionQueue.filter(x => x==="injured").length;
    this.actionQueue.splice(queuePosition, 0, action);
  } else this.actionQueue.push(action);
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
  } else this.state = "idle";
}

Unit.prototype.pointRangeCheck = function(point) {
  var inRange;
  switch(point) {
    case "x": 
      var difference = Math.abs(this.position.x - this.target.position.x);
      inRange = (difference <= this.range);
      break;
    case "y":
      var difference = Math.abs(this.position.y - this.target.position.y);
      inRange = (difference <= this.range);
      break;
    default:
      inRange = false;
      break;
  }
  return inRange;
}

Unit.prototype.inRange = function() {
  xInRange = this.pointRangeCheck("x");
  yInRange = this.pointRangeCheck("y");
  return (xInRange && yInRange);
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
    if(terrain == null || (terrain.traversable && !terrain.occupied)) {
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
    if(this.target.position == this.destination) {
      this.queueAction("move");
    } else {
      this.state = "attacking";
    }
  } else {
    this.state = "idle";
  }
}

Unit.prototype.rangeCheck = function() {
  if(this.inRange()) {
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
  } else {
    this.target = null;
    this.state = "idle";
  };
}

Unit.prototype.receieveAttack = function(attackPower) {
  if(this.state != "underAttack") {
    this.state = "underAttack";
    this.currentHP = this.currentHP - attackPower;
    for(i=0; i < 3; i++) {
      this.queueAction("injured");
    }
  }
}

module.exports = Unit;
global.UnitClass = Unit;