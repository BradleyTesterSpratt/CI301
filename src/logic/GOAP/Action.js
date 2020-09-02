function Action(action, conditions, effect, cost = 1) {
  this.action = action;
  this.conditions = conditions;
  this.effect = effect;
  this.cost = cost;
}

Action.prototype.checkConditions = function(args) {
  return this.conditions(...args);
};

module.exports = Action;