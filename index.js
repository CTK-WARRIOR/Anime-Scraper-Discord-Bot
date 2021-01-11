const http = require('http');
const express = require('express');
const app = express();
var server = http.createServer(app);

app.get("/", (request, response) => {
  console.log(`Ping Received.`);
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end("Watch And Have Fun!")
});

app.get("/:vdo", (request, response) => {
  let vdo = request.params.vdo;
  response.set('Content-Type', 'text/html');
  response.send(Buffer.from(`<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
video {
  max-width: 100%;
  height: auto;
}
</style>
</head>
<body style="text-align:center;">

<video width="400" controls>
 <source src="https://gogo-play.net/goto.php?url=${vdo}" type="video/mp4">
  Your browser does not support HTML5 video.
</video>

<p>Join my discord plz :v https://withwin.in/dbd</p>

</body>
</html>
`));
})

const listener = server.listen(process.env.PORT, function() {
  console.log(`Your app is listening on port ` + listener.address().port);
});

require("./anime.js")
// 