var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var request = require('request');
var express = require('express');
var router = express.Router();
var passport = require('passport');
var reqpro = require('request-promise');
var utils = require('../lib/utils.js');


router.post('/',function(req,res,next){

        
        var clientName = req.body.clientName;
        var serverName = req.body.serverName;
        var username = req.body.txt_username;
        var password = req.body.txt_password;
        var secureConnection = req.body.secureConnection;
        var authType = req.body.authType;
        global.clientName = clientName;
        global.serverName = serverName;

        if(typeof clientName == 'undefined' || clientName.trim().length==0)
            res.redirect('/?errorString=Invalid+clien+name+or+server+name.')

        if(secureConnection)
            global.client_url = 'https://';
        else   
            global.client_url = 'http://';

        
        if(typeof(serverName)!='undefined' && serverName.trim().length>0)
            serverName = '.' + serverName;
        
        global.client_url = global.client_url.trim() + clientName.trim() + serverName.trim();
        console.log(global.client_url)

        request(client_url + '/MobileAPI/DeskBookingService.svc/Configuration/GetGlobalSettings', function (error, response, body) {


            if (!error && response.statusCode == 200) {
                response = utils.decryptJson(JSON.parse(body));
				console.log(response);
                if(response.CallResponse.ResponseCode===100)
                {
                    global.oauth_url = response.PingOAuthURL;
                    global.client_id = response.PingOAuthClientID;
                    
                    if(response.ConnectionType == 'SSO' && typeof(authType) == "undefined")
                    {
                        var magic_url = response.PingOAuthURL + '/as/authorization.oauth2?&idp=' + response.PingOAuthIdpAdapterID + '&prompt=login&response_type=code&scope=openid&code_challenge=&redirect_uri=http%3A%2F%2Flocalhost%3A15938%2Fsignin-pingfederate&client_id=' + response.PingOAuthClientID;
                        res.redirect(magic_url);
                    }
                    else if(response.ConnectionType == 'Forms' || typeof(authType) != "undefined"){
                        
                        if(typeof(username) == "undefined" || typeof(password) == "undefined")
                            res.redirect('/?authType=forms')
                        else
                        {
                            var request2 = require('request');
                            var options =  {
                                "UserName":username,
                                "Password": utils.encrypt(password),
                                "ConnectionType":1,
                                "CallingFrom":1
                                };
                                console.log(options);
                                request2.post({
                                    headers: {'content-type' : 'application/json'},
                                    url:     client_url + '/LoginAPI/auth/authenticateusersecure',
                                    json:    options
                                    }, function(error, response, body){
                                    console.log(body);
                                    if(typeof(body.Result) != 'undefined' && typeof(body.Result.LoginResult) != 'undefined' ){
                                        switch(body.Result.LoginResult){
                                            case 1:
                                                res.redirect('/?errorString=Username+or+Password+is+invalid.');
                                                break;
                                            case 2:
                                                global.loginData = body;
                                                global.SessionGUID = body.Result.Token;
                                                res.redirect('/api/CreateSession');
                                                break;
                                            case 0:
                                                res.redirect('/?errorString=Username+account+suspended.');
                                                break;
                                            case -1:
                                                res.redirect('/?errorString=Username+must+change+password.');
                                                break;
                                            case -2:
                                                res.redirect('/?errorString=AD+User+not+registered+in+system.');
                                                break;
                                            default:
                                                res.redirect('/?errorString=Unknown+error.');
                                                break;

                                                
                                        }

                                    }
                                        
                                });
                            
                        }
                    }
                }
            }
        });
    
});

module.exports = router;
