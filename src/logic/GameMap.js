const Terrain = require("./Terrain");
const pf = require('pathfinding');

function GameMap(width, height) {
  this.terrainList = [];
  this.unitList = [];
  this.grid = new pf.Grid(width, height);
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
  return terrain;
}

GameMap.prototype.findUnitByPosition = function(position) {
  var unit = null;
  this.unitList.forEach(entry => {
    if(entry.position.x == position.x && entry.position.y == position.y) {
      unit = entry;
    };
  });
  return unit;
}

GameMap.prototype.updateOccupiedTerrain = function() {
  this.terrainList.forEach(terrain => {
    if(terrain.occupied) {
      terrain.vacate();
      this.grid.setWalkableAt(terrain.position.x, terrain.position.y, true);
    }
  });
  this.unitList.forEach(unit => {
    var posX = unit.position.x;
    var posY = unit.position.y;
    this.occupyTerrain(unit.id, {x: posX, y: posY});
    this.grid.setWalkableAt(posX, posY, false);
  });
}

GameMap.prototype.occupyTerrain = function(unitID, position) {
  var terrain = this.getTerrainByPosition(position);
  if(terrain != null) {
    terrain.occupy(unitID);
  } else {
    terrain = new Terrain(this.grid, position);
    this.addTerrain(terrain);
    terrain.occupy(unitID);
  }
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
global.GameMapClass = GameMap;