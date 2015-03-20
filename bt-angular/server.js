var express = require('express');
var fs = require('fs');
var xml2js = require('xml2js');
var q = require('q');
var xmlbuilder = require('xmlbuilder');
var busboy = require('busboy');

var app = express();

app.use(express.static(__dirname + '/public'));

app.listen(process.argv[2]);

app.get('/json', function(req, res) {

		getSP80053P().then( function(data) {
			console.log("sending json");
			res.send(data);
		})

})

app.post('/upload', function(req, res) {
	
	console.log("upload")

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

})

app.post('/xml', function(req, res) {
	req.setEncoding('utf8');
	req.on('data', function(data) {
		if(data.length > 2) {
			var parsed = JSON.parse(data);
			
			var xml = xmlbuilder.create('root');

			xml = xml.ele(function() {
				var results = [];
				for(var key in parsed) {
					var obj = {};
					obj[key] = parsed[key];
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