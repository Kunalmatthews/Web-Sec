//Import the express package
'use strict'

var express = require('express');
var app = express();

app.get("/",function(req, resp){

	resp.sendFile(__dirname + "/index.html");
	
});

app.get("/results", function(req, resp){

var user_mv = req.query.userchoice;
	var results = "You chose: " + user_mv+ "<br>"+ "<br>";
	if (user_mv === "rock")
		user_mv = 0;
	if (user_mv === "paper")
		user_mv = 1;
	if (user_mv === "scissors")
		user_mv = 2;
	if (user_mv === "lizard")
		user_mv = 3;
	if (user_mv === "spock")
		user_mv = 4;

/*
0 = Rock
1 = Paper
2 = Scissors
3 = Lizard
4 = Spock
*/


function player_win(user_mv){

	var pcvar = getRandomInt(5);
	console.log("PC value = " + pcvar);
	results+= "The PC chose: " + pcvar;
	switch(pcvar){

		case("Rock"):
			pcvar = 0;
			break;

		case("Paper"):
			pcvar = 1;
			break;

		case("Scissors"):
			pcvar = 2;
			break;

		case("Lizard"):
			pcvar = 3;
			break;

		case("Spock"):
			pcvar = 4;
			break;
	
		default:
			pcvar = -1;
			break;
	}



	switch(user_mv){

		case (0):
		
			if (pcvar === 2 || pcvar === 3)
				return true;

			if (pcvar === 0)
				return -1;

			else

			return false;

		case (1):

			if (pcvar === 4 || pcvar === 0)
				return true;

			if (pcvar === 1)
				return -1;

		else

			return false;

		case (2):

			if (pcvar === 1 || pcvar === 3)
				return true;

			if (pcvar === 2)
				return -1;

		else
			return false;


		case (3):

			if (pcvar === 1 || pcvar == 4)
				return true;

			if (pcvar === 3)
				return -1;

			else
			return false;

		case (4):

			if (pcvar === 0 || pcvar === 2)
				return true;

			if (pcvar === 4)

				return -1;

		else
			return false;


	}


}

function getRandomInt(max){
	var num;
	var result;

	num =  Math.floor(Math.random() * Math.floor(max));

	switch(num){

		case(0):
			return "Rock";

		case(1):
			return "Paper";

		case(2):
			return "Scissors";

		case(3):
			return "Lizard";

		case(4):
			return "Spock";

		default:
			return "Error";

	}


}



var item = player_win(user_mv);

console.log(item);


if (item === true){

	console.log("Player wins");
	results+= "<br>" + "Player loses";
	
	}

if (item === false){

	console.log("Player loses");
	results+= "<br>" + "<br>" +"Player wins";
	}
	
	
else 
	results += "<br>" + "<br>" + "Tie";
	
resp.send(results);
});

app.listen(3000);

