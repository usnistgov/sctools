// This is a NodeJS Express server operating on port 8004 

var express = require('express');
var fs = require('fs');
var xml2js = require('xml2js');
var q = require('q');
var xmlbuilder = require('xmlbuilder');
var busboy = require('busboy');

var app = express();

app.use(express.static(__dirname + '/public'));

app.listen(8004);

// getSP80053P().then(function(data, err) {
// 	fs.writeFile(__dirname+'/800-53-controls-processed.xml', JSON.stringify(getControls(data['controls:controls']['controls:control'])));

// });

// This is a route for the web app to get a datastructure containing pertinent information on the sp800-53 document
app.get('/json', function(req, res) {

		// getSP80053P().then( function(data) {
		// 	console.log("sending json");
		// 	res.send(data);
		// })
		// fs.readFile(__dirname+'/800-53-controls.json', function(err, data) { 
		// 	var toSend = JSON.parse(data);
		// 	console.log("sending json");
		// 	res.send(toSend);

		// });
fs.readFile(__dirname+'/800-53-controls-processed.json', function(err, data) { 
			var toSend = JSON.parse(data);
			console.log("sending json");
			res.send(toSend);

		});
	});


// This is a post route for uploading a file (it recieves an xml file and returns a json object over the network through the streaming interface)
app.post('/upload', function(req, res) {
	
	console.log("upload");

	var bus = new busboy({ headers: req.headers });

	bus.on('file', function(fieldname, file, filename, encoding, mimetype) {
       file.on('data', function(data) {
        var parser = new xml2js.Parser();
        parser.parseString(data, function(err, result) {
	        res.send(result);
	    });
      });
    });
    bus.on('end', function() {
    	res.end();
    });
	
    req.pipe(bus);

});

// This is a post route for transforming a user's session on the web app into a downloadable xml document
app.post('/xml', function(req, res) {
	req.setEncoding('utf8');
	req.on('data', function(data) {
		if(data.length > 2) {
			var parsed = JSON.parse(data);
			
			var xml = xmlbuilder.create('root');
			
			xml = xml.ele(function() {
				var results = [];
				results.push(parsed.profile);
				for(var key in parsed.records) {
					var obj = {};
					obj.node = parsed.records[key];
					results.push(obj);
				}
				return results;
			});
			xml = xml.end({ pretty: true});
			
			res.send(xml);
		}

	});
	
});

	// This returns a basic JSON representation of the 800-53 spec
	function getSP80053P () {
		var def = q.defer();
		if(getSP80053P.data) {
			def.resolve(getSP80053P.data);
		} else {
			var parser = new xml2js.Parser();
			fs.readFile(__dirname+'/800-53-controls.xml', function(err, data) { 
					if(err) {
						console.log(err+"I DID NOT FIND IT!");
						return;
					} else {
						console.log("SUCCESS");
					}
					parser.parseString(data, function(err, result) {
						getSP80053P.data = result;
						def.resolve(getSP80053P.data);
					});
				});
		}
		return def.promise;
	}

	// this is the function meant to be used as a constructor for userRecords
function Record( uid, state, dirty, baseline, family, priority, title , enhancements) {
            this.uid = uid;
            this.state = state;
            this.dirty = dirty?true:false;
            this.mergeConflict = 0;
            this.inherit = null;
            this.comments = {
                text:null,
                rationale:null,
                link:null
            };
            this.config = {
                baseline:baseline,
                family:family,
                priority:priority,
                title:title,
                enhancements:enhancements
            };
        }
	// this  code is used to transform 800-53-controls.json into 800-53-controls-processed.json
	function getControls(data) {
		var service = { recordDict: {}};
			for( var i = 0; i < data.length; i ++ ) {
	            var temp = new Record( data[i].number[0],
	                                   undefined,                                   
	                                   false,    
	                                   data[i]['baseline-impact'],
	                                   data[i].family?data[i].family[0]:null,
	                                   data[i].priority?data[i].priority[0]:null, 
	                                   data[i].title?data[i].title[0]:null,
	                                   null
	                                   );

	            if( data[i]['control-enhancements'] && 
	                data[i]['control-enhancements'][0] && 
	                data[i]['control-enhancements'][0]['control-enhancement'] ) {
	                temp.config.enhancements = [];
	                var enhanceList = data[i]['control-enhancements'][0]['control-enhancement'];
	                for( var j = 0; j < enhanceList.length; j ++) {
	                    var id = enhanceList[j].number[0].replace(/[ \(\)]/g, "-")
	                                                     .replace(/(.*)-$/, "$1")
	                                                     .replace(/--/g, "-");
	                    temp.config.enhancements.push(id);
	                    var enhanceItem = new Record(  id,
	                                                   undefined,                                   
	                                                   false,    
	                                                   enhanceList[j]['baseline-impact'],
	                                                   temp.config.family,
	                                                   temp.config.priority, 
	                                                   enhanceList[j].title?enhanceList[j].title[0]:null,
	                                                   undefined
	                                                   );

	                    service.recordDict[enhanceItem.uid] = enhanceItem;
	                }
	            }
	            service.recordDict[temp.uid] = temp;
	           
	        }
	    return service.recordDict;
	}
