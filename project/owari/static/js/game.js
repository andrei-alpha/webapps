/*
getBalls(plate_no);
incBallNo(plate_no);
decBallNo(plate_no);
*/

var gameScore = [0, 0];
var gameCurrPlayer = 0;
var gameMode = 0;
var gameState = false;

function startGame(gameMode) {
	if(gameState)
	{
		resumeGame();
		return;
	}

	gameMode = 0;
	gameCurrPlayer = 0;
	gameState = true;
	
	init();
}

function validMove(plate_no) {
	/* Check if is a valid move. */
	if ( getBalls(plate_no) == 0 || gameState == false)
		return false;
	if (gameCurrPlayer == 0 && plate_no >= 6)
		return false;
	if (gameCurrPlayer == 1 && plate_no < 6)
		return false;
	return true;
}

function clickBowl(plate_no) {
	if ( !validMove(plate_no) )
		return false;

	moveStones(plate_no);
}

function moveStones(plate_no) {
	/* Move the actual stones. */
	var balls = getBalls(plate_no);

	for (var i = 0; i <= balls; ++i)
		removeBall(plate_no);
	for (var ind = plate_no + 1; balls != 0; --balls, ++ind) {
		ind = ind % 12;

		if (getBalls(ind) == 1) {
			removeBall(ind);
			gameScore[gameCurrPlayer] += 2;
		}
		else {
			addBall(ind);
		}
	}

	/* Check if this player has won */
	if (gameScore[gameCurrPlayer] >= 24) {
		gameState = false;
		$('#game-window-title-name').html('<h1>Player ' + gameCurrPlayer + ' has won!</h1>');
		return;
	}

	/* Change player's turn */
	gameCurrPlayer = 1 - gameCurrPlayer;

	/* If no valid move, change again */
	var found = false;
	for (var ind = 0; ind < 12; ++ind)
		if ( validMove(ind) )
			found = true;
	if (!found)
		gameCurrPlayer = 1 - gameCurrPlayer;

	$('#game-window-title-name').html('Owari Game (' + gameCurrPlayer +
	') _________ Score(0): ' + gameScore[0] + ' Score(1): ' + gameScore[1]);
}

function getScore(player) {
	return gameScore[player];
}