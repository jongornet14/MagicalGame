class Character {

  //instantiate
  constructor(x,y) {

    //object image
    this.imageLeft = monkeyLeft;
    this.imageRight = monkeyRight;

    this.currentImage = this.imageLeft;

    //Alive
    this.isAlive = true;

    //Position
    this.xPos = x;
    this.yPos = y;

    //Movement
    this.xSpeed = 3;
    this.ySpeed = 3;
    this.direction = 'W';

    //size
    this.sizeX = this.currentImage.width * 0.2;
    this.sizeY = this.currentImage.height * 0.2;

    this.leftSide   = this.xPos - (this.sizeX / 2);
    this.rightSide  = this.xPos + (this.sizeX / 2);
    this.topSide    = this.yPos - (this.sizeY / 2);
    this.bottomSide = this.yPos + (this.sizeY / 2);

    //meters
    this.magicLimit = 250;
    this.magicMeter = this.magicLimit;

    this.health = 100;
    
    // Damage cooldown to prevent rapid damage
    this.damageCooldown = 0;
    this.damageCooldownLimit = 30; // 30 frames of invincibility after taking damage

    //weapons

    //electricity
    this.projectiles = [];

    //fire
    this.fireLimit = 100;
    this.fireTime = 0;
    this.fireArray = [];

    //time
    this.timeIsStopped = false;
    this.stoppedTimeLimit = 1000;
    this.timeLimit = 0;


    //teleportation
    this.teleportLength = 150;
    this.teleportLimit  = 100;
    this.teleportTime   = 0;

    this.teleportDirection = 'N';

    //time change
    this.inPresent = true;
    this.changeTimeLimit = 100;
    this.futureTimeLimit = 1000;
    this.futureTime = 0;
    this.changeTimeMeter = 0;

    //sounds
    this.teleportSound = teleport;
    this.changeTimelinesSound = changeTimelines;
    this.stopTimeSound = stopTime;
    this.explodeFireSound = explodeFire;
    this.shootElectricitySound = shootElectricity;

    //electricity envelope flag allows a "press and hold effect" for the sound
    this.electricityEnvelopeFlag = 0;

    this.restart = false;
  }

  //movement

  //move direction, this has NSEW to track where to teleport
  moveLeft()  { this.teleportDirection = 'W'; this.direction = 'W'; this.xPos -= this.xSpeed; }
  moveRight() { this.teleportDirection = 'E'; this.direction = 'E'; this.xPos += this.xSpeed; }
  moveUp()    { this.teleportDirection = 'N'; this.yPos -= this.ySpeed; }
  moveDown()  { this.teleportDirection = 'S'; this.yPos += this.ySpeed; }

  //change position
  movePosition() {

    //move and check position
    if (this.yPos > height/3) {
      if (keyIsDown(87)) { this.moveUp(); }
    }
    if (this.yPos < height) {
      if (keyIsDown(83)) { this.moveDown(); }
    }
    if (this.xPos > 0) {
      if (keyIsDown(65)) { this.moveLeft(); }
    }

    if (keyIsDown(68)) { this.moveRight(); }

    //change position
    this.leftSide   = this.xPos - (this.sizeX / 2);
    this.rightSide  = this.xPos + (this.sizeX / 2);
    this.topSide    = this.yPos - (this.sizeY / 2);
    this.bottomSide = this.yPos + (this.sizeY / 2);

  }

  //attacks

  //projectile attacks
  createProjectiles() {

    //electricity
    if(this.magicMeter > 0.1) {
      //shoot electricity
      if(keyIsDown(74)) {
        if (this.electricityEnvelopeFlag == 0) {
          this.shootElectricitySound.play();
        }
        this.electricityEnvelopeFlag++;
        var temp = new Projectiles(this.xPos,this.yPos,this.direction);
        this.projectiles.push(temp);
        this.magicMeter -= 0.1;
      }
      else {
        this.electricityEnvelopeFlag = 0;
        this.shootElectricitySound.stop();
      }
    }

    //fire
    if(this.fireTime == 0) {
      if(this.magicMeter > 10) {
        //shoot fire
        if(keyIsDown(75)) {
          if(keyIsPressed) { //stops sound when key is lifted
            this.explodeFireSound.play();
          }
          this.fireTime = this.fireLimit;
          this.magicMeter -= 10;
          for(var i = 0; i < this.fireLimit; i++ ){
            var temp = new Fire(this.xPos,this.yPos,this.direction);
            this.projectiles.push(temp);
          }
        }
      }
    }
    else {
      this.fireTime--;
    }
  }

  //play electricity sounds
  playElectricitySound() {
    this.electricityEnv.play();
  }

  //stop time
  stopTime() {

    if(this.timeIsStopped == false) {
      if(this.magicMeter > 10) {
        if(keyIsDown(73)) {
          this.stopTimeSound.play();
          this.timeLimit = this.stoppedTimeLimit;
          this.magicMeter -= 10;
        }
      }
    }

  }

  //check if time is stopped
  checkTime() {
    if(this.timeLimit > 0) {
      this.timeIsStopped = true;
      
      // Time stop visual effect
      fill(135, 206, 250, 50);
      rect(0, 0, width, height);
      
      // Time stop indicator
      stroke(255, 255, 255);
      strokeWeight(3);
      fill(0, 0, 0, 150);
      rect(width - 120, 70, 100, 40);
      
      noStroke();
      fill(255, 255, 255);
      textAlign(CENTER);
      textSize(16);
      text('TIME STOP', width - 70, 85);
      textSize(20);
      text(parseInt(this.timeLimit / 100), width - 70, 105);
      
      this.timeLimit--;
    }
    else {
      this.timeIsStopped = false;
    }
  }

  //teleportation
  teleport() {

    if(this.magicMeter > 5) {
      if(this.teleportTime == 0) {
        if(keyIsDown(76)) {
          this.teleportSound.play();
          //for teleporting north, make sure not teleporting over to background
          if( this.teleportDirection == 'N' ) {
            if( this.yPos - this.teleportLength > height / 3) {
              this.yPos -= this.teleportLength;
            }
            else {
              this.yPos = height / 3;
            }
          }
          if( this.teleportDirection == 'S' ) { this.yPos += this.teleportLength; }
          if( this.teleportDirection == 'W' ) { this.xPos -= this.teleportLength; }
          if( this.teleportDirection == 'E' ) { this.xPos += this.teleportLength; }
          this.magicMeter -= 5;
          this.teleportTime = this.teleportLimit;

        }
      }
      else {
        this.teleportTime--;
      }

    }
  }

  //change time periods
  changeTime() {
    if(this.changeTimeMeter == 0) {
      if(keyIsDown(79)) {
        this.changeTimelinesSound.play();
        this.changeTimeMeter = this.changeTimeLimit;
        if(this.inPresent) {
          this.futureTime = this.futureTimeLimit;
          this.inPresent = false;
        }
        else {
          this.inPresent = true;
        }
      }
    }
    else {
      this.changeTimeMeter--;
    }
  }

  //check if time is changed periods
  checkChangedTime() {
    if(this.futureTime > 0) {
      // Future time indicator
      stroke(138, 43, 226);
      strokeWeight(3);
      fill(0, 0, 0, 150);
      rect(width - 200, 70, 180, 40);
      
      noStroke();
      fill(138, 43, 226);
      textAlign(CENTER);
      textSize(16);
      text('FUTURE TIME', width - 110, 85);
      textSize(20);
      text(parseInt(this.futureTime / 100), width - 110, 105);
      
      this.futureTime--;
      if(this.futureTime == 1){ this.changeTimelinesSound.play(); }
    }
    else {
      this.inPresent = true;
    }
  }

  //attack function
  useAttacks() {
    this.createProjectiles();
    this.stopTime();
    this.checkTime();
    this.teleport();
    this.changeTime();
    this.checkChangedTime();
  }

  //health
  deductHealth() {
    // Only take damage if not in cooldown period
    if (this.damageCooldown <= 0) {
      console.log('Character took damage! Health before:', this.health);
      this.health -= 10;
      console.log('Health after:', this.health);
      this.damageCooldown = this.damageCooldownLimit; // Start cooldown
    } else {
      console.log('Damage blocked by cooldown');
    }
  }

  checkHealth() {
    if(this.health <= 0) {
      console.log('Character died due to health reaching 0');
      this.isAlive = false;
    }
  }

  //display function
  displayMeters() {
    textAlign(LEFT);
    
    // Magic Meter with border and gradient
    stroke(255);
    strokeWeight(2);
    fill(0, 0, 0, 150);
    rect(45, 45, 260, 30);
    
    noStroke();
    // Magic meter gradient
    for (var i = 0; i < this.magicMeter; i++) {
      var inter = map(i, 0, this.magicLimit, 0, 1);
      var c = lerpColor(color(255, 0, 255), color(0, 255, 255), inter);
      fill(c);
      rect(50 + i, 50, 1, 20);
    }
    
    fill(255);
    textSize(12);
    text('Magic: ' + int(this.magicMeter) + '/' + this.magicLimit, 55, 65);
    
    // Health Meter with border and gradient
    stroke(255);
    strokeWeight(2);
    fill(0, 0, 0, 150);
    rect(45, 80, 110, 30);
    
    noStroke();
    // Health meter gradient
    for (var i = 0; i < this.health; i++) {
      var inter = map(i, 0, 100, 0, 1);
      var c = lerpColor(color(255, 0, 0), color(0, 255, 0), inter);
      fill(c);
      rect(50 + i, 85, 1, 20);
    }
    
    fill(255);
    textSize(12);
    text('Health: ' + int(this.health) + '/100', 55, 100);
    
    // Time Period Indicator
    stroke(255, 215, 0);
    strokeWeight(3);
    fill(0, 0, 0, 150);
    rect(width - 200, 20, 180, 40);
    
    noStroke();
    fill(255, 215, 0);
    textAlign(CENTER);
    textSize(16);
    if (this.inPresent) {
      text('PRESENT ERA', width - 110, 45);
    } else {
      text('FUTURE ERA', width - 110, 45);
    }
    
    textAlign(LEFT);
  }

  //show projectiles
  displayProjectiles() {
    for(var i = 0; i < this.projectiles.length; i++ ){
      this.projectiles[i].display();
      if(this.projectiles[i].inDisplay == false) {
        this.projectiles.splice(i,1);
      }
    }
  }

  //full display
  display() {
    // Update damage cooldown
    if (this.damageCooldown > 0) {
      this.damageCooldown--;
    }

    this.checkHealth();

    //check if alive
    if(this.isAlive) {

      //hit box debugging code

      /*line(this.leftSide,this.topSide,this.rightSide,this.topSide)
      line(this.leftSide,this.bottomSide,this.rightSide,this.bottomSide)
      line(this.leftSide,this.bottomSide,this.leftSide,this.topSide)
      line(this.rightSide,this.bottomSide,this.rightSide,this.topSide)*/

      //change image
      if(this.direction == 'W') { this.currentImage = this.imageLeft; }
      if(this.direction == 'E') { this.currentImage = this.imageRight; }

      imageMode(CENTER)
      
      // Flash when taking damage (invincibility frames)
      if (this.damageCooldown > 0 && this.damageCooldown % 6 < 3) {
        tint(255, 100, 100); // Red tint when invincible
      } else {
        noTint();
      }

      image(this.currentImage,this.xPos, this.yPos, this.sizeX, this.sizeY);
      noTint(); // Reset tint
      this.displayMeters();
      this.movePosition();
      this.useAttacks();
      this.displayProjectiles();
    }

    else {
      // Death screen overlay
      fill(255, 0, 0, 100);
      rect(0, 0, width, height);
      
      // Death box
      fill(0, 0, 0, 200);
      stroke(255, 0, 0);
      strokeWeight(3);
      rect(width/2 - 200, height/2 - 100, 400, 200);
      
      noStroke();
      fill(255, 0, 0);
      textSize(36);
      textAlign(CENTER);
      text('YOU DIED!', width / 2, height / 2 - 20);
      
      fill(255);
      textSize(18);
      text('The magical forces were too strong...', width / 2, height / 2 + 20);
      text('Press ENTER to try again', width / 2, height / 2 + 50);

      if(keyIsDown(13)) {
        this.restart = true;
      }
    }


  }
}
