describe("GameMap", function() {
  var GameMap = require('../lib/GameMap');
  var Terrain = require('../lib/Terrain');
  var map;
  var terrain;

  describe("addTerrain", function() {
    beforeEach(function() {
      map = new GameMap();
      terrain = new Terrain({x:2, y:2});
    });

    it("should add the new terrain to the terrainList" , function() {
      map.addTerrain(terrain);
      expect(map.terrainList).toContain(terrain);
    });
  });

  describe("getTerrainByPosition", function() {
    beforeEach(function() {
      map = new GameMap();
      terrain = new Terrain({x:2, y:2});
    });

    it("should find the terrain if there is an terrain at that position in the terrainList" , function() {
      map.addTerrain(terrain);
      expect(map.getTerrainByPosition({x:2, y:2})).toBe(terrain);
    });

    it("should not find a terrain if there is not terrain at that position in the terrainList" , function() {
      map.addTerrain(terrain);
      expect(map.getTerrainByPosition({x:2, y:1})).not.toBe(terrain);
    });
  });

});