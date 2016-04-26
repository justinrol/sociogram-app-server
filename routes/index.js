var express = require('express');
var router = express.Router();
var http = require ('http');
var fs = require('fs');


var server_add = '139.59.162.2';
// var server_add = 'localhost'
var server_port = 3000;

var attribute_list = ["Extraversion","Honest","Decent","Charming","Generous","Kind","Confident","Flexible","Modest","Relaxed"];

router.get('/profile-photo',function(req,res){
	var username = req.body.username;
	var filepath = '/public/image/' + username;
	res.sendFile(filepath);
})

router.post('/profile-photo',function(req,res){
	var tmp_path = req.files.profile.path;
	var username = req.body.username;
	var target_path = './public/images/' + username;

	fs.rename(tmp_path, target_path, function(err){
		if(err) throw err;

		fs.unlink(tmp_path,function(){
			if(err) {
				res.statsu(500).json({success:false,data:err});
			}
			res.status(200).json({success:true});
		});
	});
});

var get_options = {
	host : server_add,
	port : server_port
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

		.on('data',function(chunk){
			str += chunk;
		})
		.on('end',function(){
			str = JSON.parse(str);
			res.json(str);
		})
		.on('error',function(err){
			console.log(err);
			return res.status(500).json({success:false,data:err});
		})
	}).end();
};

var post_request = function(option_path,data,res){
	var str = '';
	var options = post_options;
	console.log(data);
	options.path = option_path;	
		console.log(options);
	var post_req =http.request(options,function(resp){
					resp
					.on('error',function(err){
						console.log(err);
						return res.status(500).json({success:false,data:str});
					})
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
				});

		post_req.write(data);
		post_req.end()
}

router.get('/',function(req,res){
	get_request('/',res);
});

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
	res.json(attribute_list);
});

router.get('/userstats/:username/:attribute',function(req,res){
	var user = req.params.username;
	var att = req.params.attribute;
	get_request(`/userstats/${user}/${att}`,res)
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

	console.log(req.body);

	req.body = JSON.stringify(req.body);
	post_request('/signup',req.body,res);

});

router.post('/post',function(req,res){
	console.log(new Date());

	var dummy_data = {
		date : new Date(), 
		author : "Someone",
		recipient : "Jzzy",
		content : "Lecture about life",
		is_private : false,
		agree : 10,
		disagree : 20
	};

	req.body = JSON.stringify(req.body);
	dummy_data = JSON.stringify(dummy_data);
	post_request('/post',req.body,res);
});;

router.post('/friendpost',function(req,res){
	var dummy_data = {user : "JustinRol"};
	dummy_data = JSON.stringify(dummy_data);
	
	req.body = JSON.stringify(req.body);
	post_request('/friendpost',req.body,res);
})

router.post('/postto',function(req,res){
	var dummy_data = {user : "Jzzy"};
	dummy_data = JSON.stringify(dummy_data);

	req.body = JSON.stringify(req.body);
	post_request('/postto',req.body,res);
})

router.post('/comments',function(req,res){
	var dummy_data = {user : "Jzzy"};
	dummy_data = JSON.stringify(dummy_data);

	req.body = JSON.stringify(req.body);
	post_request('/comments',req.body,res);
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
	"getfriendlist" : "user, this will show the people who were granted permission to view user's posts",
	"getstats" : "attribute name. for list of attribute, use /getattributelist",
	"userstats" : "/userstats/(username)/(attribute)",
	"contribute" : "in the body, need : user_from, user_to, att, quantity",
	"signup" : "in the body, need : username, name, password, email, gender, age",
	"post" : `in the body, need : Date(Format: ${new Date()}), author, recipient,content, is_private(true or false), agree,disagree(default will be 0)`,
	"friend-post" : 'body, username. This will show the posts that the user can see, sorted by date.',
	"post-to" : 'body, name of recipient',
	"login" : 'body, username and password',
	"Here are image-related" : '',
	"":"get request to '/profile-photo' with 'username' param will send the photo back.",
	"":"post request to '/profile-photo' with 'username' param and photo whose name is 'profile' will upload the photo to the server.",
	"": "get request to '/profile-photo' with 'username' param will send the photo back.",
	"": "post request to '/profile-photo' with 'username' param and photo whose name is 'profile' will upload the photo to the server."
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
