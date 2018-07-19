var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var request = require('request');
var express = require('express');
var router = express.Router();
var passport = require('passport');
var reqpro = require('request-promise');

//Call back here
router.get('/', function(req, res) {
      // Start the request
      var oauth_code = req.query.code;
      
      var options = {
        method: 'POST',
        uri: global.oauth_url + '/as/token.oauth2',
        form: {
              grant_type: 'authorization_code',
              client_id: global.client_id,
              client_secret: '',
              redirect_uri: 'http://localhost:15938/signin-pingfederate',
              code:oauth_code
        },
        json: true  
    };
    
    reqpro(options)
        .then(function (body) {
            global.bearer_data = body;
            global.bearer = body.access_token;
            console.log(body);
            res.redirect("/api/CreateSession");
        })
        .catch(function (err) {
          res.send(err);
        });

    
      

});


module.exports = router;
