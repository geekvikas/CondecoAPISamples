var express = require('express');
var router = express.Router();
var request = require('request');
var express = require('express');
var router = express.Router();
var passport = require('passport');
var reqpro = require('request-promise');
var moment = require('moment');

router.get('/CreateSession', function(req, res) {
      var bearer = global.bearer;
      var sessionguid = global.SessionGUID;

      if(typeof bearer === 'undefined' && typeof sessionguid === 'undefined' )
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
                    console.log(options);
                    var target = request.get( options, function(err,data){
                            console.log(data.body)
                            global.session = JSON.parse(data.body);
                            global.SessionGUID = global.session.SessionGUID;
                            
                            
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
                                    console.log(data.body)
                                    global.session = JSON.parse(data.body);
                                    global.SessionGUID = global.session.SessionGUID;
                                    res.redirect('/dashboard')
                                }
                            })
                    })
                }
                //FORMS Login
                else if(typeof sessionguid !== 'undefined')
                {
                    var options = {
                        url: global.client_url + '/MobileAPI/MobileService.svc/User/LoginInformations?token=' + global.SessionGUID + '&languageId=1&currentDateTime=' + moment().format('DD-MM-YYYY'),
                        };
                    var target = request.get( options, function(err,data){
                        if(err)
                            res.redirect('/?errorString=' + err.toString());
                        else{
                            console.log(data.body)
                            global.session = JSON.parse(data.body);
                            global.SessionGUID = global.session.SessionGUID;
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
                StartDate: '/Date(' + req.body.txt_start_date + ')/',
                EndDate: '/Date(' + req.body.txt_end_date + ')/',
                  locationID: [
                    parseInt(req.body.txt_location_id) || 0
                ],
                groupID: [parseInt(req.body.txt_group_id)],
                floorNum: [
                    
                ],
                numberAttending: parseInt(req.body.txt_number_attending)  || 0,
                UserID: global.SessionGUID,
                languageId: '1',
                pageIndex: 1,
                pageSize: 10
              }
              
            if((parseInt(req.body.txt_floor_number) || 0)>0)
              postdata.floorNum = [parseInt(req.body.txt_floor_number)];

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
            console.log(options);
            var target = request.post( options, function(err,data){

                var response = data.body;
                if(err)
                    res.redirect('/RoomBooking?errorString=' + err.toString());
                    
                console.log(response);
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
