function Action(action, completionConditions, resultState) {
  this.action = action;
  this.conditions = completionConditions;
  this.resultState = resultState;
}

Action.prototype.checkConditions = function(args) {
  return this.conditions(...args);
};

module.exports = Action;