const pf = require('pathfinding');

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
  this.path;
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
      if(this.state != "closingDistance") {this.clearQueue();}
      if(this.debug) {console.log(`destination is now ${JSON.stringify(this.destination)}`)};
      if(position.x < 0) position.x = 0;
      if(position.y < 0) position.y = 0;
      if(position.x > this.map.grid.length) position.x = this.map.grid.length - 1;
      if(position.y > this.map.grid.length) position.y = this.map.grid.length - 1;
      this.destination = position;
      this.path = this.setPath(this.position.x, this.position.y, this.destination.x, this.destination.y)
      this.queueAction("move");
    }
  }
}

Unit.prototype.setPath = function(cX, cY, dX, dY, grid = this.map.grid.clone()) {
  var finder = new pf.AStarFinder({
    allowDiagonal: true
  });
  newPath = finder.findPath(cX, cY, dX, dY, grid);
  return newPath;
}

Unit.prototype.setTarget = function(target) {
  if(this.state != "dead") {
    if(target.state != "dead") {
      this.clearQueue();
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


Unit.prototype.clearQueue = function() {
  var injuries = this.actionQueue.filter(x => x==="injured").length;
  this.actionQueue = [];
  for(i = 0; i < injuries; i++) {
    this.queueAction("injured");
  }
}

/**
 * actions
 */

Unit.prototype.move = function() {
  movementAllowence = this.speed;
  for (i=0; movementAllowence > i; i++) {
    var nextPosition = this.path.shift();
    var newPosition = {x:null, y:null};
    if(nextPosition != null) {
      newPosition.x = nextPosition[0];
      newPosition.y = nextPosition[1];
      this.position = newPosition;
    }
  };
  if(this.position.x != this.destination.x || this.position.y != this.destination.y) {
    //replace with a state machine or function?
    if(this.state != "closingDistance") {
      this.state = "moving";
      this.queueAction("move");
    } else if(this.state == "closingDistance") {
      if(!this.inRange()) {
        this.queueAction("move");
      } else {
        this.state = "attacking";
      }
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
    //set up a temporary copy of the frid that has the target reachable
    var tempGrid = this.map.grid.clone();
    tempGrid.setWalkableAt(this.target.position.x, this.target.position.y, true);
    var newPath = this.setPath(this.position.x, this.position.y, this.target.position.x, this.target.position.y, tempGrid);
    //get the position closest to the target
    var neighborPos = newPath.reverse()[1];
    var newTargetPos = {x: neighborPos[0], y: neighborPos[1]};
    this.setDestination(newTargetPos);
  }
}

Unit.prototype.attack = function() {
  this.target.receieveAttack(this.attackPower);
  if(this.target.currentHP > 0) {
    if(this.debug) console.log(this.target.currentHP);
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

// Unit.prototype.kill = function() {
//   // this.map.unitList
//   this = null;
// }

module.exports = Unit;
global.UnitClass = Unit;