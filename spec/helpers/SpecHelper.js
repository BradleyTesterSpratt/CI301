beforeEach(function () {
  jasmine.addMatchers({
    toBeDamaged: function () {
      return {
        compare: function (actual, expected) {
          var unit = actual;
          var result = {};
          result.pass = unit.currentHP < unit.health;
          if(result.pass) {
            result.message = "Expected Unit is damaged";
          } else {
            result.message = "Expected Unit is not damaged";
          };
          return result;
        }
      };
    }
  });

  jasmine.addMatchers({
    toBeInRange: function () {
      return {
        compare: function (actual, expected) {
          var unit = actual;
          var result = {};
          result.pass = unit.pointRangeCheck("x") && unit.pointRangeCheck("y");
          if(result.pass) {
            result.message = "Expected Unit at {x: "+ actual.position.x + ", y: " + actual.position.y + "} is in range of {x: " + actual.target.position.x + ", y: " + actual.target.position.y + "}";
          } else {
            result.message = "Expected Unit at {x: "+ actual.position.x + ", y: " + actual.position.y + "} is not in range of {x: " + actual.target.position.x + ", y: " + actual.target.position.y + "}";
          };

          return result;
        }
      };
    }
  });
});