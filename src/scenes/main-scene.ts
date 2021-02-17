import { buildTargets } from "../constants";

export class MainScene extends Phaser.Scene {


  public bg: any;
  public trees: any;

  public debug: any;
  public debug2: any;
  public lastX: any;
  public lastY: any;
  public drawing: boolean;

  public graphics: any;
  public curve: any;

  public curves: any;

  public currentCurve: any;

  constructor ()
  {
    super({
      key: "MainScene"
    });
  }

  preload ()
  {
      this.load.path = 'assets/animations/';

      this.load.image('cat1', 'cat1.png');
      this.load.image('cat2', 'cat2.png');
      this.load.image('cat3', 'cat3.png');
      this.load.image('cat4', 'cat4.png');
  }

  create ()
  {
    this.curves = [];
      this.anims.create({
          key: 'snooze',
          frames: [
              { key: 'cat1', frame: 'cat1' },
              { key: 'cat2', frame: 'cat2' },
              { key: 'cat3', frame: 'cat3' },
              { key: 'cat4', frame: 'cat4', duration: 50 }
          ],
          frameRate: 8,
          repeat: -1
      });

      const cat = this.add.sprite(window.innerWidth/2, window.innerHeight/2, 'cat1');
      cat.play('snooze');
      cat.displayWidth = window.innerWidth;
      cat.displayHeight = window.innerHeight;



      this.curve = new Phaser.Curves.Spline([
        new Phaser.Math.Vector2(20, 550),
        new Phaser.Math.Vector2(260, 450),
        new Phaser.Math.Vector2(300, 250),
        new Phaser.Math.Vector2(550, 145),
        new Phaser.Math.Vector2(745, 256)
      ]);
      this.graphics = this.add.graphics();

      this.input.on('pointerdown', this.drawStart, this);
      this.input.on('pointermove', this.drawUpdate, this);
      this.input.on('pointerup', this.drawStop, this);

      this.debug = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });
      this.debug2 = this.add.text(10, 20, '', { font: '16px Courier', fill: '#00ff00' });
      
  }

  update(time): void {
    this.debug.setText([
        'FPS: '+ this.game.loop.actualFps
    ]);

    if ( this.currentCurve && this.currentCurve.length >=2 ){


      //this.curve = new Phaser.Curves.Line( this.currentCurve );

      this.graphics.clear();

      this.drawLines( this.currentCurve, this.graphics );

      for ( let i = 0; i < this.curves.length; i ++ ){
        this.drawLines( this.curves[i], this.graphics );
      }

    }
  }

  drawLines( lines, graphics ){
    if ( lines && lines.length >= 2 ){
    
      var color = 0xffff00;
      var thickness = 20;
      var alpha = 0.8;

      graphics.lineStyle(thickness, color, alpha);
      graphics.beginPath();

      graphics.moveTo(lines[0].x, lines[0].y);
      for ( let i = 1; i < lines.length; i ++ ){
        this.graphics.lineTo(lines[i].x , lines[i].y );
      
      }
      this.graphics.strokePath();
    }
  }

  drawStart( pointer ) {
    this.debug2.setText([`X:${pointer.x} Y:${pointer.y}`]);
    //this.lastX = pointer.x;
    //this.lastY = pointer.y;
    this.drawing = true;
    this.currentCurve = [];
    this.currentCurve.push(new Phaser.Math.Vector2(pointer.x, pointer.y));
  }

  drawUpdate( pointer ) {
    this.debug2.setText([`X:${pointer.x} Y:${pointer.y}`]);
    
    
    if ( this.drawing ){
      //let line = this.add.line(0,0,this.lastX,this.lastY, pointer.x, pointer.y, 0x00ffff, 1);
      //this.add.circle(pointer.x,pointer.y,10, 0x00ffff, 1 );
      this.currentCurve.push(new Phaser.Math.Vector2(pointer.x, pointer.y));
      //this.lastX = pointer.x;
      //this.lastY = pointer.y;
    }
  }

  drawStop() {
    this.drawing = false;
    this.curves.push( this.currentCurve );
  
  }
  
  /*
  private phaserSprite: Phaser.GameObjects.Sprite;
  
    private debug: any;
    constructor() {
      super({
        key: "MainScene"
      });
    }
  
    preload(): void {
      this.load.image("logo", "./assets/phaser.png");
    }
  
    create(): void {
      this.phaserSprite = this.add.sprite(400, 300, "logo");
      this.tweens.add({
        targets: this.phaserSprite,
        y: 450,
        duration: 2000,
        ease: "Power2",
        yoyo: true,
        loop: -1
      });
      console.log( this );
      this.debug = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });
    }
    update(time): void {
      this.debug.setText([
          'FPS: '+ this.game.loop.actualFps
      ]);
    }*/
  }
  