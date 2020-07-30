/**
 * class as provided in example
 * not removed as it would be used for a future update
 */
class Audio {
  constructor(game) {
  }
}

class Input {
  constructor(game) {
    this.game = game;
    this.keyMap = new Map();
  }

  add(key, action) {
    this.keyMap.set(this.game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[key]), action);
  }

  leftClick(action) {
    this.keyMap.set(this.game.input.activePointer, action);
  }
  
  update() {
    for (const [key, action] of this.keyMap.entries()) {
      if (key.isDown) {
        action();
      }
    }
  }
}

class Constants {
  static colour = {
    white:  0xffffff,
    blue:   0x00ffff,
    red:    0xff0000,
    yellow: 0xffff00,
    pink:   0x936999,
    green:  0x00FF00,
    black:  0x444444
  }
}

// class UI {
//   constructor(game, mapSize) {
//     this.startGameText = game.add.text(mapSize.x / 2, 
//       mapSize.y / 2, 
//       'Default Controls\n\nSPACE to Start\nW to move Up\nS to move Down\nA to move Left\nD to move Right\nP to zoom out', 
//       {
//       font: '200px Arial',
//       fill: 'white'
//     });
//     this.startGameText.setOrigin(0.5, 0.5);
//     this.startGameText.setDepth(100);
//     this.ghostsText = game.add.text(0, -30, 'Ghosts Present: 0', {
//       font: '34px Arial',
//       fill: '#fff'
//     });
//     this.ghostsText.setDepth(100);
//     //setScrollFactor keeps the text following the camera.
//     this.ghostsText.setScrollFactor(0);
//     this.gatesText = game.add.text(0, -5, 'Open Gates: 0', {
//       font: '34px Arial',
//       fill: '#fff'
//     });
//     this.gatesText.setDepth(100);
//     this.gatesText.setScrollFactor(0);
//   }

//   updateGhostsText(newCount) {
//     this.ghostsText.setText('Ghosts Present: ' + newCount);
//   }

//   updateGatesText(newCount) {
//     this.gatesText.setText('Open Gates: ' + newCount);
//   }

//   showStartText() {
//     this.startGameText.visible = true;
//     this.gatesText.visible = false;
//     this.ghostsText.visible = false;
//   }

//   disableStartText() {
//     this.startGameText.visible = false;
//     this.gatesText.visible = true;
//     this.ghostsText.visible = true;
//   }
// }