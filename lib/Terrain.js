function Terrain(position) {
  this.cover = 0;
  this.traversable = false;
  this.position = position;
  // something like this for player maps?
  // this.visible = false;
  // this.revelead = false;
}

module.exports = Terrain;