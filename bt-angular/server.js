var express = require('express');
var fs = require('fs');
var xml2js = require('xml2js');
var q = require('q');
var xmlbuilder = require('xmlbuilder');
var busboy = require('busboy');

var app = express();

app.use(express.static(__dirname + '/public'));

app.listen(8004);

app.get('/json', function(req, res) {

		// getSP80053P().then( function(data) {
		// 	console.log("sending json");
		// 	res.send(data);
		// })
		fs.readFile(__dirname+'/800-53-controls.json', function(err, data) { 
			var toSend = JSON.parse(data);
			console.log("sending json");
			res.send(toSend);

		});
	});

app.post('/upload', function(req, res) {
	
	console.log("upload")

	var bus = new busboy({ headers: req.headers });

	bus.on('file', function(fieldname, file, filename, encoding, mimetype) {
       file.on('data', function(data) {
        var parser = new xml2js.Parser();
        console.log("data: "+data);
        parser.parseString(data, function(err, result) {
        	console.log(err);
	        res.send(result);
	    });
      });
    });
    bus.on('end', function() {
    	res.end();
    });
	
    req.pipe(bus);

})

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
					obj['node'] = parsed.records[key];
					results.push(obj);
				}
				return results;
			});
			xml = xml.end({ pretty: true});
			
			res.send(xml);
		}

	});
	
})

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
