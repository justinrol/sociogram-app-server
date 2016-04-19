var express = require('express');
var router = express.Router();
var http = require ('http');

var server_add = '139.59.162.2';
var server_port = 3000;

var attribute_list = ["Extraversion","Honest","Descent","Charming","Generous","Kind","Confident","Flexible","Modest","Relaxed"];

var get_options = {
	host : server_add,
	port : server_port,
};

var post_options = {
	host : server_add,
	port : server_port,
	method : 'POST',
	headers : {
			'Content-Type': 'application/json'
		}
};

var get_request = function(option_path,res){
	var str = '';
	var options = get_options;
	options.path = option_path;
	
	http.request(options,function(resp){
		resp
		.on('error',function(err){
			return res.status(500).json({success:false,data:err});
		})
		.on('data',function(chunk){
			str += chunk;
		})
		.on('end',function(){
			str = JSON.parse(str);
			return res.json(str);
		});	
	}).end();
};

var post_request = function(option_path,data,res){
	var str = '';
	var options = post_options;
	options.path = option_path;

	var post_req =http.request(options,function(resp){
					resp
					.on('data',function(chunk){
						str += chunk;
					})
					.on('end',function(){
						str = JSON.parse(str);
						return res.status(200).json(str);
					})
				})
				.on('error',function(err){
					return res.status(500).json({success:false,data:err});
				})

		post_req.write(data);
		post_req.end()
}

router.get('/getuserlist/:user', function(req, res) {
	var user = req.params.user;
	get_request(`/getuserlist/${user}`,res);
});

router.get('/getuserdetail/:user',function (req, res){
	var userser = req.params.user;
	get_request(`/getuserlist/${user}`,res);
});

router.get('/getfriendlist/:user', function(req, res) {
	var user = req.params.user;
	get_request(`/getfriendlist/${user}`,res);
});

router.get('/getstats/:attribute',function(req,res){
	var att = req.params.attribute;
	get_request(`/getstats/${att}`,res);
});

router.get('/getattributelist',function(req,res){
	return res.json(attribute_list);
});

router.get('/userstats/:username/:attribute',function(req,res){
	var user = req.params.username;
	var att = req.params.attribute;
	get_request(`/userstats/${user}/${att}`)
});

router.get('/contribute',function (req,res){
	
	var dummy_data = {
		user_from : 'x',
		user_to : 'Steezy',
		att : 'honest',
		quantity : 0.9
	};

	dummy_data = JSON.stringify(dummy_data);
	post_request('/contribute',dummy_data,res);
});

router.get('/signup',function(req,res) {

	var dummy_data = {
		username : "JustinRol",
		name : "Kim Hyojong",
		password : "Kimhyojong",
		email : "justin.kim.15@ucl.ac.uk",
		gender : 'F',
		age : 100
	};
	dummy_data = JSON.stringify(dummy_data);
	post_request('/signup',dummy_data,res);

});

router.post('/post',function(req,res){
	console.log(new Date());
	var dummy_data = {
		date : new Date(), 
		author : "Someone Fabulous",
		recipient : "Receiver",
		content : "Lecture about life",
		is_private : false,
		agree : 10,
		disagree : 20
	};
	dummy_data = JSON.stringify(dummy_data);
	post_request('/post',dummy_data,res);
})

router.post('/post-from',function(req,res){
	var dummy_data = {author : "Someone Fabulous"};
	dummy_data = JSON.stringify(dummy_data);
	post_request('/post-from',dummy_data,res);
})

router.post('/post-to',function(req,res){
	var dummy_data = {recipient : "Receiver"};
	dummy_data = JSON.stringify(dummy_data);
	post_request('/post-to',dummy_data,res);
})

function get_mean(arr){
	var sum = 0;
	console.log(arr);
	for(var elem in arr){
		elem = arr[elem];
		for(var key in elem){
			sum += elem[key];	
		}
	}
	return (sum / arr.length).toFixed(3);
}

function get_variance(arr){
	var sum = 0;
	var avg = get_mean ( arr );
	for(var elem in arr) {
		elem = arr[elem];
		for(var key in elem){
		sum += (elem[key] - avg) * (elem[key] - avg);
		}
	}
	return (sum / arr.length).toFixed(3);
}

module.exports = router;
