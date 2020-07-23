describe("Unit", function() {
  var Unit = require('../lib/Unit');
  var unit;

  describe("setDestination", function() {

    beforeEach(function() {
      unit = new Unit("idle", {x:0, y:0});
    });
  
    afterEach(function() {
      unit = new Unit("idle", {x:0, y:0});
    });
    
    it("should be able to move if state is not dead", function() {
      unit.setDestination({x:1, y:1});
      unit.performAction();
      expect(unit.position).toEqual({x:1, y:1});
      expect(unit.state).toEqual("idle");
    });

    it("should not be able to move if state is dead", function() {
      unit.setState("dead");
      unit.setDestination({x:1, y:1});
      unit.performAction();
      expect(unit.position).toEqual({x:0, y:0});
    })

    it("should not reach a distant destination in a single movement", function() {
      unit.setDestination({x:2, y:1});
      unit.performAction();
      expect(unit.position).not.toEqual({x:0, y:0});
      expect(unit.position).not.toEqual({x:2, y:1});
      expect(unit.state).toEqual("moving");
      unit.performAction();
      expect(unit.position).toEqual({x:2, y:1});
      expect(unit.state).toEqual("idle");
    })
  });

  // it("should be able to play a Song", function() {
  //   player.play(song);
  //   expect(player.currentlyPlayingSong).toEqual(song);

  //   //demonstrates use of custom matcher
  //   expect(player).toBePlaying(song);
  // });

  // describe("when song has been paused", function() {
  //   beforeEach(function() {
  //     player.play(song);
  //     player.pause();
  //   });

  //   it("should indicate that the song is currently paused", function() {
  //     expect(player.isPlaying).toBeFalsy();

  //     // demonstrates use of 'not' with a custom matcher
  //     expect(player).not.toBePlaying(song);
  //   });

  //   it("should be possible to resume", function() {
  //     player.resume();
  //     expect(player.isPlaying).toBeTruthy();
  //     expect(player.currentlyPlayingSong).toEqual(song);
  //   });
  // });

  // // demonstrates use of spies to intercept and test method calls
  // it("tells the current song if the user has made it a favorite", function() {
  //   spyOn(song, 'persistFavoriteStatus');

  //   player.play(song);
  //   player.makeFavorite();

  //   expect(song.persistFavoriteStatus).toHaveBeenCalledWith(true);
  // });

  // //demonstrates use of expected exceptions
  // describe("#resume", function() {
  //   it("should throw an exception if song is already playing", function() {
  //     player.play(song);

  //     expect(function() {
  //       player.resume();
  //     }).toThrowError("song is already playing");
  //   });
  // });
});
