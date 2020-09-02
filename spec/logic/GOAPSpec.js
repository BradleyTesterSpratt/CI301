describe("State", function() {
  var State = require('../../src/logic/GOAP/State');
  var Action = require('../../src/logic/GOAP/Action');
  
  var move = new Action("move", function(x1, y1, x2, y2) {return (x1 == x2 && y1 == y2);}, "idle");
  var attack = new Action("action", function() {}, "attacking");
  var idle = new State("idle", ["move", "attack"]);
  var dead = new State("dead", []);

  describe("selectAction", function() {
    beforeEach(function() {
      
    });

    it("should return an action to use if it is valid and provides the desired result", function() {
      expect(idle.selectAction("idle")).toBe(move);
    });

    it("should not return an action to use if it is invalid and provides the desired result", function() {
      expect(dead.selectAction("move")).toBe(null);
    });
  });

});

describe("Action", function() {
  var Action = require('../../src/logic/GOAP/Action');

  var move;

  describe("checkConditions", function() {
    beforeEach(function() {
      conditionsCallback = jasmine.createSpy('conditionsCallback');
      // move = new Action("move", conditionsCallback, "idle")
      move = new Action("move", function(x1, y1, x2, y2) { return (x1 == x2 && y1 == y2); }, "idle");
    });

    it("given required arguements return a result", function() {
      // expect(move.checkConditions).toHaveBeenCalledWith(1, 2, 3, 4);
      var result = move.checkConditions([1,2,3,4]);
      expect(result).toBe(typeof variable === "boolean");
    });
  });

});

describe("Multiple States", function() {
  var State = require('../../src/logic/GOAP/State');
  var Action = require('../../src/logic/GOAP/Action');

  var idle = new State("idle", ["attack", "move"]);
  var attacking = new State("attacking", ["attack"]);
  var moving = new State("moving", ["attack"]);
  var dead = new State("dead", []);

  var attack = new Action("attack", [target.inRange, target.currentHP > 0], target.takeDamage);
  var move = new Action("move", [position!= destination], position === destination);

})
