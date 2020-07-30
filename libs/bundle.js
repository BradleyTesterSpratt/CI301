(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var terrain = require("../src/logic/Terrain");
var unit = require("../src/logic/Unit");
var gamemap = require("../src/logic/GameMap");
},{"../src/logic/GameMap":2,"../src/logic/Terrain":3,"../src/logic/Unit":4}],2:[function(require,module,exports){
// const Terrain = require("./Terrain");

function GameMap() {
  this.terrainList = [];
  this.unitList = [];
  // this.childMaps = [];
}

GameMap.prototype.addTerrain = function(terrain) {
  this.terrainList.push(terrain);
}

GameMap.prototype.addUnit = function(unit) {
  this.unitList.push(unit);
  unit.id = this.unitList.length - 1;
}

GameMap.prototype.removeUnit = function(unit) {
  this.unitList.splice(unit.id)
}

GameMap.prototype.getTerrainByPosition = function(position) {
  var terrain = null;
  this.terrainList.forEach(entry => {
    if(entry.position.x == position.x && entry.position.y == position.y) {
      terrain = entry;
    };
  });
  return terrain != null ? terrain : null;
}

GameMap.prototype.updateOccupiedTerrain = function() {
  this.terrainList.forEach(terrain => {
    terrain.vacate();
  });
  this.unitList.forEach(unit => {
    var terrain = this.getTerrainByPosition(unit.position);
    if(terrain != null) {
      terrain.occupy();
    } else {
      terrain = new Terrain(unit.position);
      this.addTerrain(terrain);
      terrain.occupy();
    }
  });
}
// GameMap.prototype.addChildMap = function(map) {
//   this.childMaps.push(map);
// }

// GameMap.prototype.updateChildMaps = function(terrain, action) {
//   this.childMaps.forEach(map => {
//     // remove the terrain from the list
//     // or add a copy of a new terrain to the list
//   });
// }

// something like this for each team/player
// function PlayerMap(map) {
//   map.addChildMap(this); 
//   this.terrainList = []
//   for each terrain in the map.terrainList add a copy;

// }

module.exports = GameMap;

},{}],3:[function(require,module,exports){
function Terrain(position, traversable = true) {
  this.cover = 0;
  this.traversable = traversable;
  this.position = position;
  this.occupied = false
  // something like this for player maps?
  // this.visible = false;
  // this.revelead = false;
}

Terrain.prototype.occupy = function() {
  this.occupied = true;
}

Terrain.prototype.vacate = function() {
  this.occupied = false;
}

module.exports = Terrain;
},{}],4:[function(require,module,exports){
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
  this.state = "underAttack";
  this.currentHP = this.currentHP - attackPower;
}

module.exports = Unit;
},{}]},{},[1]);
