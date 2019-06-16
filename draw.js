function draw(x,y,mag, id, canvasWidth, canvasHeight) {

  if (x==null || x<-2) x=-2;
  if (x>1) x=1;
  if (y==null || y<-1) y=-1;
  if (y>1) y=1;
  if (mag == null || mag < 300) mag = 300;

  const { createCanvas } = require('canvas')
//  const canvas = createCanvas(canvasWidth, canvasHeight)
console.log("creating canvas: " + canvasWidth + "," +  canvasHeight)
  const canvas = createCanvas(canvasWidth, canvasHeight)

  render(x, y, mag, id, canvas)
//  render(-2, -1, 300, canvas)
  return canvas;
}

/**
 *  This renders the canvas as a portion of the Mandelbrot fractal
 *  
 *  @param offsetX - the (real number) X most position of the 'view area'
 *  @param offsetY - the (imaginary number) Y most position of the 'view area'
 *  @param magnificationFactor - each pixel is 'magnified' by this amount when calculating the set; e.g. 
 *                               a factor of 1000 means each pixel represents a span of 0.001 in the set
 *  @param canvas - the canvas to draw the set on
 */

let maxIterations = 1000;

function render(offsetX, offsetY, magnificationFactor, id, myCanvas)
{
  console.log("rendering... (" + offsetX + "," + offsetY + ") @ " + magnificationFactor + " canvas: " + myCanvas.width + ", " + myCanvas.height);

  var ctx = myCanvas.getContext('2d')

  var histogram = new Array(maxIterations).fill(0);;

  if (magnificationFactor > 10000) maxIterations = 5000;

/*  console.log("created histogram array of length: " + histogram.length);

  - doesn't work in segmented space, as histograms different for each portion :-(.
   // compute histogram
   for (let xPixel = 0; xPixel < myCanvas.width; xPixel++) 
   {
     for (let yPixel = 0; yPixel < myCanvas.height; yPixel++) 
     {
       let iterationCount = checkValue(offsetX + (xPixel / magnificationFactor), offsetY + (yPixel / magnificationFactor));
		histogram[iterationCount]++;
	 }
   }	

   // compute histogram numeric total
   let totalPixels = myCanvas.width * myCanvas.height;

   // turn histogram into cumulative histogram - count is a running total of 'non zero' pixels	
   var count = histogram[maxIterations-1];
   for (i = maxIterations-2; i>0; i--)  // note - skip '0' when computing totals...
   {
      count += histogram[i];
      histogram[i] = count;
   }
   var countFactor = count/100;
 
   // in loop - something like:
   let shade = Math.floor(histogram[iterationCount]/countFactor); // should be a number between 0 and 100...
*/

  // pass 2: draw image	
  for (let xPixel = 0; xPixel < myCanvas.width; xPixel++) 
  {
    for (let yPixel = 0; yPixel < myCanvas.height; yPixel++) 
    {

      const iterationCount = checkValue(offsetX + (xPixel / magnificationFactor), offsetY + (yPixel / magnificationFactor));

      if (iterationCount === 0) {
        ctx.fillStyle = '#000';
        ctx.fillRect(xPixel,yPixel, 1,1);   // Draw a black pixel
      } 
	  else 
	  {
//	    let shade = 20*Math.log(iterationCount*150/maxIterations); // should be a number between 0 and 100...
// 	    let shade = 15*Math.log(iterationCount); // should be a number between 0 and 100...
	
		let shade = (magnificationFactor < 1000)?iterationCount:15*Math.log(iterationCount*1000/maxIterations);
	
       ctx.fillStyle = `hsl(240, 100%, ${shade}%)`;  // Draw a colorful pixel
        ctx.fillRect(xPixel,yPixel, 1,1);
      }
    } // y loop
  } // x looop

  ctx.fillStyle = "blue";
  ctx.font = "20px Arial";
  ctx.fillText(id, 30, 30); 
}


function checkValue(real,imaginary) 
{
  let realer = real;
  let imaginarier = imaginary;

  var real_part, imaginary_part, dist_squared;

  for (let i = 0; i < maxIterations; i++) 
  {
    real_part = real * real - (imaginary * imaginary);
    imaginary_part = 2 * real * imaginary;
    dist_squared = real_part * real_part + imaginary_part * imaginary_part;
    if (dist_squared > 4) return (i);
    real = real_part + realer;
    imaginary = imaginary_part + imaginarier;
  }
  return 0;  // Return zero if in set
}


function save(canvas) {

  const fs = require('fs')
  const out = fs.createWriteStream(__dirname + '/test.png')
  const stream = canvas.createPNGStream()
  stream.pipe(out)
  out.on('finish', () =>  console.log('The PNG file ' + __dirname + '/test.png was created.'))
  console.log("finished?")
}
module.exports = draw;
