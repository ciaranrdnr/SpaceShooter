export default class SceneMain extends Phaser.Scene {
  constructor() {
    super('SceneMain');
  }
  preload(){
    this.load.audio('bgm', ['assets/audio/bgm.ogg'], 'assests/audio/bgm.wav');
    this.load.audio('jumpfx', ['assets/audio/jump.ogg'], 'assests/audio/jump.wav' );
    // Load images and sounds

    // Area
    this.load.image('bg','assets/playfield/bg.png');
    this.load.image('area', 'assets/playfield/area.png');

    // player
    this.load.spritesheet('player-idle','assets/player/player-idle.png',{frameWidth:80,frameHeight:80});
    this.load.spritesheet('player-run','assets/player/player-run.png',{frameWidth:80,frameHeight:80});
    this.load.spritesheet('player-jump','assets/player/player-jump.png',{frameWidth:80,frameHeight:80});
    this.load.spritesheet('player-shot','assets/player/player-run-shot.png',{frameWidth:80,frameHeight:80});

    //bullet
    this.load.spritesheet('shoot','assets/fx/shot.png',{frameWidth:6,frameHeight:4});

    // enemy
    this.load.spritesheet('monster-idle', 'assets/monster/crab-idle.png',{frameWidth:48, frameHeight:32});
    this.load.spritesheet('monster-walk', 'assets/monster/crab-walk.png',{frameWidth:48, frameHeight:32});


  }
  create(){
    this.score = 0;
    this.timerToActive = 0;
    this.wave = 1;
    this.spawn = 0;
    // Define our objects

    //add area
    this.add.image(0,0,'bg').setOrigin(0,0);
    this.add.image(0,0,'area').setOrigin(0,0);

    //add music
    this.jumpfx = this.sound.add('jumpfx',{
      loop: false
    })
    this.bgm = this.sound.add('bgm',{
      loop: true
    })
    this.bgm.play();
    //add player
    this.player = this.physics.add.sprite(320,300,'player-idle');
    this.player.setGravityY(400);
    this.player.setCollideWorldBounds(true);

    this.player.setSize(32,80);

    //add bullet
    this.bullet = this.physics.add.group();

    //add enemy group (ada banyak monster)
    this.monsters = this.physics.add.group();

    //check shooting
    this.isShooting = false;
    //add floor tengah
    this.floor1 = this.physics.add.sprite(0,480).setOrigin(0,0);
    this.floor1.setCollideWorldBounds(true);
    this.floor1.displayWidth = 640;
    this.floor1.displayHeight = 60;
    this.floor1.body.immovable = true;

    //add floor kiri
    this.floor2 = this.physics.add.sprite(0,480).setOrigin(0,0);
    this.floor2.setCollideWorldBounds(true);
    this.floor2.displayWidth = 100;
    this.floor2.displayHeight = 150;
    this.floor2.body.immovable = true;

    //add floor kanan
    this.floor3 = this.physics.add.sprite(640,480).setOrigin(0,0);
    this.floor3.setCollideWorldBounds(true);
    this.floor3.displayWidth = 80;
    this.floor3.displayHeight = 150;
    this.floor3.body.immovable = true;


    //collider object yang bisa tabrakan (kotak warna ungu)
    this.physics.add.collider(this.player, this.floor1);
    this.physics.add.collider(this.player, this.floor2);
    this.physics.add.collider(this.player, this.floor3);

    this.physics.add.collider(this.monsters, this.floor1);
    this.physics.add.collider(this.monsters, this.floor2);
    this.physics.add.collider(this.monsters, this.floor3);

    //overlap
    this.physics.add.overlap(this.bullet, this.monsters, this.enemyDead.bind(this));



    //input key
    this.cursors = this.input.keyboard.createCursorKeys();//ngikutin cursor
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    //animation
    this.anims.create({
      key: 'crab-idle',
      frames: this.anims.generateFrameNumbers('monster-idle',{start: 0, end:3}),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'crab-walk',
      frames: this.anims.generateFrameNumbers('monster-walk',{start: 0, end:3}),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'p-idle',
      frames: this.anims.generateFrameNumbers('player-idle',{start: 0, end:3}),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'p-run',
      frames: this.anims.generateFrameNumbers('player-run',{start: 0, end:3}),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'p-shot',
      frames: this.anims.generateFrameNumbers('player-shot',{start: 0, end:3}),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'p-shoti',
      frames: this.anims.generateFrameNumbers('player-shot',{start: 1, end:3}),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'p-jump',
      frames: this.anims.generateFrameNumbers('player-jump',{start: 0, end:3}),
      frameRate: 10,
      repeat: 0
    });
    this.anims.create({
      key: 'shot',
      frames: this.anims.generateFrameNumbers('shoot',{start: 0, end:3}),
      frameRate: 10,
      repeat: 0
    });
    this.scoreText = this.add.text(16,16, "[Wave 0] SCORE: 0",{
      fontSuze: '40px',
      fill: '#fff'
    });

  }

  enemyDead(bullet, enemy){
      bullet.destroy();
      enemy.destroy();
      this.score += 10;
      console.log("Scores: "+this.score);
      this.scoreText.text = "[Wave "+this.wave+"] Score: "+this.score;
  }

  timeSpawn(timer){
    this.timerToActive--;
    if(this.timerToActive < 0){
      this.spawnEnemy();
      this.timerToActive = timer;

    }
  }

  spawnEnemy(){
    if (this.spawn != this.currentWave(this.wave)) {
      var rand = Phaser.Math.Between(0,1);
      if (rand>0) {
        var crabMonster = this.monsters.create(100,300, 'monster-idle');
        crabMonster.anims.play('crab-walk');
      } else {
        var crabMonster = this.monsters.create(550,300, 'monster-idle');
        crabMonster.anims.play('crab-walk');
      }
    } else if (this.spawn == this.currentWave(this.wave) && this.monsters.countActive(true) == 0) {
      this.wave++;
      this.spawn = 0;
    }
    this.spawn++;
  }

  currentWave(wave){
    switch (wave) {
      case 1:
        return 5;
      case 2:
        return 7;
      case 3:
        return 10;
    }
  }
  doShot(arah){

    if(this.isShooting == false){
      if(arah==true){
        var peluru = this.bullet.create(this.player.x -20, this.player.y +15, 'shoot');
        peluru.anims.play('shot');
        peluru.body.setVelocityX(-450);
      }else{
        var peluru = this.bullet.create(this.player.x +20, this.player.y +15, 'shoot');
        peluru.anims.play('shot');
        peluru.body.setVelocityX(450);
      }
      this.isShooting = true;
      this.time.addEvent({
        delay: 250,
        callback:() => {
          this.isShooting = false;
        }
      });
    }
  }

  update(){ // 60x perdetik
    this.timeSpawn(180);
    if(!this.player.body.touching.down){
      if(this.cursors.left.isDown){
        this.player.flipX = true;
        this.player.setVelocityX(-160);
        this.player.anims.play('p-run', true);
      }else if(this.cursors.right.isDown){
        this.player.flipX = false;
        this.player.setVelocityX(160);
        this.player.anims.play('p-run', true);
      }else{
        this.player.setVelocityX(0);
        this.player.anims.play('p-idle',true);
          }
    }else if(this.spaceKey.isDown && this.player.body.touching.down){
        if(this.cursors.left.isDown){
          this.player.flipX = true;
          this.player.setVelocityX(-160);
          this.player.anims.play('p-shot', true);
        }else if(this.cursors.right.isDown){
          this.player.flipX = false;
          this.player.setVelocityX(160);
          this.player.anims.play('p-shot', true);
        }else{
          this.player.setVelocityX(0);
          this.player.anims.play('p-shoti',true);
        }
        this.doShot(this.player.flipX);
    }else{
        if(this.cursors.left.isDown){
          this.player.flipX = true;
          this.player.setVelocityX(-160);
          this.player.anims.play('p-run', true);
        }else if(this.cursors.right.isDown){
          this.player.flipX = false;
          this.player.setVelocityX(160);
          this.player.anims.play('p-run', true);
        }else{
          this.player.setVelocityX(0);
          this.player.anims.play('p-idle',true);
        }
      }

      //jump
      if(this.cursors.up.isDown && this.player.body.touching.down){
        this.jumpfx.play();
         this.player.flipX = true;
         this.player.setVelocityY(-400);
         this.player.anims.play('p-jump', true);
       }

      //monster
      this.monsters.children.each(enemy => {
        if (this.player.x < enemy.x) {
          enemy.body.setGravityY(400);
          enemy.flipX = false;
          enemy.setVelocityX(-30);
        }else{
          enemy.body.setGravityY(400);
          enemy.flipX = true;
          enemy.setVelocityX(30);
        }
      })
    }

  }
