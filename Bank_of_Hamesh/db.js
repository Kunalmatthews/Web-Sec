'use strict';
var express = require("express");
var fs = require("fs");
var bodyParser = require("body-parser");
var app = express();
var bleach = require('bleach');
const sessions = require('client-sessions');

var accounts = [];
const REGEX = [/<username>(.*?)<\/username>/g, /<password>(.*?)<\/password>/g, /<cash>(.*?)<\/cash>/g];
const REPLACE = /<\/?[^>]+(>|$)/g;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(sessions({
	cookieName: 'session',
	secret: 'ksdf76s78dHSDKFJSDKF8HJJ737j',
	duration: 24 * 60 * 60 * 1000,
	activeDuration: 1000 * 60 * 5,
	}));

var accountStrings = [];


function generateDash(username, money, error){

if(!money)
{
	let x = userIndex(username);
	money = accounts[x].cash;
}



var page = "<html><body><h1>Welcome, " + username + " To the Bank Of Hamesh!</h1>    <h1>Dashboard Actions:</h1>";
page += "<br>Your balance: $" + money;
page += "<form action='/dashboard' method='post'>";
page += "<input type='radio' name='choice' value='deposit'> <label for='user'>Deposit:</label> <input type='text' id='deposit_value' name='deposit_val' placeholder='Enter value to Deposit' /> <br><br>";
page += "<input type='radio' name='choice' value='withdraw'>";
page += "<label for='user'>Withdraw:</label>";
page += "<input type='text' id='Withdraw_value' name='withdraw_val' placeholder='Enter value to Withdraw' />";
page += "<br><br>";
page += "<input type='radio' name='choice' value='transfer'>";
page += "<label for='user'>Transfer:</label>";
page += "<input type='text' id='Withdraw_value' name='transfer_val' placeholder='Enter value to Transfer' />";
page += "<label for='user'>Send to:</label>";
page += "<input type='text' id='Withdraw_value' name='transfer_val' placeholder='Enter Username' />";
page += "<br><br>";
page += "<input type='submit' value='Do The Stuff' />    </form>";
if (error === 1)
{
	page +="<br>You do not have enough money to do that...";
}
if (error === 2)
{
	page +="<br>Target Account Invalid...";
}
page += "<form action='/logout' method='post'>";
page += "<input type='submit' value='Logout' name='logout' id = 'logout'/></form>";


page += "</body>";
page += "</html>";
return page;


}



function buildDB(){
	fs.writeFileSync("out.txt", "<account><username>" + accounts[0].username + "</username><password>"
	 + accounts[0].pass + "</password><cash>" + accounts[0].cash + "</cash></account>\n"); 
	 for (let i = 1; i<accounts.length;i++)
	 {
	 	fs.appendFileSync("out.txt", "<account><username>" + accounts[i].username + "</username><password>"
	 	+ accounts[i].pass + "</password><cash>" + accounts[i].cash + "</cash></account>\n"); 
	 
	 }
}


function parseAdd(val1, val2){

var a = parseInt(val1, 10);
var b = parseInt(val2, 10);


return a + b;
}



//END OF GLOBALS

function parseUser(list, index, reg){

let final = list[index].match(REGEX[reg]).map(function(val){
	return val.replace(REPLACE, '');
});
return final[0];
}
//Takes the data from the out.txt file and removes XML tags.


function userIndex(user){
for (let i = 0; i<accounts.length;++i){
	if (user === accounts[i].username)
		return i;
	}

}




function check_pass(val)
{
    var no = 0;
    if(val!="")
    {
        // If the password length is less than or equal to 6
        if(val.length<=6){
            no=1;
        }

        // If the password length is greater than 6 and contain any lowercase alphabet or any number or any special character
        if(val.length>6 && (val.match(/[a-z]/) || val.match(/\d+/) || val.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/))){
            no=2;
        }

        // If the password length is greater than 6 and contain alphabet,number,special character respectively
        if(val.length>6 && ((val.match(/[a-z]/) && val.match(/\d+/)) || (val.match(/\d+/) && val.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/)) || (val.match(/[a-z]/) && val.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/)))){
            no=3;
        }

        // If the password length is greater than 6 and must contain alphabets,numbers and special characters
        if(val.length>6 && val.match(/[a-z]/) && val.match(/\d+/) && val.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/)){
            no=4;
        }
    }

    if (no === 3 || no === 4){
        //console.log("is strong");
        return true;
    }
    else{
        //console.log("NOT strong");
        return false;
    }
}








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


