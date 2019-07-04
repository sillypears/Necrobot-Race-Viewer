var express = require('express');
var request = require('request');
var router = express.Router();


function formatTime(t) {
    let w = Math.floor(t/100)
    let ms = Math.floor(((t/100) - w) * 100)
    let s = Math.floor(t/100 % 60)
    let m = Math.floor((t/(100*60)) % 60)
    let h = Math.floor((t/(100*60*60)) % 24)
    let fTime = ""
    if (h > 0 ) {
        fTime += String(h).padStart(2, '0') + ":"
    }
    if (m > 0) {
        fTime += String(m).padStart(2, '0') + ":"
    }
    fTime += String(s).padStart(2, '0') + "."
    fTime += String(ms).padStart(2, '0')
    return fTime
}

function formatDate(d) {
    fDate = new Date(d)
    fDate.setHours(-2)
    return fDate.toLocaleDateString() + " " + fDate.toLocaleTimeString()
}

router.get('/race', function(req, res, next){
    uri = 'http://localhost:'+ req.app.get('port') + '/api/race/'
    request({
      uri: uri,
    },
    function(error, response, body) {
      if (!error &&  response.statusCode === 200) {
        let raceData = {}
        raceData = JSON.parse(body)
        for(let i = 0, len = raceData.length; i < len; i++) {
            // raceData[i]["fTime"] = formatTime(raceData[i]["time"])
            raceData[i]["fDate"] = formatDate(raceData[i]["timestamp"])
            try {
                raceData[i]["splitRacers"] = raceData[i]["racers"].split(',')
                if (raceData[i]["splitRacers"].length < 2) {
                    throw 'Only 1 racer found'
                }
            }
            catch {
                raceData[i]["splitRacers"] = raceData[i]["racers_discord"].split(',')
            }

        }
        res.render('races', {title: "Last " + raceData.length + " Races", raceData: raceData})
      } else {
        console.log(error)
        res.render('races', {title: "No Races Found", raceData:{}, raceCount: 0})
    }
    });
});

router.get('/race/:race', function(req, res, next){

});

module.exports = router
