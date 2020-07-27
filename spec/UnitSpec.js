describe("Unit", function() {
  var Unit = require('../lib/Unit');
  var GameMap = require('../lib/GameMap');
  var Terrain = require('../lib/Terrain');
  var map;
  var unit;
  var enemy;
  var units;
  
  //use this to simulate the update loop.
  var updateAll = function() {
    units.forEach(unit => {
      unit.performAction();
    });
  }

  describe("setDestination", function() {

    beforeEach(function() {
      map = new GameMap();
      unit = new Unit("idle", {x:0, y:0}, map);
      units = [unit];
    });
    
    it("should be able to move if state is not dead", function() {
      unit.setDestination({x:1, y:1});
      updateAll();
      expect(unit.position).toEqual({x:1, y:1});
      expect(unit.state).toEqual("idle");
    });

    it("should not be able to move if state is dead", function() {
      unit.setState("dead");
      unit.setDestination({x:1, y:1});
      updateAll();
      expect(unit.position).toEqual({x:0, y:0});
    });

    it("should not reach a distant destination in a single movement", function() {
      unit.setDestination({x:3, y:1});
      updateAll();
      expect(unit.position).not.toEqual({x:0, y:0});
      expect(unit.position).not.toEqual({x:3, y:1});
      expect(unit.state).toEqual("moving");
      updateAll();
      expect(unit.position).toEqual({x:3, y:1});
      expect(unit.state).toBe("idle");
    });

    it("should not be able to traverse an impassible space", function() {
      map.setTerrain(new Terrain({x:-1, y:-1}));
      unit.setDestination({x:-1, y:-1});
      updateAll();
      expect(unit.position).not.toEqual({x:-1, y:-1});
    });
  });

  describe("attack", function() {

    beforeEach(function() {
      map = new GameMap();
      unit = new Unit("idle", {x:0, y:0}, map);
      enemy = new Unit("idle", {x:1, y:0}, map);
      units = [unit, enemy];
    });

    it("should attack an adjacent enemy succesfully", function() {
      unit.setTarget(enemy);
      updateAll();
      expect(unit.state).toBe("attacking");
      updateAll();
      expect(unit.state).toBe("attacking");
      expect(enemy).toBeDamaged();
      expect(enemy.state).toBe("underAttack");
    });

    it("should move closer to the enemy if it is not adjacent", function() {
      enemy.position = ({x:2, y:0});
      unit.setTarget(enemy);
      updateAll();
      expect(enemy).not.toBeDamaged();
      expect(unit.state).toBe("closingDistance");
      expect(enemy.state).toBe("idle");
    });

    it("should attack the enemy once in range", function() {
      enemy.position = ({x:2, y:0});
      unit.setTarget(enemy);
      updateAll();
      expect(unit.state).toBe("closingDistance");
      expect(enemy).not.toBeDamaged();
      updateAll();
      expect(enemy).not.toBeDamaged();
      expect(unit.state).toBe("attacking");
      updateAll();
      expect(enemy.state).toBe("idle");
      expect(enemy).not.toBeDamaged();
      expect(unit.state).toBe("attacking");
      updateAll();
      expect(enemy).toBeDamaged();
      expect(enemy.state).toBe("underAttack");
    });

    // it("should continue attacking until the enemy is dead", function() {
    //   unit.setTarget(enemy);
    // });

    it("should travel to the enemy's new position and attack if the enemy moves", function() {
      unit.setTarget(enemy);
      updateAll();
      expect(unit).toBeInRange();
      enemy.setDestination({x:4, y:2});
      updateAll();
      expect(unit).not.toBeInRange();
      updateAll();
      expect(unit).not.toBeInRange();
      enemy.setDestination({x:1, y:-1});
      updateAll();
      expect(unit).not.toBeInRange();
      updateAll();
      expect(unit).not.toBeInRange();
      updateAll();
      expect(unit).toBeInRange();
    });
    
    it("should not cause the unit to overlap the enemy", function() {
      enemy.position = {x:2, y:0};
      unit.setTarget(enemy);
      expect(unit).not.toBeInRange();
      updateAll();
      updateAll();
      expect(unit).toBeInRange();
      expect(unit.position).not.toEqual(enemy.position);
    });
  });

});
