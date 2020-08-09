function State(state, validActions) {
  this.state = state;
  this.validActions = validActions;
}

State.prototype.selectAction = function(desiredState) {
  var action = null;
  this.validActions.forEach (validAction => {
    if(validAction.resultState == desiredState) {
      action = validAction;
    };
  });
  return action;
}

module.exports = State;