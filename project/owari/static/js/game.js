/*
getBalls(plate);
incBallNo(plate);
decBallNo(plate);
*/

var gameScore = [0, 0];
var gameCurrPlayer = 0;
var gameMode = 0;
var gameState = false;

function startGame(gameMode) {
	gameMode = 0;
	gameCurrPlayer = 0;
	gameState = true;
}

function clickBowl(plate) {
	/* Check if is a valid move. */
	if ( getBalls(plate) == 0)
		return false;
	if (gameCurrPlayer == 0 && plate >= 6)
		return false;
	if (gameCurrPlayer == 1 && plate < 6)
		return false;

	moveStones(plate);
}

function moveStones(plate) {
	/* Move the actual stones. */
	var balls = getBalls(plate);
	console.log('now we move ' + balls + ' stones from bowl ' + plate);

	for (var ind = plate + 1; balls != 0; --balls, ++ind) {
		ind = ind % 12;

		if (getBalls(ind) == 1) {
			console.log('minus one ball in ' + ind);
			//decBallNo(ind);
			gameScore[gameCurrPlayer] += 2;
		}
		else {
			console.log('one more ball in ' + ind);
			//incBallsNo(ind);
		}
	}
}

function getScore(player) {
	return gameScore[player];
}