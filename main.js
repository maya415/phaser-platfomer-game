import "./style.css";


import Phaser, { Game } from "phaser";

let config = {
  type: Phaser.AUTO,
  width: 844,
  height: 723,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);

let cursors;
let purpleGuy;
let platforms1;
let platforms2;
let platforms3;
let platforms4;
let platforms5;
let rocks;
let run_noise;
let jump_noise;
let strike_noise;
let isRunning;
let isJumping;
let isAttacking;
let oranges;
let strawberries;
let cherries;
let blackberries;
let dragonfruits;
let scoreText;
let score = 0;
let gameOver = false;

function preload() {
  // load background image
  this.load.image("background", "./assets/background/background.png");

  // load icons
  this.load.image("strawberry", "./assets/collectables/icons/strawberry.png");
  this.load.image("cherry", "./assets/collectables/icons/cherry.png");
  this.load.image("orange", "./assets/collectables/icons/orange.png");
  this.load.image("blackberry", "./assets/collectables/icons/blackberry.png");
  this.load.image("dragonfruit", "./assets/collectables/icons/dragonfruit.png");
  this.load.image("star", "./assets/collectables/icons/star.png");
  this.load.image("rock", "./assets/collectables/icons/Rock2.png");

  // load platforms
  this.load.image("floor-platform", "/assets/platforms/floor-platform.png");

  this.load.image("2-block", "./assets/platforms/2-block-platform.png");
  this.load.image("3-block", "./assets/platforms/3-block-platform.png");
  this.load.image("9-block", "./assets/platforms/9-block-platform.png");
  this.load.image("16-block", "./assets/platforms/16-block-platform.png");

  this.load.image(
    "3-block-single",
    "./assets/platforms/3-block-single-platform.png"
  );
  this.load.image(
    "6-block-single",
    "./assets/platforms/6-block-single-platform.png"
  );
  this.load.image(
    "9-block-single",
    "./assets/platforms/9-block-single-platform.png"
  );
  this.load.image(
    "16-block-single",
    "./assets/platforms/16-block-single-platform.png"
  );

  // load spritesheets
  this.load.spritesheet(
    "still",
    "./assets/sprite/spritesheets/Pink_Monster.png",
    {
      frameWidth: 32,
      frameHeight: 32,
    }
  );
  this.load.spritesheet(
    "attack",
    "./assets/sprite/spritesheets/Pink_Monster_Attack2_6.png",
    {
      frameWidth: 32,
      frameHeight: 32,
    }
  );
  this.load.spritesheet(
    "idle",
    "./assets/sprite/spritesheets/Pink_Monster_Idle_4.png",
    {
      frameWidth: 32,
      frameHeight: 32,
    }
  );
  this.load.spritesheet(
    "walk",
    "./assets/sprite/spritesheets/Pink_Monster_Walk_6.png",
    {
      frameWidth: 32,
      frameHeight: 32,
    }
  );
  this.load.spritesheet(
    "run",
    "./assets/sprite/spritesheets/Pink_Monster_Run_6.png",
    {
      frameWidth: 32,
      frameHeight: 32,
    }
  );
  this.load.spritesheet(
    "jump",
    "./assets/sprite/spritesheets/Pink_Monster_Jump_8.png",
    {
      frameWidth: 32,
      frameHeight: 32,
    }
  );
  this.load.spritesheet(
    "die",
    "./assets/sprite/spritesheets/Pink_Monster_Death_8.png",
    {
      frameWidth: 32,
      frameHeight: 32,
    }
  );

  // load audios

  this.load.audio("feet", "./assets/sprite/sprite_audios/feet.ogg");
  this.load.audio("jump", "./assets/sprite/sprite_audios/jump.wav");
  this.load.audio("strike", "./assets/sprite/sprite_audios/strike.ogg");

  cursors = this.input.keyboard.createCursorKeys();
}

