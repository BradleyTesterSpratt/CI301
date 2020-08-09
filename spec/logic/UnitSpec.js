describe("Unit", function() {
  var Unit = require('../../src/logic/Unit');
  var GameMap = require('../../src/logic/GameMap');
  var Terrain = require('../../src/logic/Terrain');
  var map;
  var unit;
  var enemy;
  
  //use this to simulate the update loop.
  var updateAll = function() {
    map.updateOccupiedTerrain();
    map.unitList.forEach(unit => {
      unit.performAction();
    });
  }

  describe("pointRangeCheck", function() {
    beforeEach(function() {
      map = new GameMap(13,13);
      unit = new Unit({x:2, y:1}, map);
    });

    it("should return false if the target is not in range", function() {
      enemy = new Unit({x:2, y:5}, map);
      unit.setTarget(enemy);
      expect(unit.pointRangeCheck("x")).toBe(true);
      expect(unit.pointRangeCheck("y")).toBe(false);
      expect(unit.inRange()).toBe(false);
    });

    it("should return true if the target is in range", function() {
      enemy = new Unit({x:3, y:1}, map);
      unit.setTarget(enemy);
      expect(unit.pointRangeCheck("x")).toBe(true);
      expect(unit.pointRangeCheck("y")).toBe(true);
      expect(unit.inRange()).toBe(true);
    });

    it("should return false if the target is not in range and a point is negative", function() {
      enemy = new Unit({x:1, y:-1}, map);
      unit.setTarget(enemy);
      expect(unit.pointRangeCheck("x")).toBe(true);
      expect(unit.pointRangeCheck("y")).toBe(false);
      expect(unit.inRange()).toBe(false);
    });

  });

  describe("setDestination", function() {

    beforeEach(function() {
      map = new GameMap(13,13);
      unit = new Unit({x:0, y:0}, map);
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
      map.addTerrain(new Terrain(map.grid, {x:1, y:1}, false));
      unit.setDestination({x:1, y:1});
      updateAll();
      expect(unit.position).not.toEqual({x:1, y:1});
    });

    // pathfinding doesn't support negative positions
    // it("should be able to move to a negative position", function() {
    //   unit.position = {x:2, y:1};
    //   updateAll();
    //   unit.setDestination({x:-1, y:-1});
    //   updateAll();
    //   expect(unit.position).not.toEqual({x:-1, y:-1});
    //   updateAll();
    //   expect(unit.position).toEqual({x:-1, y:-1});
    // });

    // it("should not be confused when moving between adjacent positive and negative positions", function() {
    //   unit.position = {x:2, y:1};
    //   updateAll();
    //   unit.setDestination({x:1, y:-1});
    //   updateAll();
    //   expect(unit.position).not.toBe({x:2, y:1});
    // });

    it("should return the closest non-out of bounds position if the requested destination is out of bounds", function() {
      unit.setDestination({x:-1, y:-1});
      expect(unit.destination).not.toBe({x:-1, y:-1});
    });
  });

  describe("attack", function() {

    beforeEach(function() {
      map = new GameMap(13,13);
      unit = new Unit({x:0, y:0}, map);
      enemy = new Unit({x:1, y:0}, map);
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
      updateAll();
      unit.setTarget(enemy);
      updateAll();
      expect(unit.state).toBe("closingDistance");
      expect(enemy.state).not.toBe("underAttack");
      expect(enemy).not.toBeDamaged();
      updateAll();
      expect(enemy).not.toBeDamaged();
      expect(enemy.state).not.toBe("underAttack");
      expect(unit.state).toBe("idle");
      updateAll();
      expect(enemy).not.toBeDamaged();
      expect(enemy.state).not.toBe("underAttack");
      expect(unit.state).toBe("attacking");
      updateAll();
      expect(enemy).toBeDamaged();
      expect(unit.state).toBe("attacking");
      expect(enemy.state).toBe("underAttack");
    });

    it("should continue attacking until the enemy is dead", function() {
      unit.setTarget(enemy);
      updateAll();
      expect(enemy.currentHP).toBe(5);
      expect(unit.state).toBe("attacking");
      updateAll();
      expect(enemy.currentHP).toBe(4);
      expect(unit.state).toBe("attacking");
      updateAll();
      expect(enemy.currentHP).toBe(4);
      expect(unit.state).toBe("attacking");
      updateAll();
      expect(enemy.currentHP).toBe(4);
      expect(unit.state).toBe("attacking");
      updateAll();
      expect(enemy.currentHP).toBe(4);
      expect(unit.state).toBe("attacking");
      updateAll();
      expect(enemy.currentHP).toBe(3);
      expect(unit.state).toBe("attacking");
      updateAll();
      expect(enemy.currentHP).toBe(3);
      expect(unit.state).toBe("attacking");
      updateAll();
      expect(enemy.currentHP).toBe(3);
      expect(unit.state).toBe("attacking");
      updateAll();
      expect(enemy.currentHP).toBe(3);
      expect(unit.state).toBe("attacking");
      updateAll();
      expect(enemy.currentHP).toBe(2);
      expect(unit.state).toBe("attacking");
      updateAll();
      expect(enemy.currentHP).toBe(2);
      expect(unit.state).toBe("attacking");
      updateAll();
      expect(enemy.currentHP).toBe(2);
      expect(unit.state).toBe("attacking");
      updateAll();
      expect(enemy.currentHP).toBe(2);
      expect(unit.state).toBe("attacking");
      updateAll();
      expect(enemy.currentHP).toBe(1);
      expect(unit.state).toBe("attacking");
      updateAll();
      expect(enemy.currentHP).toBe(1);
      expect(unit.state).toBe("attacking");
      updateAll();
      expect(enemy.currentHP).toBe(1);
      expect(unit.state).toBe("attacking");
      updateAll();
      expect(enemy.currentHP).toBe(1);
      expect(unit.state).toBe("attacking");
      updateAll();
      expect(enemy.currentHP).toBe(0);
      expect(unit.target).not.toBe(enemy);
      expect(unit.state).toBe("idle");
    });

    it("should travel to the enemy's new position and attack if the enemy moves", function() {
      enemy.position = ({x:2, y:0});
      unit.setTarget(enemy);
      updateAll();
      expect(unit).not.toBeInRange();
      enemy.setDestination({x:4, y:2});
      updateAll();
      expect(unit).not.toBeInRange();
      updateAll();
      expect(unit).not.toBeInRange();
      enemy.setDestination({x:1, y:0});
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
