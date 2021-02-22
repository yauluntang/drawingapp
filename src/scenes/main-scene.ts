import { buildTargets } from "../constants";

export class MainScene extends Phaser.Scene {


  public debug: any;

  public sections: any;

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

      for ( let i = 0; i <= 13; i ++ ){
        this.load.image(`birdt_out_${i}`, `birdt_out_${i}.png`);
        this.load.image(`birdt_alpha_${i}`, `birdt_alpha_${i}.png`);
      }

  }

  loadPic ( alias ) {
    const pic = this.add.sprite( 0,0, alias);
    pic.setOrigin(0,0)
    pic.setDisplaySize( window.innerWidth, window.innerHeight );
    pic.setInteractive( this.input.makePixelPerfect(1));
    return pic;
  }

  create ()
  {

    this.sections = [];
    

    const pic = this.add.sprite( 0,0, "birdt");
    pic.setOrigin(0,0)
    pic.setDisplaySize( window.innerWidth, window.innerHeight );
    for ( let i = 0; i <= 13; i ++ ){
      this.sections.push(this.loadPic( `birdt_out_${i}` ));
    }
    this.loadPic( `birdt` );
    this.cameras.main.backgroundColor.setTo(255,255,255);
    this.debug = this.add.text(10,10,"",{ font: "16px Arial Black", color: "#00ff00" })

  }

  update(time): void {
    this.debug.setText([
        'FPS: '+ this.game.loop.actualFps.toFixed(2)
    ]);

  }

}
  