function create() {
  this.add.image(422, 361.5, "background");

  // platforms

  platforms1 = this.physics.add.staticGroup();
  platforms2 = this.physics.add.staticGroup();
  platforms3 = this.physics.add.staticGroup();
  platforms4 = this.physics.add.staticGroup();
  platforms5 = this.physics.add.staticGroup();

  platforms1.create(422, 698, "floor-platform").refreshBody();
  platforms2.create(730, 570, "9-block").refreshBody();
  platforms2.create(193, 570, "16-block").refreshBody();
  platforms2.create(540, 474, "9-block-single").refreshBody();
  platforms3.create(210, 455, "9-block").refreshBody();
  // platforms3.create(492, 396, "3-block-single").refreshBody();
  platforms3.create(744, 396, "6-block-single").refreshBody();
  platforms3.create(436, 320, "16-block-single").refreshBody();
  platforms3.create(36, 360, "3-block").refreshBody();
  platforms4.create(650, 216, "16-block").refreshBody();
  platforms4.create(108, 216, "9-block").refreshBody();
  platforms4.create(326, 154, "3-block-single").refreshBody();
  platforms5.create(804, 100, "3-block").refreshBody();
  platforms5.create(600, 96, "9-block").refreshBody();
  platforms5.create(156, 96, "9-block-single").refreshBody();

  purpleGuy = this.physics.add.sprite(36, 665, "still").setScale(1.5);
  purpleGuy.setBounce(0.1);
  purpleGuy.setCollideWorldBounds(true);

  oranges = this.physics.add.group({
    key: "orange",
    repeat: 10,
    // creates 1 automatically, the repeats this 11 times, so creates 12 stars altogether
    setXY: { x: 72, y: 0, stepX: 70 },
    //   the first child will be positioned at 12 x 0, the second one is 70 pixels on from that at 82 x 0, the third one is at 152 x 0, and so on
  });

  oranges.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.6));
    //   all starts are spawned at top of game and drop down, (colliding with the relevant platforms thanks to the collider), and having some random amount of bounce between 0.4 and 0.8
  });

  strawberries = this.physics.add.group({
    key: "strawberry",
    repeat: 10,
    // creates 1 automatically, the repeats this 11 times, so creates 12 stars altogether
    setXY: { x: 60, y: 0, stepX: 75 },
    //   the first child will be positioned at 12 x 0, the second one is 70 pixels on from that at 82 x 0, the third one is at 152 x 0, and so on
  });

  strawberries.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.6));
    //   all starts are spawned at top of game and drop down, (colliding with the relevant platforms thanks to the collider), and having some random amount of bounce between 0.4 and 0.8
  });

  blackberries = this.physics.add.group({
    key: "blackberry",
    repeat: 8,
    // creates 1 automatically, the repeats this 11 times, so creates 12 stars altogether
    setXY: { x: 50, y: 0, stepX: 90 },
    //   the first child will be positioned at 12 x 0, the second one is 70 pixels on from that at 82 x 0, the third one is at 152 x 0, and so on
  });

  blackberries.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.6));
    //   all starts are spawned at top of game and drop down, (colliding with the relevant platforms thanks to the collider), and having some random amount of bounce between 0.4 and 0.8
  });

  cherries = this.physics.add.group({
    key: "cherry",
    repeat: 5,
    // creates 1 tomatically, the repeats this 11 times, so creates 12 stars altogether
    setXY: { x: 40, y: 0, stepX: 140 },
    //   the first child will be positioned at 12 x 0, the second one is 70 pixels on from that at 82 x 0, the third one is at 152 x 0, and so on
  });

  cherries.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.6));
    //   all starts are spawned at top of game and drop down, (colliding with the relevant platforms thanks to the collider), and having some random amount of bounce between 0.4 and 0.8
  });

  dragonfruits = this.physics.add.group({
    key: "dragonfruit",
    repeat: 5,
    // creates 1 automatically, the repeats this 11 times, so creates 12 stars altogether
    setXY: { x: 50, y: 0, stepX: 150 },
    //   the first child will be positioned at 12 x 0, the second one is 70 pixels on from that at 82 x 0, the third one is at 152 x 0, and so on
  });

  dragonfruits.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.6));
    //   all starts are spawned at top of game and drop down, (colliding with the relevant platforms thanks to the collider), and having some random amount of bounce between 0.4 and 0.8
  });

  rocks = this.physics.add.group();

  // this.physics.add.overlap(
  //   purpleGuy,
  //   [oranges, strawberries, blackberries, cherries, dragonfruits],
  //   collect,
  //   null,
  //   this
  // );

  this.physics.add.overlap(purpleGuy, oranges, check, collectOrange, this)
  this.physics.add.overlap(purpleGuy, strawberries, check, collectStrawberry, this)
  this.physics.add.overlap(purpleGuy, blackberries, check, collectBlackberry, this)
  this.physics.add.overlap(purpleGuy, cherries, check, collectCherry, this)
  this.physics.add.overlap(purpleGuy, dragonfruits, check, collectDragonfruit, this)
  // this.physics.add.overlap(purpleGuy, strawberries, collectStrawberry, null, this)
  // this.physics.add.overlap(purpleGuy, blackberries, collectBlackberry, null, this)
  // this.physics.add.overlap(purpleGuy, cherries, collectCherry, null, this)
  // this.physics.add.overlap(purpleGuy, dragonfruits, collectDragonfruit, null, this)


  this.physics.add.collider(purpleGuy, rocks, hitRock, null, this);

  scoreText = this.add.text(16, 16, "score: 0", {
    fontSize: "32px",
    fill: "#ffffff",
  });
  // 'score: 0' is the default text to display

  this.physics.add.collider(purpleGuy, [platforms1, platforms2, platforms3, platforms4, platforms5]);
  this.physics.add.collider(rocks, [platforms1, platforms2, platforms4]);


  // allows fruits to occupy all platforms
  this.physics.add.collider(oranges, platforms1);
  this.physics.add.collider(strawberries, [platforms1,platforms2]);
  this.physics.add.collider(blackberries, [platforms1,platforms3]);
  this.physics.add.collider(cherries, [platforms1,platforms4]);
  this.physics.add.collider(dragonfruits, [platforms4,platforms5]);

  //create audios
  run_noise = this.sound.add("feet");
  jump_noise = this.sound.add("jump");
  strike_noise = this.sound.add("strike");

  // create some animations:

  // going right in walk png
  this.anims.create({
    key: "walk",
    frameRate: 25,
    repeat: -1,
    frames: this.anims.generateFrameNumbers("walk", { start: 1, end: 6 }),
  });

  this.anims.create({
    key: "run",
    frameRate: 25,
    repeat: -1,
    frames: this.anims.generateFrameNumbers("run", { start: 1, end: 6 }),
  });

  this.anims.create({
    key: "idle",
    frameRate: 12,
    repeat: -1,
    frames: this.anims.generateFrameNumbers("idle", { start: 1, end: 4 }),
  });

  this.anims.create({
    key: "jump",
    frameRate: 25,
    repeat: -1,
    frames: this.anims.generateFrameNumbers("jump", { start: 1, end: 8 }),
  });

  this.anims.create({
    key: "attack",
    frameRate: 15,
    repeat: -1,
    frames: this.anims.generateFrameNumbers("attack", { start: 1, end: 6 }),
  });

  this.anims.create({
    key: "die",
    frameRate: 8,
    repeat: 1,
    frames: this.anims.generateFrameNumbers("die", { start: 1, end: 8 }),
  });
}

