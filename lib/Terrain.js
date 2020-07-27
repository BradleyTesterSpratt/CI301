function Terrain(position) {
  this.cover = 0;
  this.traversable = false;
  this.position = position;
  // something like this for player maps?
  // this.visible = false;
  // this.revelead = false;
}

Terrain.prototype.toggleTraversable = function() {
  this.traversable = !this.traversable;
}

module.exports = Terrain;