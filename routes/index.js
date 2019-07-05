var express = require('express');
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  var secretArray = JSON.parse(req.app.get('secret'))
  var shouldShow = (secretArray.indexOf(req.connection.remoteAddress) > -1 ) ? false : true
    
  uri = req.app.get('protocol') + '://' + req.app.get('host') + ':'+ req.app.get('port') + '/api/users'
  request({
    uri: uri,
  },
  function(error, response, body) {
    if (!error &&  response.statusCode === 200) {
      userData = JSON.parse(body)
      res.render('index', { title: 'Necrobot Race Statistics', navTitle: "home", userData: userData, show: shouldShow});
    } else {
      console.log(error)
      res.render('index', { title: 'Necrobot Race Statistics', navTitle: "home", userData: [], show: shouldShow});
    }
  });
});

module.exports = router;