function update() {
  if (gameOver) {
    scoreText.setText('Game Over');
    return;
  }
  if (cursors.left.isDown) {
    // this.anims.pauseAll();
    isRunning = true;
    isJumping = false;
    isAttacking = false;
    purpleGuy.setVelocityX(-200);
    purpleGuy.flipX = true;
    purpleGuy.anims.play("walk", true);
  } else if (cursors.right.isDown) {
    // this.anims.pauseAll();
    isRunning = true;
    isJumping = false;
    isAttacking = false;
    purpleGuy.setVelocityX(200);
    purpleGuy.flipX = false;
    purpleGuy.anims.play("walk", true);
  } else if (cursors.up.isDown) {
    // this.anims.pauseAll();
    isJumping = true;
    isRunning = false;
    isAttacking = false;
    purpleGuy.setVelocityY(-100);
    purpleGuy.anims.play("jump", true);
  } else if (cursors.space.isDown) {
    // this.anims.pauseAll();
    isAttacking = true;
    isRunning = false;
    isJumping = false;
    purpleGuy.anims.play("attack", true);
  } else {
    // this.anims.pauseAll();
    isRunning = false;
    isJumping = false;
    isAttacking = false;
    purpleGuy.setVelocityX(0);
    purpleGuy.anims.play("idle", true);
  }

  if (isRunning && !run_noise.isPlaying) {
    run_noise.play();
  }

  if (!isRunning && run_noise.isPlaying) {
    run_noise.stop();
  }

  if (isJumping && !jump_noise.isPlaying) {
    jump_noise.play();
  }

  if (!isJumping && jump_noise.isPlaying) {
    jump_noise.stop();
  }

  if (isAttacking && !strike_noise.isPlaying) {
    strike_noise.play();
  }

  if (!isAttacking && strike_noise.isPlaying) {
    strike_noise.stop();
  }
}

function check (){
  if (oranges.countActive(true) === 0 && strawberries.countActive(true) === 0 && blackberries.countActive(true) === 0 && cherries.countActive(true) === 0 && dragonfruits.countActive(true) === 0) {
    //  A new batch of stars to collect
    oranges.children.iterate(function (child) {
      child.enableBody(true, child.x, 0, true, true);
    });
    strawberries.children.iterate(function (child) {
      child.enableBody(true, child.x, 0, true, true);
    });
    blackberries.children.iterate(function (child) {
      child.enableBody(true, child.x, 0, true, true);
    });
    cherries.children.iterate(function (child) {
      child.enableBody(true, child.x, 0, true, true);
    });
    dragonfruits.children.iterate(function (child) {
      child.enableBody(true, child.x, 0, true, true);
    });


    let x = (purpleGuy.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
    let rock = rocks.create(x, 16, 'rock');
    rock.setBounce(1);
    rock.setCollideWorldBounds(true);
    rock.setVelocity(Phaser.Math.Between(-200, 200), 20);
    rock.allowGravity = false;
  }
}



function collectOrange(purpleGuy, orange) {
  orange.disableBody(true, true);
  score += 5;
  scoreText.setText("Score: " + score);
  return true;

}


function collectStrawberry(purpleGuy, strawberry) {
  strawberry.disableBody(true, true);
  score += 10;
  scoreText.setText("Score: " + score);
  return true;
  
}


function collectBlackberry(purpleGuy, blackberry) {
  blackberry.disableBody(true, true);
  score += 15;
  scoreText.setText("Score: " + score);
  return true;

}


function collectCherry(purpleGuy, cherry) {
  cherry.disableBody(true, true);
  score += 20;
  scoreText.setText("Score: " + score);
  return true;

}


function collectDragonfruit(purpleGuy, dragonfruit) {
  dragonfruit.disableBody(true, true);
  score += 25;
  scoreText.setText("Score: " + score);
  return true;

 
}

function hitRock (purpleGuy, rock)
{
    this.physics.pause();
    purpleGuy.setTint(0xff0000);
    purpleGuy.anims.play('die');
    gameOver = true;
}


