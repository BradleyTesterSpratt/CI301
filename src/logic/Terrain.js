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
global.TerrainClass = Terrain;