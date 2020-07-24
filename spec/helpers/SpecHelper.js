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
});