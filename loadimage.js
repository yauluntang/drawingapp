const fs = require("fs"), PNG = require("pngjs").PNG;


const inverseAlpha = ( input, output ) => {
  var data = fs.readFileSync( input );
  var png = PNG.sync.read(data);
  for (var y = 0; y < png.height; y++) {
      for (var x = 0; x < png.width; x++) {
          var idx = (png.width * y + x) << 2;
          png.data[idx + 3] = 255 - png.data[idx + 3];
      }
  }
  var buffer = PNG.sync.write(png);
  fs.writeFileSync( output, buffer);
};


const createEmptyPngAndSave = ( name, width, height, data ) => {
  const dst = new PNG({ width, height, deflateLevel : 1, inputHasAlpha: true });        
  const buffer = PNG.sync.write(dst);
  fs.writeFileSync(name, buffer);
  const file = fs.readFileSync( name );
  const newPngData = PNG.sync.read(file);
  newPngData.data = data;
  const newBuffer = PNG.sync.write(newPngData);
  fs.writeFileSync( name, newBuffer);
}

const paint = () => {
    
    const file = fs.readFileSync("./assets/drawings/birdt.png");
    const png = PNG.sync.read(file);
    const data = fillAll( png );
    
    for ( let i = 0; i < data.length; i ++ ){
      const fileA = `./assets/drawings/birdt_out_${i}.png`;
      const fileB = `./assets/drawings/birdt_alpha_${i}.png`;

      createEmptyPngAndSave( `./assets/drawings/birdt_out_${i}.png`, data[i].width, data[i].height, data[i].data );
      inverseAlpha( fileA, fileB );
    }

}




const getPixel = (imgData, index) =>{
    var i = index*4, d = imgData.data;
    return [d[i],d[i+1],d[i+2],d[i+3]] // [R,G,B,A]
}
  
const getPixelXY = (imgData, x, y) => {
    return getPixel(imgData, y*imgData.width+x);
}

const setPixel = (imgData, index, color) => {
    var i = index*4, d = imgData.data;
    [d[i],d[i+1],d[i+2],d[i+3]] = color;
}

const setPixelXY = (imgData, x, y, color) => {
    setPixel( imgData, y*imgData.width+x, color );
}

const boundary = ( color ) => {
    return ( color[0] === 0 && color[1] === 0 && color[2] === 0 && color[3] >= 200 );
}

const fillAll = ( imgData ) => {
    let data = [];
    let greys = 0;
    console.log( imgData.width, imgData.height );
    for ( let x = 0; x < imgData.width; x ++ ){
      for ( let y = 0; y < imgData.height; y ++ ){
        let color = getPixelXY( imgData, x, y );
        if ( !boundary(color) ){
          const newData = fill( imgData, x, y, greys );
          data.push( newData );
          greys ++;
        }
      }
    }
    console.log('greys'+ greys);
    return data;
}

const fill = ( imgData, x, y, grey ) => {

    let newData = { data: new Array(imgData.data.length).fill(0), width: imgData.width, height: imgData.height };
    let filled = 0;
    let fillColor = (x,y) => {
    
      
      if ( x >= 0 && y >= 0 && x < imgData.width && y < imgData.height ){
      let color = getPixelXY( imgData, x, y );
        if ( !boundary(color) ){
          filled ++;
          setPixelXY( imgData, x, y, [0,0,0,255] )
          setPixelXY( newData, x, y, [255,255,255,255]);
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
    console.log( filled );
    
    return newData;
}

paint();

/*
fs.createReadStream("./assets/drawings/birdt.png")
  .pipe(
    new PNG({
      filterType: 4,
    })
  )
  .on("parsed", function () {
    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        var idx = (this.width * y + x) << 2;
        this.data[idx + 3] = 255 - this.data[idx + 3];
      }
    }

    this.pack().pipe(fs.createWriteStream("./assets/drawings/birdt_out.png"));
});*/