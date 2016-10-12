const app = require('express')();
const port = 9000;
var callCount = 0;
app.get('/success_on_first_attempt', function (req, res) {
    res.set('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.send('Success on the first attempt');
});

app.get('/success_on_second_attempt', function (req, res) {

    res.set('Access-Control-Allow-Origin', 'http://localhost:8080');

    if (callCount % 2) {
        res.send('Success on second attempt :: call count' + callCount);
    } else {
        res.status(500);
        res.send();
        callCount++;
    }
});

app.get('/timedout', function (req, res) {
    setTimeout(function () {
        res.set('Access-Control-Allow-Origin', 'http://localhost:8080');
        res.send('timed out !!!');
    }, 11000)
});

app.listen(port);

console.log('Magic happens at http://localhost:' + port);