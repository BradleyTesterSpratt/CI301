const pf = require('pathfinding');
const Action = require("./GOAP/Action");

function Unit(position, map) {
  this.id;
  this.alive = true;
  this.position = position;
  this.speed = 2;
  this.destination;
  this.health = 5;
  this.currentHP = this.health;
  this.range = 1;
  this.attackPower = 1;
  this.target;
  this.path;
  map.addUnit(this);
  this.map = map;
  //actions for goap
  this.actionList = [
    new Action("attack enemy", [this.inRange(), this.target.currentHP > 0], [this.target.currentHP <= 0]),
    new Action("close distance", [!this.inRange()], [this.inRange() == true]),
    new Action(
      "move to",
      [this.position != this.destination],
      [this.position == this.destination],
      this.newPath(this.position.x, this.position.y, this.target.position.x, this.target.position.y, tempGrid).length
    )
    // new Action("target enemy at", [this.alive], this.setTarget(position)),
    // new Action("set destination to", [this.alive], this.setDestination(position))
  ];
  this.goal = null;
  this.actionQueue = [];
  this.debug = false;
}

Unit.prototype.setDestination =function(position) {
  if(position.x < 0) position.x = 0;
  if(position.y < 0) position.y = 0;
  if(position.x > this.map.grid.length) position.x = this.map.grid.length - 1;
  if(position.y > this.map.grid.length) position.y = this.map.grid.length - 1;
  this.destination = position;
  this.goal = function() {this.position == this.destination};
}

Unit.prototype.newPath = function(cX, cY, dX, dY, grid = this.map.grid.clone()) {
  var finder = new pf.AStarFinder({
    allowDiagonal: true
  });
  return finder.findPath(cX, cY, dX, dY, grid);;
}

Unit.prototype.setTarget = function(target) {
  this.target = target;
  this.goal = function() {this.target.currentHp <= 0};
}

Unit.prototype.queueAction = function(action, queue = this.actionQueue) {
  queue.push(action);
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
  this.actionQueue = [];
}

Unit.prototype.populateActionQueue = function() {
  let originalState = JSON.stringify(this);
  let queue = [];
  let goals = [this.goal]
  let currentGoal = goals[goals.length-1];
  while(!currentGoal) {
    //foo
    
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
}

Unit.prototype.rangeCheck = function() {
  if(this.inRange()) {
    this.queueAction("attack");
    this.state = "attacking";
  } else {
    this.queueAction("rangeCheck");
    this.state = "closingDistance";
    //set up a temporary copy of the grid that has the target reachable
    var tempGrid = this.map.grid.clone();
    tempGrid.setWalkableAt(this.target.position.x, this.target.position.y, true);
    var newPath = this.newPath(this.position.x, this.position.y, this.target.position.x, this.target.position.y, tempGrid);
    //get the position closest to the target
    var neighborPos = newPath.reverse()[1];
    var newTargetPos = {x: neighborPos[0], y: neighborPos[1]};
    this.setDestination(newTargetPos);
  }
}

Unit.prototype.attack = function() {
  this.target.receieveAttack(this.attackPower);
}

Unit.prototype.receieveAttack = function(attackPower) {
  this.currentHP = this.currentHP - attackPower;
}

module.exports = Unit;
global.UnitClass = Unit;