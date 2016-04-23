var express = require('express');
var router = express.Router();
var http = require ('http');

var server_add = '139.59.162.2'';
// var server_add = 'localhost'
var server_port = 3000;

var attribute_list = ["Extraversion","Honest","Decent","Charming","Generous","Kind","Confident","Flexible","Modest","Relaxed"];

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

						return res.json(str);
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
	var user = req.params.user;
	get_request(`/getuserdetail/${user}`,res);
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

router.post('/contribute',function (req,res){
	
	var dummy_data = {
		user_from : 'x',
		user_to : 'Steezy',
		att : 'honest',
		quantity : 0.9
	};
	dummy_data = JSON.stringify(dummy_data);
	
	req.body = JSON.stringify(req.body);
	post_request('/contribute',req.body,res);
});

router.post('/signup',function(req,res) {

	var dummy_data = {
		username : "JustinRol",
		name : "Kim Hyojong",
		password : "Kimhyojong",
		email : "justin.kim.15@ucl.ac.uk",
		gender : 'F',
		age : 100
	};
	dummy_data = JSON.stringify(dummy_data);

	req.body = JSON.stringify(req.body);
	post_request('/signup',req.body,res);

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

	req.body = JSON.stringify(req.body);
	dummy_data = JSON.stringify(dummy_data);
	post_request('/post',req.body,res);
})

router.post('/post-from',function(req,res){
	var dummy_data = {author : "Someone Fabulous"};
	dummy_data = JSON.stringify(dummy_data);

	req.body = JSON.stringify(req.body);
	post_request('/post-from',req.body,res);
})

router.post('/post-to',function(req,res){
	var dummy_data = {recipient : "Receiver"};
	dummy_data = JSON.stringify(dummy_data);

	req.body = JSON.stringify(req.body);
	post_request('/post-to',req.body,res);
})

router.post('/login',function(req,res){
	var dummy_data = {
		username : 'Steezy',
		password : 'Hello'
	}
	dummy_data = JSON.stringify(dummy_data);

	req.body = JSON.stringify(req.body);
	identify('/login',req.body,res);
})

router.get('/listfn',function(req,res){
	var  resJson = {
	"getuserlist" : "user",
	"getuserdetail" : "user",
	"getfriendlist" : "user",
	"getstats" : "attribute name. for list of attribute, use /getattributelist",
	"userstats" : "/userstats/(username)/(attribute)",
	"contribute" : "in the body, need : user_from, user_to, att, quantity",
	"signup" : "in the body, need : username, name, password, email, gender, age",
	"post" : `in the body, need : Date(Format: ${new Date()}), author, recipient,content, is_private(true or false), agree,disagree(default will be 0)`,
	"post-from" : 'body, name of author',
	"post-to" : 'body, name of recipient',
	"login" : 'body, username and password'
	}
	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify(resJson, null, 3));
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

var identify = function(option_path,data,res){
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
						console.log(str.success);
						if(!!str.success){

						} else {

						}
						console.log("response: "+res);
						res.json(str.success);
					})
				})
				.on('error',function(err){
					res.status(500).json({success:false,data:err});
				})

		post_req.write(data);
		post_req.end()
}

module.exports = router;
