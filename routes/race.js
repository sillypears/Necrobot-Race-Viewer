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
    var secretArray = JSON.parse(req.app.get('secret'))
    var shouldShow = (secretArray.indexOf(req.connection.remoteAddress) > -1 ) ? false : true
    uri = req.app.get('protocol') + '://' + req.app.get('host') + ':' + req.app.get('port') + '/api/race/'
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
                if (raceData[i]["racers"].split(',').length < raceData[i]["racers_discord"].split(',').length) {
                    throw 'Less twitch racers than discord racers, using discord'
                }
            }
            catch {
                raceData[i]["splitRacers"] = raceData[i]["racers_discord"].split(',')
            }

        }
        res.render('races', {title: "Last " + raceData.length + " Races", navTitle: "races", raceData: raceData, show: shouldShow})
      } else {
        console.log(error)
        res.render('races', {title: "No Races Found", navTitle: "races", raceData:{}, raceCount: 0, show: shouldShow})
    }
    });
});

router.get('/race/:race', function(req, res, next){
    var secretArray = JSON.parse(req.app.get('secret'))
    var shouldShow = (secretArray.indexOf(req.connection.remoteAddress) > -1 ) ? false : true
    
    raceID = req.params.race
    if (isNaN(raceID)) {
        shouldShow = false
    }
    uri = req.app.get('protocol') + '://' + req.app.get('host') + ':' + req.app.get('port') + '/api/race/' + raceID;
    console.log(uri)
    request({
      uri: uri,
    },
    function(error, response, body) {
      if (!error &&  response.statusCode === 200) {
        let raceData = {}
        let raceDate = ""
        let raceSeed = ""
        raceData = JSON.parse(body)
        for(let i = 0, len = raceData.length; i < len; i++) {
            // raceData[i]["fTime"] = formatTime(raceData[i]["time"])
            raceData[i]["finished"] = true
            raceData[i]["fDate"] = formatDate(raceData[i]["timestamp"])
            raceData[i]["racerName"] = (raceData[i]["twitch_name"] === null) ? raceData[i]["discord_name"] : raceData[i]["twitch_name"]
            raceDate = raceData[i]["timestamp"]
            raceSeed = raceData[i]["seed"]
            if (raceData[i]["level"] > -2) {
                raceData[i]["finished"] = false
            }
        }
        res.render('race', {
            title: "Race " + raceID, 
            navTitle: "race", 
            raceID: raceID, 
            show: shouldShow, 
            raceData: raceData,
            raceDate: raceDate,
            raceSeed: raceSeed
        })
      } else {
        console.log(error)
        res.render('race', {
            title: "Race HWAT", 
            navTitle: "race", 
            raceID: "HWAT", 
            show: shouldShow, 
            raceData: {},
            raceDate: raceDate,
            raceSeed: raceSeed
        })
    }
    });

});

module.exports = router