function accountValid(user){


for (let i = 0; i<accounts.length;i++){
	console.log(user + accounts[i]);
	if (user === accounts[i].username){
		return false;
		}
	}

return true;
}
//RETURNS FALSE ON ACCOUNT MATCH, TRUE ON NO MATCH







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

app.post("/dashboard", function(req, resp){
	if (req.session.username)
	{
		let error = 0;
		let index = userIndex(req.session.username);
	
		if (req.body.choice === 'deposit')
		{
			let result = bleach.sanitize(req.body.deposit_val);
			accounts[index].cash = parseAdd(accounts[index].cash,result);
			buildDB();
		}
		else if (req.body.choice === 'withdraw')
		{
			let result = bleach.sanitize(req.body.withdraw_val);
		
			if (result <= accounts[index].cash)
			{
				accounts[index].cash -= result;
				buildDB();
				
			}
			else
			{
				error = 1;
			}
	
		}
	
		else if (req.body.choice === 'transfer')
		{
			let value = bleach.sanitize(req.body.transfer_val[0]);
			let target = bleach.sanitize(req.body.transfer_val[1]);
		
		
			if (value <= accounts[index].cash)
			{
			
				if(!accountValid(target))
				{
					let x = userIndex(target);
					accounts[index].cash -= value;
					accounts[x].cash = parseAdd(accounts[x].cash,value);
					buildDB();
				}
			
			}
			else
			{
				error = 1;
			}
		
			if(accountValid(target))
			{
				error = 2;
			}

		}
	
		switch(error)
		{
			case 0: 
				resp.send(generateDash(req.session.username,accounts[index].cash));
				break;
			case 1:
				resp.send(generateDash(req.session.username,accounts[index].cash, error));
				break;
			case 2:
				resp.send(generateDash(req.session.username,accounts[index].cash, error));
				break;
		}
	
	}
	else
	{
		resp.redirect('/');
	}
});


app.post("/logout", function(req, resp){
	req.session.reset();
	resp.redirect('/');

});


app.post("/login", function(req, resp){
	console.log("login function");
	let user = bleach.sanitize(req.body.user1);
	let pass = bleach.sanitize(req.body.pass1);
	let result = accountVerify(user,pass);
	console.log("Login successful " + result);
	if (result){
	let x = userIndex(user);
	req.session.username = accounts[x].username;
	
	resp.send(generateDash(user, accounts[x].cash)); //CHANGE INDEX.HTML TO DASHBOARD
	}
	else{
	resp.send("<p>Login failed: Incorrect Username/Password</p><button onclick='goBack()'>Go Back</button>" +
	"<script>function goBack(){window.history.back();}</script>");
	}

});

app.post("/getData", function(req, resp){
	let user = bleach.sanitize(req.body.user);
	let pass = bleach.sanitize(req.body.pass);
	if (accountValid(user,pass) && check_pass(pass)){
	

		console.log("Got user input: " + user);
		console.log("Got user input: " + pass);
		let temp = new createAccount(user, pass, 500);
		accounts.push(temp);
		console.log(accounts);
		fs.appendFileSync("out.txt", "<account><username>" + temp.username + "</username><password>"
	 	+ temp.pass + "</password><cash>" + temp.cash + "</cash></account>\n"); 
		
		
		let x = userIndex(user);
		req.session.username = accounts[x].username;
		resp.send(generateDash(user, 500));
		}
		
		
	else{
	resp.send("<p>Login failed: Account Exists or weak password (minimum one capital letter and one special character</p><button onclick='goBack()'>Go Back</button>" +
	"<script>function goBack(){window.history.back();}</script>");
}



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
