function Terrain(position, traversable = true) {
  this.cover = 0;
  this.traversable = traversable;
  this.position = position;
  this.occupied = false;
  this.occupier = null;
  // something like this for player maps?
  // this.visible = false;
  // this.revelead = false;
}

Terrain.prototype.occupy = function(unitID) {
  this.occupied = true;
  this.occupier = unitID;
}

Terrain.prototype.vacate = function(unitID) {
  this.occupied = false;
  this.occupier = null;
}

module.exports = Terrain;
global.TerrainClass = Terrain;