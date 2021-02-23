import { buildTargets } from "../constants";

export class MainScene extends Phaser.Scene {


  public debug: any;

  public sections: any;
  public alphaSections: any;
  public graphics: any;
  public currentSectionIndex: number;
  public rt: any;

  public linePoints: any;
  public currentThickness: number;


  public tempRt: any;
  public picSize: number;
  public picX: number;
  public picY: number;

  constructor ()
  {
    super({
      key: "MainScene"
    });
  }

  preload ()
  {
      this.load.path = 'assets/drawings/';

      
      this.load.image('birdt', 'birdt.png');

      for ( let i = 0; i <= 11; i ++ ){
        this.load.image(`birdt_out_${i}`, `birdt_out_${i}.png`);
        this.load.image(`birdt_alpha_${i}`, `birdt_alpha_${i}.png`);
      }

  }

  loadPic ( alias ) {
    const pic = this.add.sprite( this.picX, this.picY, alias);
    pic.setOrigin(0,0)
    pic.setDisplaySize( this.picSize, this.picSize );
    pic.setInteractive( this.input.makePixelPerfect(1));
    return pic;
  }

  create ()
  {

    this.picSize = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth;

    this.picX = window.innerWidth / 2 - this.picSize / 2;
    this.picY = 0;
    

    this.sections = [];
    this.alphaSections = [];
    for ( let i = 0; i <= 11; i ++ ){
      const alpha = this.loadPic( `birdt_alpha_${i}` )
      alpha.setVisible( false );
      this.alphaSections.push( alpha );
      
    }

    this.currentThickness = 20;
    

    for ( let i = 0; i <= 11; i ++ ){
      this.sections.push(this.loadPic( `birdt_out_${i}` ));
    }

    this.rt = this.add.renderTexture( 0,0,window.innerWidth, window.innerHeight);

    const pic = this.add.sprite( this.picX, this.picY, "birdt");
    pic.setOrigin(0,0)
    pic.setDisplaySize( this.picSize, this.picSize );

    pic.setDepth(1);
    this.linePoints = [];
    


    

    

    this.currentSectionIndex = null;
    this.loadPic( `birdt` );
    this.cameras.main.backgroundColor.setTo(255,255,255);
    this.debug = this.add.text(10,10,"",{ font: "16px Arial Black", color: "#00ff00" })
    this.graphics = this.add.graphics();
    this.graphics.setVisible(false);
    

    this.input.on( 'pointerdown', (pointer, over)=>{
      //console.log( over );
      if ( over && over[0] ){
        const key = over[0].texture.key;
        this.currentSectionIndex = parseInt(key.split("_")[2],10);
        if ( !isNaN( this.currentSectionIndex) ){
        
          this.linePoints.push({x:pointer.x, y:pointer.y});
          this.graphics.clear();
          

          this.graphics.fillStyle(0x00ff00, 1);
          this.graphics.fillCircle(pointer.x, pointer.y, this.currentThickness);
          
          this.tempRt = this.add.renderTexture( 0,0,window.innerWidth, window.innerHeight);
          this.tempRt.draw( this.graphics );
          this.tempRt.erase( this.alphaSections[this.currentSectionIndex] );
        }
        else {
          this.currentSectionIndex = null;
        }

        

      }
    });
    this.input.on( 'pointermove', (pointer, over)=>{
      
      if ( pointer.isDown && this.currentSectionIndex !== null ){

        this.graphics.clear();
        
        this.graphics.fillStyle(0x00ff00, 1);
        this.graphics.fillCircle(pointer.x, pointer.y, this.currentThickness);
        
        
        this.linePoints.push({x:pointer.x, y:pointer.y});

        while ( this.linePoints.length >2 ){
          this.linePoints.shift();
        }

        const curve = new Phaser.Curves.Line([ this.linePoints[0].x, this.linePoints[0].y, this.linePoints[1].x, this.linePoints[1].y ]);

        this.graphics.lineStyle(this.currentThickness * 2, 0x00ff00, 1);
        curve.draw(this.graphics);

        this.tempRt.draw( this.graphics );
        this.tempRt.erase( this.alphaSections[this.currentSectionIndex] );

        

      }
    });
    this.input.on( 'pointerup', (pointer, over)=>{
      console.log( over );
      if ( this.tempRt ){
        this.rt.draw( this.tempRt );
        this.tempRt.destroy();
        this.tempRt = null;
        this.currentSectionIndex = null;
      }
    });

    
  }

  update(time): void {
    this.debug.setText([
        'FPS: '+ this.game.loop.actualFps.toFixed(2)
    ]);

  }

}
  