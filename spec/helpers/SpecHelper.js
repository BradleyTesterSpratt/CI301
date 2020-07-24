beforeEach(function () {
  jasmine.addMatchers({
    toBeDamaged: function () {
       return {
         compare: function (actual, expected) {
           var unit = actual;

           return {
             pass: unit.currentHP < unit.health
           }
        }
      };
    }
  });

  jasmine.addMatchers({
    toBeInRange: function () {
       return {
         compare: function (actual, expected) {
           var unit = actual;

           return {
             pass: unit.pointRangeCheck("x") && unit.pointRangeCheck("y")
           }
        }
      };
    }
  });
});