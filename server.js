var express = require('express');
//var router = express.Router();
var app = express();
var draw = require('./draw.js');
const port = 8080


app.use("/", express.static(__dirname + '/files'));


app.get('/set', function (req, res) {
	var mag = parseFloat(req.query.mag);
	var x = parseFloat(req.query.x);
	var y = parseFloat(req.query.y);
	var id = parseFloat(req.query.id);
	var width = req.query.width;
	var height = req.query.height;
		
	if (width == null) width = 400; else width = parseInt(width);
	if (height == null) height = 400; else height = parseInt(height);
	
    res.setHeader('Content-Type', 'image/png');
    draw(x,y, mag, id, width, height).pngStream().pipe(res);
})

/**
 * Testing - Entry point for Cloud Function - does create canvas code only...
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.getSet = (req, res) => {
//  let message = req.query.message || req.body.message || 'Hello World!';
//  res.status(200).send(message);

    var mag = parseFloat(req.query.mag);
	var x = parseFloat(req.query.x);
	var y = parseFloat(req.query.y);
	var id = parseFloat(req.query.id);
	var width = req.query.width;
	var height = req.query.height;
		
	if (width == null) width = 400; else width = parseInt(width);
	if (height == null) height = 400; else height = parseInt(height);
	
    res.setHeader('Content-Type', 'image/png');
    draw(x,y, mag, id, width, height).pngStream().pipe(res);
};


//module.exports = router;

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

