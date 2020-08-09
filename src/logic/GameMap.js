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
    }
  });
  this.unitList.forEach(unit => {
    var posX = unit.position.x;
    var posY = unit.position.y;
    this.occupyTerrain(unit.id, {x: posX, y: posY});
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

module.exports = GameMap;
global.GameMapClass = GameMap;