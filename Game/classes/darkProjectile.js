class DarkProjectile {

  constructor() {

    //Position
    this.xPos = 0;
    this.yPos = 0;

    this.startX = 0;
    this.startY = 0;

    this.direction = 'E';

    this.ySpeed = random(-1,1);
    this.angleSpeed = 5;
    this.angle = random(0,2*PI);

    //size
    this.size = 10;
    this.grow = false;

    this.surviveTime = 100;

    this.inDisplay = false;

    this.projectileTimeLimit = 50;
    this.projectileTime = 0;

    // Initialize collision boundaries to safe values
    this.leftSide = 0;
    this.rightSide = 0;
    this.topSide = 0;
    this.bottomSide = 0;

  }

  setProjectile(x,y,direction) {

    if(this.inDisplay == false && this.projectileTime == 0) {

      this.projectileTime = this.projectileTimeLimit;

      this.xPos = x;
      this.yPos = y;

      this.direction = direction;

      //Movement
      if(this.direction == 'W') { this.xSpeed = -3; }
      if(this.direction == 'E') { this.xSpeed = 3; }

      // Initialize collision boundaries when projectile is set
      this.leftSide = this.xPos - (this.size / 2);
      this.rightSide = this.xPos + (this.size / 2);
      this.topSide = this.yPos - (this.size / 2);
      this.bottomSide = this.yPos + (this.size / 2);

      this.inDisplay = true;

    }
    else if (this.projectileTime > 0) {
      this.projectileTime--;
    }

  }

  //morph size for animation
  changeSize() {

    if(this.size < 50 && this.grow) { this.size++; }
    else if(this.size == 50) { this.grow = false; this.size--; }
    else if(this.size > 10 && this.grow == false ) { this.size--; }
    else if(this.size == 10) { this.grow = true; this.size++; }

  }

  //move projectile
  move() {

    fill(0);

    this.changeSize();

    ellipse(this.xPos,this.yPos,this.size,this.size);

    this.xPos += this.xSpeed;
    this.yPos += this.ySpeed;

  }

  //check if in display
  checkPosition() {
    if(this.xPos < 0 || this.xPos > width) {
      this.inDisplay = false;
    }
  }

  //check if hit object
  checkHits(object) {

    if(this.inDisplay) {
      if(this.xPos + (this.size / 2) > object.leftSide &&
        this.xPos - (this.size / 2) < object.rightSide &&
        this.yPos + (this.size / 2) > object.topSide &&
        this.yPos - (this.size / 2) < object.bottomSide) { this.inDisplay = false; return true; }
    }

  }

  //display projectile
  display() {
    if(this.inDisplay) {
      // Update collision boundaries
      this.leftSide = this.xPos - (this.size / 2);
      this.rightSide = this.xPos + (this.size / 2);
      this.topSide = this.yPos - (this.size / 2);
      this.bottomSide = this.yPos + (this.size / 2);

      this.move();
      this.checkPosition();
    }
  }
}
