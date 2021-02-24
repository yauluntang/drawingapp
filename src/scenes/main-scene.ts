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
  public currentColor: number;

  public tempRt: any;
  public picSize: number;
  public picX: number;
  public picY: number;

  public toolBarGraphic: any;
  public toolButtons: Array<any>;

  
  
  public colorLayer: any;
  public isColorLayerOpen: boolean;


  public width: number;
  public height: number;



  constructor ()
  {
    super({
      key: "MainScene"
    });
  }

  preload ()
  {
      this.load.path = 'assets/';

      this.load.image('icon/button','icon/button.png');
      this.load.image('icon/color','icon/color.png');

      this.load.svg('icon/brush','icon/brush.svg');
      this.load.svg('icon/pen','icon/pen.svg');
      this.load.svg('icon/pencil','icon/pencil.svg');
      this.load.svg('icon/bucket','icon/bucket.svg');

      this.load.image('birdt', 'drawings/birdt.png');
      //this.load.image('birdt', 'drawings/birdt.png');

      for ( let i = 0; i <= 11; i ++ ){
        this.load.image(`birdt_out_${i}`, `drawings/birdt_out_${i}.png`);
        this.load.image(`birdt_alpha_${i}`, `drawings/birdt_alpha_${i}.png`);
      }

  }

  loadPic ( alias ) {
    const pic = this.add.sprite( this.picX, this.picY, alias);
    pic.setOrigin(0,0)
    pic.setDisplaySize( this.picSize, this.picSize );
    pic.setInteractive( this.input.makePixelPerfect(1));
    return pic;
  }

  drawToolbar( height, color ){

    
    this.toolBarGraphic.fillStyle(0xeeeeee, 1);

    const x = this.width * 0.8;
    const y = height * 0.025;
    
    const h = height * 0.95;
    const w = h/4;
    const br = 12;

    this.toolBarGraphic.fillRoundedRect(x,y,w,h , { tl: br, tr: br, bl: br, br: br }); 

    this.toolBarGraphic.fillStyle(color, 1);
    this.toolBarGraphic.fillRoundedRect(x+2,y+2,w-4,h-4, { tl: br, tr: br, bl: br, br: br }); 

  }

  openColorSwitch( layer ) {
    layer.inProcess = true;
    layer.setVisible( true );
    this.tweens.timeline({
      
      targets:  layer,
      tweens: [
          {
            scaleX: { from: 0, to: 1 },
            scaleY: { from: 0, to: 1 },
            ease: 'Quint.inOut',
            duration: 250,
            onComplete: ()=> { 
              layer.inProcess = false;
            }
          }
      ]
    });
  }

  closeColorSwitch( layer ){
    layer.inProcess = true;
    this.tweens.timeline({
      targets:  layer,
      tweens: [        
        {
          scaleX: { from: 1, to: 0 },
          scaleY: { from: 1, to: 0 },
          ease: 'Quint.inOut',
          duration: 250,
          onComplete: ()=> { 
            layer.setVisible(false)
            layer.inProcess = false;
          }
        }
      ]
    });
  }

  toggleColorSwitch( layer ){
    if ( !layer.inProcess ){
      layer.visible ? this.closeColorSwitch( layer ): this.openColorSwitch( layer );
    }
  }

  drawColorPlate() {

  }
  hsv2rgb=(h,s,v,f=(n,k=(n+h/60)%6)=>v-v*s*Math.max(Math.min(k,4-k,1),0))=>[f(5),f(3),f(1)];
  
  HSVtoRGB(h, s, v) {
    var r, g, b;
    var i;
    var f, p, q, t;
     
    // Make sure our arguments stay in-range
    h = Math.max(0, Math.min(360, h));
    s = Math.max(0, Math.min(100, s));
    v = Math.max(0, Math.min(100, v));
     
    // We accept saturation and value arguments from 0 to 100 because that's
    // how Photoshop represents those values. Internally, however, the
    // saturation and value are calculated from a range of 0 to 1. We make
    // That conversion here.
    s /= 100;
    v /= 100;
     
    if(s == 0) {
        // Achromatic (grey)
        r = g = b = v;
        return [
            Math.round(r * 255), 
            Math.round(g * 255), 
            Math.round(b * 255)
        ];
    }
     
    h /= 60; // sector 0 to 5
    i = Math.floor(h);
    f = h - i; // factorial part of h
    p = v * (1 - s);
    q = v * (1 - s * f);
    t = v * (1 - s * (1 - f));
     
    switch(i) {
        case 0:
            r = v;
            g = t;
            b = p;
            break;
     
        case 1:
            r = q;
            g = v;
            b = p;
            break;
     
        case 2:
            r = p;
            g = v;
            b = t;
            break;
     
        case 3:
            r = p;
            g = q;
            b = v;
            break;
     
        case 4:
            r = t;
            g = p;
            b = v;
            break;
     
        default: // case 5:
            r = v;
            g = p;
            b = q;
    }
     
    return [
        Math.round(r * 255), 
        Math.round(g * 255), 
        Math.round(b * 255)
    ];
  }
  RGBtoINT(r, g, b){
    return (r << 16) + (g << 8) + (b);
  }
  createToolbar( height ){


    const x = this.width * 0.8;
    const y = height * 0.025;
    
    const h = height * 0.95;
    const w = h/4;
    const br = 12;

    this.toolBarGraphic = this.add.graphics();
    this.toolBarGraphic.setDepth(2);
    //this.toolBarGraphic.setInteractive();
    

    this.toolButtons = [];
    for ( let i = 0; i < 4; i ++ ){
      let button = this.add.sprite(x, y+i*w, 'icon/button');
      button.setDepth(3);
      button.setInteractive(this.input.makePixelPerfect(1));
      button.setDisplaySize(w,w);
      button.setOrigin(0,0);
      button.on('pointerdown',()=>{
        this.toggleColorSwitch( this.colorLayer );
      });
      this.toolButtons.push( button );  
    }

    let icon = this.add.image( x + w*0.25 ,y + w*0.25, 'icon/brush' );
    icon.setOrigin(0,0);
    icon.setDisplaySize(w*0.5,w*0.5);
    icon.setDepth(4);

    this.colorLayer = this.add.container();
    this.colorLayer.setDepth(5);
    this.colorLayer.setVisible(false);
    

    let graphics = this.add.graphics();
    this.colorLayer.add(graphics);
    this.colorLayer.setPosition(x - 10, y);
    this.colorLayer.setScale(0.1);

    graphics.fillStyle(0xeeeeee, 1);
    graphics.fillRoundedRect( -height/2, 0, height/2, height * 0.95, { tl: br, tr: br, bl: br, br: br }); 

    graphics.fillStyle(0xffffdd, 1);
    graphics.fillRoundedRect( -height/2 + 2, 2, height/2 - 4, height * 0.95 - 4, { tl: br, tr: br, bl: br, br: br }); 

    const colorPlateW = height/12;
    const colorPlateH = height*0.95/13;

    for ( let i = 0; i < 6; i ++ ){
      for ( let j = 0; j < 13; j ++ ){
        
        let h = 360/12*(j-1);
        let s = i <= 3 ? 100 : 100- (i-3) * 40;
        let v = 25+i*25;

        if ( j == 0 ){
          h = 0;
          s = 0;
          v = i*20;
        }

        let [r,g,b] = this.HSVtoRGB(h,s,v);
        let color = this.RGBtoINT(r,g,b);
        let colorPlate = this.add.sprite( i * colorPlateW - height/2, j * colorPlateH + 2, 'icon/color'  );
        colorPlate.setDisplaySize( colorPlateW , colorPlateH );
        colorPlate.setOrigin(0,0);
        colorPlate.setTint(color);
        colorPlate.setInteractive(this.input.makePixelPerfect(1));
        colorPlate.on('pointerdown',()=>{
          this.currentColor = color;
          this.toggleColorSwitch(this.colorLayer);
        })
        this.colorLayer.add( colorPlate );
      }
    }

    

    

    
    this.drawToolbar( height, 0xffffdd );

    /*
    this.toolBarGraphic.on('pointerover',()=>{
      this.drawToolbar( height, 0xffff00 );
    });

    this.toolBarGraphic.on('pointerout',()=>{
      this.drawToolbar( height, 0xffffdd );
    })*/

  }


  createColorSwitch(){

  }

  create ()
  {

    this.width = window.innerWidth * window.devicePixelRatio;
    this.height = window.innerHeight * window.devicePixelRatio;
    
    this.picSize = this.width > this.height ? this.height : this.width;

    this.picX = this.width / 2 - this.picSize / 2;
    this.picY = 0;
    

    this.sections = [];
    this.alphaSections = [];
    for ( let i = 0; i <= 11; i ++ ){
      const alpha = this.loadPic( `birdt_alpha_${i}` )
      alpha.setVisible( false );
      this.alphaSections.push( alpha );
      
    }

    this.currentThickness = 25;
    

    for ( let i = 0; i <= 11; i ++ ){
      this.sections.push(this.loadPic( `birdt_out_${i}` ));
    }

    this.rt = this.add.renderTexture( 0,0,this.width, this.height);

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
          

          this.graphics.fillStyle(this.currentColor, 1);
          this.graphics.fillCircle(pointer.x, pointer.y, this.currentThickness);
          
          this.tempRt = this.add.renderTexture( 0,0,this.width, this.height);
          this.tempRt.alpha = 0.1;
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
        
        this.graphics.fillStyle(this.currentColor, 1);
        this.graphics.fillCircle(pointer.x, pointer.y, this.currentThickness);
        
        
        this.linePoints.push({x:pointer.x, y:pointer.y});

        while ( this.linePoints.length >2 ){
          this.linePoints.shift();
        }

        const curve = new Phaser.Curves.Line([ this.linePoints[0].x, this.linePoints[0].y, this.linePoints[1].x, this.linePoints[1].y ]);

        this.graphics.lineStyle(this.currentThickness * 2, this.currentColor, 1);
        curve.draw(this.graphics);
        this.tempRt.alpha = 1;
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

    this.createToolbar( this.picSize ); 
    
  }

  update(time): void {
    this.debug.setText([
        'FPS: '+ this.game.loop.actualFps.toFixed(2)
    ]);

  }

}
  