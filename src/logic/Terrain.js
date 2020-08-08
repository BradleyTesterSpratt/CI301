function Terrain(grid, position, traversable = true) {
  this.grid = grid;
  this.cover = 0;
  this.traversable = traversable;
  this.position = position;
  this.grid.setWalkableAt(this.position.x, this.position.y, traversable);
  this.occupied = false;
  this.occupier = null;
  // something like this for player maps?
  // this.visible = false;
  // this.revelead = false;
}

Terrain.prototype.occupy = function(unitID) {
  this.occupied = true;
  this.occupier = unitID;
  this.grid.setWalkableAt(this.position.x, this.position.y, true);
}

Terrain.prototype.vacate = function() {
  this.occupied = false;
  this.occupier = null;
  this.grid.setWalkableAt(this.position.x, this.position.y, false);
}

module.exports = Terrain;
global.TerrainClass = Terrain;