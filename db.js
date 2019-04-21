'use strict';
var express = require("express");
var fs = require("fs");
var bodyParser = require("body-parser");
var app = express();
var bleach = require('bleach');


const REGEX = [/<username>(.*?)<\/username>/g, /<password>(.*?)<\/password>/g, /<cash>(.*?)<\/cash>/g];
const REPLACE = /<\/?[^>]+(>|$)/g;

app.use(bodyParser.urlencoded({ extended: true }));
var accountStrings = [];

//END OF GLOBALS

function parseUser(list, index, reg){

let final = list[index].match(REGEX[reg]).map(function(val){
	return val.replace(REPLACE, '');
});
return final[0];
}
//Takes the data from the out.txt file and removes XML tags.











function escape(input){
let final = input.replace(REPLACE, '');
console.log("Escape results: " + final);
return final;

}

function createAccount(username, pass, cash){
	this.username = username;
	this.pass = pass;
	this.cash = cash;
}
//Creates an instance of an account object


function accountValid(user,pass){


for (let i = 0; i<accounts.length;i++){
	console.log(user + accounts[i]);
	if (user === accounts[i].username){
		return false;
		}
	}

return true;
}

var accounts = [];





function accountVerify(user,pass){


for (let i = 0; i<accounts.length; i++){

	if (user === accounts[i].username){
	
		if (pass === accounts[i].pass){
			return true;
		}
	}
}
return false;

}




app.get("/", function(req,res){

	res.sendFile(__dirname + "/index.html");
	});
//Called when the user requests the index page.



app.post("/login", function(req, resp){
	console.log("login function");
	let user = bleach.sanitize(req.body.user1);
	let pass = bleach.sanitize(req.body.pass1);
	let result = accountVerify(user,pass);
	console.log("Login successful " + result);
	if (result){
	resp.sendFile(__dirname + "/index.html"); //CHANGE INDEX.HTML TO DASHBOARD
	}
	else{
	resp.send("<p>Login failed: Incorrect Username/Password</p><button onclick='goBack()'>Go Back</button>" +
	"<script>function goBack(){window.history.back();}</script>");
	}

});

app.post("/getData", function(req, resp){
	let user = bleach.sanitize(req.body.user);
	let pass = bleach.sanitize(req.body.pass);
	if (accountValid(user,pass)){
		console.log("Got user input: " + user);
		console.log("Got user input: " + pass);
		let temp = new createAccount(user, pass, 500);
		accounts.push(temp);
		console.log(accounts);
		fs.appendFileSync("out.txt", "<account><username>" + temp.username + "</username><password>"
	 	+ temp.pass + "</password><cash>" + temp.cash + "</cash></account>\n"); 
		}
	else{
	resp.send("<p>Login failed: Account Exists</p><button onclick='goBack()'>Go Back</button>" +
	"<script>function goBack(){window.history.back();}</script>"
	);
}
	resp.sendFile(__dirname + "/index.html");
});


let result = fs.readFileSync("out.txt", 'utf8');
if (result){
	var parse_list = result.split("\n");



	for (let i = 0; i<parse_list.length; ++i){
		if (parse_list[i] === ""){
		parse_list.splice(i, 1);
		}
	}
	
	
	for (let i = 0; i<parse_list.length; ++i){
		let temp = new createAccount(parseUser(parse_list,i,0), parseUser(parse_list,i,1), parseUser(parse_list,i,2));
		accounts.push(temp);
	}
	console.log(accounts);



//	console.log(parseUser(parse_list, 0, 1));
	
	
}
else{
	console.log("Result empty");
}

//for (let i = 0; i<parse_list.length(); i++){

app.listen(3000);
//	console.log(parseUser(parse_list,0,0));
