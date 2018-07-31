var express = require('express');
var router = express.Router();
var request = require('request');
var express = require('express');
var router = express.Router();
var passport = require('passport');
var reqpro = require('request-promise');
var moment = require('moment');


parseSession = function(data){
    
    console.log("Parse Data:" + data.toString())
    if(typeof data !== 'object')
        global.Session = JSON.parse(data);
    else
        global.Session = data;
    global.SessionGUID = global.Session.SessionGUID;
    global.UserProfile = {Locations:[]};
        

    for(c in global.Session.Countries)
        {
            for(l in global.Session.Countries[c].Locations)
            {
                global.UserProfile.Locations.push({Id: global.Session.Countries[c].Locations[l].Id, Name: global.Session.Countries[c].Name + ' => ' + global.Session.Countries[c].Locations[l].Name});

            }
        }
    
        console.log(global.UserProfile);
    
};

router.get('/CreateSession', function(req, res) {

      if(typeof global.bearer === 'undefined' && typeof global.SessionGUID === 'undefined' )
            res.redirect('/?errorString=Unauthorized');
        else
            {
                // SSO Login
                if(typeof bearer !== 'undefined')
                {
                    var options = {
                        url: global.client_url + '/MobileAPI/MobileService.svc/User/GetSessionToken',
                        headers: {
                        'Authorization': 'Bearer ' + global.bearer_data.access_token
                        }
                        };
                    var target = request.get( options, function(err,data){
                            parseSession(data.body);
                            
                            
                            var options = {
                                url: global.client_url + '/MobileAPI/MobileService.svc/User/LoginInformations?token=' + global.SessionGUID + '&languageId=1&currentDateTime=' + moment().format('DD-MM-YYYY'),
                                headers: {
                                    'Authorization': 'Bearer ' + global.bearer_data.access_token
                                    }
                                };

                            var target = request.get( options, function(err,data){
                                if(err)
                                    res.redirect('/?errorString=' + err.toString());
                                else{
                                    parseSession(data.body);
                                    res.redirect('/dashboard')
                                }
                            })
                    })
                }
                //FORMS Login
                else if(typeof global.SessionGUID !== 'undefined')
                {
                    var options = {
                        url: global.client_url + '/MobileAPI/MobileService.svc/User/LoginInformations?token=' + global.SessionGUID + '&languageId=1&currentDateTime=' + moment().format('DD-MM-YYYY'),
                        };
                    var target = request.get( options, function(err,data){
                        if(err)
                            res.redirect('/?errorString=' + err.toString());
                        else{
                            parseSession(data.body);
                            res.redirect('/dashboard')
                        }
                    })
                }
                else
                    res.redirect('/?errorString=Unauthorized');
                
            }
     

});


router.post('/RoomBooking/Search', function(req, res) {
    
    
      if(typeof global.bearer === 'undefined' && typeof global.SessionGUID === 'undefined' )
          res.redirect('/?errorString=Unauthorized');
      else
          {
            var options = {};

            postdata = {
                StartDate: '/Date(' + moment(req.body.txt_start_date,'M/D/YYYY H:mm').valueOf() + ')/',
                EndDate: '/Date(' + moment(req.body.txt_end_date,'M/D/YYYY H:mm').valueOf() + ')/',
                  locationID: [
                    parseInt(req.body.txt_location_id) || 0
                ],
                groupID: [0],
                floorNum: [],
                numberAttending: parseInt(req.body.txt_number_attending)  || 0,
                UserID: global.SessionGUID,
                languageId: '1',
                pageIndex: 1,
                pageSize: 10
              }
            
            if(typeof global.bearer !== 'undefined')
                options = {
                  url: global.client_url + '/MobileAPI/MobileService.svc/RoomBookings/RoomSearch',
                  headers: {
                    'Authorization': 'Bearer ' + global.bearer_data.access_token
                    },
                  json: postdata
                  };
            else
                options = {
                url: global.client_url + '/MobileAPI/MobileService.svc/RoomBookings/RoomSearch',
                json: postdata
                };
            var target = request.post( options, function(err,data){

                var response = data.body;
                if(err)
                    res.redirect('/RoomBooking?errorString=' + err.toString());
                    
                if(typeof response !=='undefined' && typeof response.Error!== 'undefined' && typeof response.Error.ErrorDescription !== 'undefined')
                {
                    if(response.Error.ErrorDescription.length>0)
                        res.redirect('/RoomBooking?errorString=' + response.Error.ErrorDescription);
                    else{
                        global.lastResponse = JSON.stringify(response)  ;
                        res.redirect('/RoomBooking?success=true');
                    }
                    
                }
                else
                    {
                        global.lastResponse = JSON.stringify(response) 
                        res.redirect('/RoomBooking?success=false');
                    }
                    
                    
            })
            
          }
    

});


module.exports = router;
