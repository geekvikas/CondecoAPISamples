var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var request = require('request');
var express = require('express');
var router = express.Router();
var passport = require('passport');
var reqpro = require('request-promise');


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Authentication',authType: req.query.authType,errorString:req.query.errorString });
});


router.get('/dashboard', function(req, res, next) {
  if(!(global.bearer || global.SessionGUID))
    res.redirect("/?errorString=Invalid+Session")
  else{
    console.log(global.bearer)
    console.log(global.SessionGUID)
    res.render('dashboard', { title: 'Dashboard'});
  }
});

router.get('/roombooking', function(req, res, next) {
  if(!(global.bearer || global.SessionGUID))
    res.redirect("/?errorString=Invalid+Session")
  else
    res.render('roombooking', { title: 'Room Booking - NOT WORKING',errorString:req.query.errorString,success:req.query.success});
});

router.get('/deskbooking', function(req, res, next) {
  if(!(global.bearer || global.SessionGUID))
    res.redirect("/?errorString=Invalid+Session")
  else
    res.render('deskbooking', { title: 'Desk Booking - NOT WORKING',errorString:req.query.errorString });
});
module.exports = router;
