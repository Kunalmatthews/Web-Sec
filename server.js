//Enable strict mode
'use strict'

//Require express
var express = require('express');
var app = express();

var player_win_num = 0;
var server_win_num = 0;
var games_played = 0;


app.get("/",function(req, resp){

	resp.sendFile(__dirname + "/index.html");
	
});

app.get("/results", function(req, resp){

var user_mv = req.query.userchoice;
	var results = "You Chose: " + user_mv+ "<br>"+ "<br>";
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


	games_played++;
	var pcvar = getRandomInt(5);
	console.log("PC value = " + pcvar);
	results+= "The PC Chose: " + pcvar;
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
		
			if (pcvar === 2 || pcvar === 3){
				player_win_num += 1;
				return true;
			}
			if (pcvar === 0)
				return -1;

			else{
				server_win_num += 1;
				return false;
			}
		case (1):

			if (pcvar === 4 || pcvar === 0){
				player_win_num += 1;
				return true;
			}
			if (pcvar === 1)
				return -1;

		else{
				server_win_num += 1;
				return false;
		}
		case (2):

			if (pcvar === 1 || pcvar === 3){
				player_win_num += 1;
				return true;
			}
			if (pcvar === 2)
				return -1;

		else{
				server_win_num += 1;
				return false;
		}

		case (3):

			if (pcvar === 1 || pcvar == 4){
				player_win_num += 1;
				return true;
			}
			if (pcvar === 3)
				return -1;

			else{
				server_win_num += 1;
				return false;
			}
		case (4):

			if (pcvar === 0 || pcvar === 2){
				player_win_num += 1;
				return true;
			}
			if (pcvar === 4)
				return -1;

		else{
				server_win_num += 1;
				return false;
		}

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
	console.log("Player wins: ", player_win_num);
	console.log("Server wins: ", server_win_num);
	console.log("Games Played: ", games_played);
	console.log();
	results+= "<br>" + "Player Wins";

	}

else if (item === false){

	console.log("Player loses");
	console.log("Player wins: ", player_win_num);
	console.log("Server wins: ", server_win_num);
	console.log("Games Played: ", games_played);
	console.log();
	results+= "<br>" + "<br>" +"Player loses";

	}
	
	
else {
	console.log("Player wins: ", player_win_num);
	console.log("Server wins: ", server_win_num);
	console.log("Games Played: ", games_played);
	console.log();
	results += "<br>" + "<br>" + "Tie";

}

results += "<br>" + "<br>" +"<br>" + "<br>" + 
			"Player wins: " + player_win_num +"<br>" + "Server wins: "+ server_win_num + "<br>" + "Games Played: " + games_played ;
resp.send(results);


});

app.listen(3000);
