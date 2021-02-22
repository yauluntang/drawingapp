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
  public currentColor: any;
  public currentThickness: number;

  public sprite: any;
  public colors: Array<number>;
  public pencolor: any;
  public penthick: number;

  public picture: any;

  public rt: any;

  public grabGraphic: any;
  public colorMap: any;

  public fillGraph: any;

  public rawImage: any;

  public painted: boolean;
  public data: any;

  public layers: any;
  public count: any;


  public mouseDown: boolean;

  public mouseCurrentlyOver: any;

  constructor ()
  {
    super({
      key: "MainScene"
    });
  }

  preload ()
  {
      this.load.path = 'assets/drawings/';

      this.load.image('bird', 'bird.png');

      this.load.image('pen', 'pen.png');
  }

  create ()
  {
    this.pencolor = null;
    console.log( this );
    this.colors = [0xe20000, 0x228B22, 0x6495ED, 0xffff00, 0xff00ff, 0x00ffff, 0x000000, 0xffffff ];
    this.curves = [];
    this.colorMap = new Array(window.innerWidth).fill(null).map(() => new Array(window.innerHeight).fill(null));
    

    this.painted = false;
    this.layers = {};

    /*
    console.log( this );

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

      


      this.rt = this.add.renderTexture(0, 0, window.innerWidth, window.innerHeight);
      this.grabGraphic = this.add.graphics( { x: 0, y: 0 });

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

      this.picture = this.add.sprite(window.innerWidth/2, window.innerHeight/2, 'bird');
      this.picture.displayWidth = window.innerWidth;
      this.picture.displayHeight = window.innerHeight;
      this.picture.setVisible(false);

      this.rt.draw( this.picture, window.innerWidth/2, window.innerHeight/2 );

      this.fillGraph = this.add.graphics();
      this.fillGraph.setVisible( false );

*/

      this.mouseDown = false;
      let base = this.textures.getBase64('bird');
      console.log( base );
      const image = new Image();
      image.src = base;
      image.width = window.innerWidth;
      image.height = window.innerHeight;

      image.onload = () => {
        this.painting( image );
      }
    
      this.count = 0;


      var that = this;
      /*
      document.addEventListener( 'mousedown', ()=>{
        console.log( 'pointerdown '+ this.count);
        console.log( that );
        if ( that.mouseCurrentlyOver ){
          console.log( that.mouseCurrentlyOver );
          for ( let i = 0; i < this.mouseCurrentlyOver.length; i ++ ){
            that.mouseCurrentlyOver[i].setTint(0xff0000);
          }
        }
        
      });
      document.addEventListener( 'mouseup', ()=>{
        console.log( 'pointerup' + this.count );
        this.count ++;
      });*/

      this.mouseCurrentlyOver = null;
    
      this.input.on('pointerdown', function(pointer, currentlyOver){ 
        this.mouseDown = true;
        console.log( 'pointerdown');
        for ( let i = 0; i < currentlyOver.length; i ++ ){
          currentlyOver[i].setTint(0xff0000);
        }
       });
      
      this.input.on('pointerup', function(pointer, currentlyOver){ 
        this.mouseDown = false;
        console.log( 'pointerup');

       });
      /*
this.input.on('pointerdownoutside', function(pointer){ 
        console.log( 'pointerdownoutside');
       });
    
      this.input.on('pointerupoutside', function(pointer){
        console.log( 'pointerupoutside');
       });

    
      this.input.on('pointermove', function(pointer, currentlyOver){ 
        console.log( 'pointermove');
        if ( currentlyOver ){
          console.log( currentlyOver );
          this.mouseCurrentlyOver = currentlyOver;
          //currentlyOver.setTint(0xff0000);
          
        }
       });
       /*
      this.input.on('pointerover', function(pointer, justOver){
        console.log( 'pointerover');
       });
      this.input.on('pointerout', function(pointer, justOut){
        console.log( 'pointerout');
      });*/
      
      

/*
      for ( let i = 0; i < 3; i ++ ){
        const penthick = this.add.sprite(window.innerWidth-500, 100 + i * 100, 'pen');
        penthick.displayWidth = 300;
        penthick.displayHeight = 100;
        penthick.setInteractive(this.input.makePixelPerfect(150));
        
        penthick.on('pointerdown', (pointer)=> {
          this.penthick = (i+1)*20;
        });
      }
*/

      /*
      for ( let i = 0; i < this.colors.length; i ++ ){
        const pen = this.add.sprite(window.innerWidth-200, 100 + i * 100, 'pen');
        pen.displayWidth = 300;
        pen.displayHeight = 100;
        pen.setInteractive(this.input.makePixelPerfect(150));
        pen.on('pointerdown', (pointer)=> {

          this.pencolor = this.colors[i];
          //this.setTint(0xff0000);
  
        });
    
        pen.on('pointerout', (pointer)=> {
    
            //this.clearTint();
    
        });
    
        pen.on('pointerup', (pointer)=> {
    
            //this.clearTint();
    
        });
        pen.tint = this.colors[i];
      }*/


      
      this.debug = this.add.text(10, 10, '', { font: '16px Courier', color: '#00ff00' });
      //this.debug2 = this.add.text(10, 25, '', { font: '16px Courier', fill: '#00ff00' });


      this.cameras.main.backgroundColor.setTo(255,255,255);

      this.game.renderer.snapshotArea(0,0,window.innerWidth, window.innerHeight,(image:HTMLImageElement)=>{
        if (this.textures.exists('area'))
        {
          this.textures.remove('area');
        }
        this.textures.addImage('area', image);
        this.rawImage = image;


        /*
        let lastColor = null;
        for ( let x=0; x< window.innerWidth; x ++ ){
          for ( let y=0; y< window.innerHeight; y ++ ){
            let color = this.textures.getPixel( x, y, "area");
            this.colorMap[x][y] = color;
          }
        }*/


        //console.log( lastColor );
      });


      


  }

  update(time): void {
    //this.painting();
    this.debug.setText([
        'FPS: '+ this.game.loop.actualFps
    ]);


    if ( this.currentCurve && this.currentCurve.length >=2 ){

      //this.curve = new Phaser.Curves.Line( this.currentCurve );

      this.graphics.clear();

      /*
      this.graphics.beginFill(0xFFFFFF, 1);
      this.graphics.drawRect(0, 0, window.innerWidth, window.innerHeight);
      this.graphics.endFill();
*/
      

      for ( let i = 0; i < this.curves.length; i ++ ){
        this.drawLines( this.curves[i].curve, this.curves[i].thickness, this.curves[i].color, this.graphics );
      }
      this.drawLines( this.currentCurve, this.currentThickness, this.currentColor, this.graphics );

    }
  }

  drawLines( lines, thickness, color, graphics ){
    if ( lines && lines.length >= 2 ){
    
      //var color = this.pencolor;
      
      var alpha = 1;

      graphics.lineStyle(thickness, color, alpha);
      graphics.beginPath();

      graphics.moveTo(lines[0].x, lines[0].y);
      for ( let i = 1; i < lines.length; i ++ ){
        this.graphics.lineTo(lines[i].x , lines[i].y );
      
      }
      
      this.graphics.strokePath();
    }
  }

  invertColors(data) {
    
    
    let y = 0;
    let x = 0;
    for (var i = 0; i < data.length; i+= 4) {
      /*
      data[i] = data[i] ^ 255; // Invert Red
      data[i+1] = data[i+1] ^ 255; // Invert Green
      data[i+2] = data[i+2] ^ 255; // Invert Blue
*/
      
      this.colorMap[x][y] = { r: data[i], g: data[i+1], b: data[i+2], a: data[i+3]};
      x ++;
      if ( x >= window.innerWidth ){
        x = 0;
        y ++;
      }
    }
  }

  getImageData( rawImage ){
    const cvs = document.createElement('canvas');
    cvs.width = rawImage.width; 
    cvs.height = rawImage.height;
    const ctx = cvs.getContext("2d");
    ctx.drawImage( rawImage,0,0,cvs.width,cvs.height);
    return ctx.getImageData(0,0,cvs.width,cvs.height);
  }

  getImage( imageData ){
    const cvs = document.createElement('canvas');
    cvs.width = imageData.width; cvs.height = imageData.height;
    const ctx = cvs.getContext("2d");
    ctx.putImageData(imageData, 0, 0);
    const image = new Image();
    image.src = cvs.toDataURL();
    return image;
  }

  getImage64( imageData ){
    const cvs = document.createElement('canvas');
    cvs.width = imageData.width; cvs.height = imageData.height;
    const ctx = cvs.getContext("2d");
    ctx.putImageData(imageData, 0, 0);
    return cvs.toDataURL();
  }

  painting ( rawImage ){
    if ( !this.painted ){
      if ( !rawImage ){
        return;
      }

      let idt = this.getImageData( rawImage );

      this.data = this.fillAll( idt );

      //setTimeout(()=>{
        for ( let i = 0; i < this.data.length; i ++ ){
          let dataimage = this.getImage64( this.data[i] );
          this.textures.addBase64( 'data_'+i, dataimage );
          this.textures.on('addtexture', (key)=>{
            this.layers[key] = this.add.sprite(window.innerWidth/2, window.innerHeight/2, key);
            this.layers[key].setInteractive(this.input.makePixelPerfect(1));
            this.debug.setDepth(1);
          })
          
        }

        
  
  
        /*
        let htmlimage = this.getImage( idt );
            
        
        if (this.textures.exists('temp'))
        {
          this.textures.remove('temp');
        }
        this.textures.addImage('temp', htmlimage);
        let picture = this.add.sprite(window.innerWidth/2, window.innerHeight/2, 'temp');
        picture.displayWidth = window.innerWidth;
        picture.displayHeight = window.innerHeight;*/
        //picture.setVisible(false);
  
        //this.rt.draw( picture, window.innerWidth/2, window.innerHeight/2 );
        
      //}, 5000);
      
      this.painted = true;
    }
  }

  drawStart( pointer ) {


    

    //let pix = this.getPixelXY( idt, 2,2 );
    //console.log( pix );

    

    
    
    this.debug2.setText([`X:${pointer.x} Y:${pointer.y} Thick:${this.penthick}`]);
    //this.lastX = pointer.x;
    //this.lastY = pointer.y;
    this.drawing = true;
    this.currentCurve = [];
    this.currentColor = this.pencolor;
    this.currentThickness = this.penthick;
    this.currentCurve.push(new Phaser.Math.Vector2(pointer.x, pointer.y));

    var color = this.textures.getPixel( pointer.x, pointer.y, "area");
    
    /*
    if ( color.red === 255 && color.blue===255 && color.green === 255 ){
      
      
      this.fillGraph.fillStyle(0xFF0000, 1.0);
      this.fillGraph.fillRect(pointer.x, pointer.y, 1, 1);
      this.rt.draw( this.fillGraph,0,0 );
      this.fill( pointer.x, pointer.y );
    }*/
  }

  getPixel(imgData, index) {
    var i = index*4, d = imgData.data;
    return [d[i],d[i+1],d[i+2],d[i+3]] // [R,G,B,A]
  }
  
  getPixelXY(imgData, x, y) {
    return this.getPixel(imgData, y*imgData.width+x);
  }

  setPixel(imgData, index, color) {
    var i = index*4, d = imgData.data;
    [d[i],d[i+1],d[i+2],d[i+3]] = color;
  }

  setPixelXY(imgData, x, y, color) {
    this.setPixel( imgData, y*imgData.width+x, color );
  }

  fillAll ( imgData ){
    let data = [];
    let greys = 0;
    for ( let x = 0; x < window.innerWidth; x ++ ){
      for ( let y = 0; y < window.innerHeight; y ++ ){
        let color:Array<number> = this.getPixelXY( imgData, x, y );
        if ( color[0] === 255 && color[1] === 255 && color[2] === 255 ){
          const newData = this.fill( imgData, x, y, greys );
          data.push( newData );
          greys ++;
        }
      }
    }
    console.log( data );
    return data;
  }

  fill ( imgData, x, y, grey ) {
    //this.colorMap = new Array(window.innerWidth).fill(false).map(() => new Array(window.innerHeight).fill(false));

    
    const cvs = document.createElement('canvas');
    cvs.width = imgData.width; 
    cvs.height = imgData.height;
    const ctx = cvs.getContext("2d");
    ctx.clearRect( 0,0,cvs.width,cvs.height );
    let newData = ctx.getImageData(0,0,cvs.width,cvs.height);
    



    let chooseRand = [];
    chooseRand.push([255,0,0,255]);
    chooseRand.push([0,255,0,255]);
    chooseRand.push([0,0,255,255]);
    chooseRand.push([255,255,0,255]);
    chooseRand.push([0,255,255,255]);
    chooseRand.push([255,0,255,255]);

    //let chooseRandColor = Math.floor(Math.random()*100 % chooseRand.length) ;

    let chooseRandColor = Math.floor(grey % chooseRand.length) ;
    let chooseCol = chooseRand[chooseRandColor];
    console.log( chooseCol);
    let fillColor = (x,y) => {
      let color:Array<number> = this.getPixelXY( imgData, x, y );
      
      if ( x >= 0 && y >= 0 && x < window.innerWidth && y < window.innerHeight ){
        if ( color[0] === 255 && color[1] === 255 && color[2] === 255 ){
        
          //this.setPixelXY( imgData, x, y, chooseRandColor )
          this.setPixelXY( imgData, x, y, chooseCol )
          this.setPixelXY( newData, x, y, [255,255,255,255]);
          list.push({x:x - 1, y});
          list.push({x:x + 1, y});
          list.push({x, y: y - 1});
          list.push({x, y: y + 1});
        }
      }
    }

    let list = [];
    list.push({x,y});
    let maxlength = 0;
    while ( list.length > 0 ){
      let point = list.pop();
      fillColor(point.x, point.y);
      if ( list.length > maxlength ){
        maxlength = list.length;
      }
    }
    console.log( maxlength ); 

    
    //this.rt.draw( this.fillGraph,0,0 );


    return newData;
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
    
    var color = this.textures.getPixel( pointer.x, pointer.y, "area");

    this.grabGraphic.clear();

        if (color)
        {
          this.grabGraphic.lineStyle(1, 0x000000, 1);
          this.grabGraphic.strokeRect(pointer.x - 1, pointer.y - 1, 34, 34);

          this.grabGraphic.fillStyle(color.color, 1);
          this.grabGraphic.fillRect(pointer.x, pointer.y, 32, 32);
        }
        


    /*

    var graphics = this.add.graphics( { x: 0, y: 0 });
    var color = this.textures.getPixel(pointer.x - 111, pointer.y - 25, 'bird');
    console.log( color );

    graphics.clear();

    if (color)
    {
      
        graphics.lineStyle(1, 0x000000, 1);
        graphics.strokeRect(pointer.x - 1, pointer.y - 1, 34, 34);

        graphics.fillStyle(color.color, 1);
        graphics.fillRect(pointer.x, pointer.y, 32, 32);
    }*/
  }

  drawStop() {
    this.drawing = false;
    this.curves.push( { curve: this.currentCurve, color: this.currentColor, thickness: this.currentThickness} );
  
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
  