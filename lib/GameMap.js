function GameMap() {
  this.terrainList = [];
  // this.childMaps = [];
}

GameMap.prototype.setTerrain = function(terrain) {
  this.terrainList.push(terrain);
}

GameMap.prototype.getTerrainByPosition = function(position) {
  var terrain;
  this.terrainList.forEach(entry => {

    if(entry.position.x == position.x && entry.position.y == position.y) {
      terrain = entry;
    }
  })
  return terrain != null?  terrain : null;
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
