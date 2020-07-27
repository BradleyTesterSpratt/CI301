function GameMap() {
  this.terrainList = [];
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

module.exports = GameMap;