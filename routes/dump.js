var express = require('express');
var router = express.Router();
var conf = require('config');
var request = require('request');
var querystring = require('querystring');
var url = require('url');
var sprintf = require("sprintf-js").sprintf;
var fs = require('fs');
var httpProxy = require("http-proxy");
var http = require('http');
var md5 = require('md5');
var lineReader = require('readline');
var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;
var readLastLines = require('read-last-lines');


var columns = ["Len", "Typ", "Nro", "Tim", "oiw", "oTy", "oAd", 
				"diw", "dTy", "dAd", "SMC", "dat", "tcl", "mLn", "pid", 
				"srr", "sde", "dcs", "ame", "pri", "sir", "ece", "smr", "sme", 
				"iTm", "pce", "fid", "oms", "dms", "vms", "dte", "dath", "davh",
				 "mapid", "ccinfo", "userdata", "nodeid", "Chk"];


router.post('/dump', function(req, res, next) {
	console.log(JSON.stringify(req.files));
	if (!req.files)
    return res.status(400).send('No files were uploaded.');

  let dumpFile = req.files.dumpFile;
  var location = global.uploadsDir+dumpFile.name;

  // Use the mv() method to place the file somewhere on your server
  dumpFile.mv(location, function(err) {
    if (err){
      return res.status(500).send(err);
    } else {
    	readLastLines.read(location, 1).then((lines) => dumpMongo(location, parseInt(lines.split(":")[3].trim())));
    	res.send('SUCCESS');
	}
  });

})



dumpMongo = function (dir, num) {
	const rl = lineReader.createInterface({
	  input: fs.createReadStream(dir)
	});
	var lines = [], arr = [];
	var count = 0,index = 0;
	var ended = false;
	rl.on('line', function (line) {	
		  console.log('Line from file:', line);
		  		console.log("lines",lines);
		  		if(count != 0 && count <= num){
		  			// lines[index++] = line;
		  				bulkInsertMongo(line);
		  		}
		  		// if(count == num && lines.length > 0){
		  		// 	bulkInsertMongo(lines);	
		  		// }

		  	count++;
	});

}

bulkInsertMongo = function(lines){
	console.log('$$$$$$$$$$$$$$$$$', lines);
	var obj={};
	console.log("here");
	var mongoArray = [];
	var mongoObj = {"insertOne" : {}};
	console.log("*******",lines);
		// for(i = 0 ; i< lines.length; i++){
		 	arr = lines.split("||")[1].split("~|~");
		 	if(arr.length == columns.length){
			 	for(j = 0; j< columns.length; j++ ){
			 		obj[columns[j]] = arr[j];
			 	}
			 }
		 	mongoObj["insertOne"] = obj;
		 	mongoArray[0] = mongoObj;
		 	mongoJob(mongoArray);
		 // }
}	

mongoJob = function (mongoArray) {
	var currentdate = new Date(); 
	var datetime = "Last Sync: " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();

	MongoClient.connect(global.mongoUrl, function(err, db) {
	  if(err) { 
	  	console.log(err); 
	  }
	  var res = db.collection('logResults').bulkWrite(mongoArray);
	  console.log(res+" | "+datetime);
	});
}





 module.exports = router;