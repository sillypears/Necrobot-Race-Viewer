var express = require('express');
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  uri = 'http://localhost:'+ req.app.get('port') + '/api/users'
  request({
    uri: uri,
  },
  function(error, response, body) {
    if (!error &&  response.statusCode === 200) {
      userData = JSON.parse(body)
      res.render('index', { title: 'Necrobot Race Statistics', navTitle: "home", userData: userData });
    } else {
      console.log(error)
      res.render('index', { title: 'Necrobot Race Statistics', navTitle: "home", userData: [] });
    }
  });
});

module.exports = router;