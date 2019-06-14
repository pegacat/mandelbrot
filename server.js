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
  res.setHeader('Content-Type', 'image/png');
  draw(x,y, mag, id).pngStream().pipe(res);
})


//module.exports = router;

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

