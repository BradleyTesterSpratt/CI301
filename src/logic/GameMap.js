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
