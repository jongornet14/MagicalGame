class PauseScreen {

    constructor() {

        this.isPause = true;
        //this.environment = environment;
        this.pauseLatency = 10;
        this.pauseTime = 0;
    }

    createEnvironment() {
      this.environment = new Environment();
    }

    //check if paused
    checkPause() {

        if(this.pauseTime == 0) {
            // Try multiple ways to detect ENTER key for compatibility
            var enterPressed = keyIsDown(13) || keyIsDown(ENTER) || (keyIsPressed && (key === '\n' || key === '\r' || keyCode === 13 || keyCode === ENTER));
            
            if(enterPressed) {
                console.log('ENTER detected! isPause:', this.isPause);
                this.pauseTime = this.pauseLatency;
                if(this.isPause) { this.isPause = false; }
                else { this.isPause = true; }
                if((this.environment && this.environment.restart) || (this.environment && this.environment.character && this.environment.character.restart)) { 
                  console.log('Creating new environment due to restart');
                  this.createEnvironment(); 
                }
            }
        }
        else {
            this.pauseTime--;
        }

    }

    //display starting screen
    display() {

      //check if paused
      if(this.isPause || (this.environment && this.environment.restart) || (this.environment && this.environment.character && this.environment.character.restart)) {

        if(this.environment) {
          this.environment.displayPresentEnvironment();
        }

        this.isPause = true;

        // Semi-transparent overlay
        fill(0, 0, 0, 150);
        rect(0, 0, width, height);
        
        // Title box
        fill(50, 50, 50, 200);
        stroke(255, 215, 0);
        strokeWeight(3);
        rect(width/2 - 300, height/2 - 200, 600, 400);
        
        // Title
        fill(255, 215, 0);
        textSize(40);
        textAlign(CENTER);
        text('WORLD OF MAGIC', width/2, height/2 - 150);
        
        // Subtitle
        fill(255, 255, 255);
        textSize(20);
        text('Master Time and Elements', width/2, height/2 - 110);
        
        // Controls section
        fill(255, 255, 255);
        textSize(18);
        textAlign(LEFT);
        var startX = width/2 - 250;
        var startY = height/2 - 60;
        
        text('CONTROLS:', startX, startY);
        text('J: Shoot Electricity', startX + 20, startY + 30);
        text('K: Explode Fire', startX + 20, startY + 55);
        text('I: Stop Time', startX + 20, startY + 80);
        text('L: Teleport', startX + 20, startY + 105);
        text('O: Change Timeline', startX + 20, startY + 130);
        
        // Movement controls
        text('MOVEMENT:', startX + 280, startY);
        text('W/A/S/D: Move Around', startX + 300, startY + 30);
        
        // Start instruction
        fill(255, 215, 0);
        textAlign(CENTER);
        textSize(24);
        text('Press ENTER to Start Adventure!', width/2, height/2 + 120);
        
        noStroke();
        this.checkPause();

      }

      //display pause screen
      else if(this.isPause == false) {

        this.isPause = false;

        if(this.environment) {
          this.environment.display();
        }
        this.checkPause();

      }

    }

}
