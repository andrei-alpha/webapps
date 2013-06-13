var gameScore = [0, 0, 0];
var gamePlayer = [0, 0, 0];
var gameTurn = 0;
var gameMode = 0;
var gameMoves = 0;
var gameState = false;
var GameEnded = false;

function startGame(player1, player2, mode, register) {
	$('#game-window').fadeIn(500);
	$('#game-window-close').click(function(event) { endGame(); closeGame(); });

	gameScore[1] = gameScore[2] = 0;
 	gamePlayer[0] = 0;
	gamePlayer[1] = player1;
	gamePlayer[2] = player2;
	gameTurn = 1;
	gameMoves = 0;
	gameState = true;
	GameEnded = false;
	gameMode = mode;
	
	/* Register the game. */
	if (register)
		gameAjaxCall({'type': 'new_game', 'player1': gamePlayer[1], 
			'player2': gamePlayer[2]}, 'error on new game');

	/* Initialize the graphics. */
	initGraphics();
	$('#game-window-title-name').html('');

	game_nextMove();
}

function closeGame() {
	$('#game-window').fadeOut(500);
	if (gameState == true)
		endGame();
	gameState = false;
}

function validMove(plate_no, check) {
	/* Check if is a valid move for this player. */
	if (plate_no < 0 || plate_no > 11)
		return false;
	if ( getBalls(plate_no) == 0 || gameState == false)
		return false;
	if (check && gamePlayer[gameTurn] != curr_user['id'])
		return false;
	if (gameTurn == 1 && plate_no >= 6)
		return false;
	if (gameTurn == 2 && plate_no < 6)
		return false;
	return true;
}

function game_nextMove() {
	/* If no valid move, change again */
	var found = false;
	for (var ind = 0; ind < 12; ++ind)
		if ( validMove(ind, false) )
			found = true;
	if (!found) {
		gameTurn = (gameTurn == 1 ? 2 : 1);
		moveArrow(gameTurn - 1);
		setTimeout(game_nextMove(), 100);
		return;
	}

	// If the next one is AI and has a valid move
	if (gamePlayer[gameTurn] < 0) {
		data = {};
		data['type'] = 'ai_move';
		data['turn'] = gameTurn;
		data['player1'] = gamePlayer[1];
		data['player2'] = gamePlayer[2];

		$.ajax({
	        url: '/backend/game/',
	        type: 'post',
	        data: data,
	        error: function(html) {
	            console.log('error on get ai move');
	        },
	        success: function(json) {
	        	var res =  $.parseJSON(json);
	        	moveStones(parseInt(res['move']));
	        }
	    });
	    return;
	}

	// In this case just wait for the oponent's move
}

function clickBowl(plate_no) {
	if ( !validMove(plate_no, true) )
		return false;
	moveStones(plate_no);
}

function moveStones(plate_no) {
	/* Move the actual stones. */
	gameMoves = gameMoves + 1;
	var balls = getBalls(plate_no);

	for (var i = 1; i <= balls; ++i)
		removeBall(plate_no);
	for (var ind = plate_no + 1; balls != 0; --balls, ++ind) {
		ind = ind % 12;

		if (getBalls(ind) == 1) {
			removeBall(ind);
			gameScore[gameTurn] += 2;
		}
		else
			addBall(ind);
	}

	/* Check if I won. */
	game_checkWin();
	/* Change player's turn */
	gameTurn = (gameTurn == 1 ? 2 : 1);

	/* Send update to backend */
	data = {};
	data['type'] = 'new_move';
	data['player1'] = gamePlayer[1];
	data['player2'] = gamePlayer[2];
	data['moves'] = gameMoves;
	data['score0'] = gameScore[1];
	data['score1'] = gameScore[2];
	data['turn'] = gameTurn;
	data['board'] = getBalls(0);
	for (var i = 1; i < 12; ++i)
		data['board'] = data['board'] + ' ' + getBalls(i);

	gameAjaxCall(data, 'error on new move in game');

	if (gameState == false)
		endGame();
	else {
		// point to current player
		moveArrow(gameTurn - 1);
		setTimeout(game_nextMove(), 200);
	}
}

function game_checkWin() {
	/* Check if this player has won */
	if (gameScore[gameTurn] >= 24) {
		gameState = false;
		name = game_getPlayerName(gamePlayer[gameTurn]);
		$('#game-window-title-name').html('<h1>' + name + ' won!</h1>');
	}
}

function endGame() {
	if (GameEnded == true)
		return;
	GameEnded = true;
	gameAjaxCall({'type': 'end_game', 'player1': gamePlayer[1], 
		'player2': gamePlayer[2]}, 'error on end game');
}

function game_getPlayerName(playerId) {
	if (playerId <= 0)
		return 'Ai player level ' + (-1 * playerId) + ' has';
	if (playerId == curr_user['id'])
		return 'You have';
	return users[playerId][0] + ' has';
}

function game_getMoves(data) {
	if (gameState == false) {
		// the game window is not opened
		$('#game-window').fadeIn(500);
		$('#game-window-close').click(function(event) { closeGame(); });

		gamePlayer[0] = 0;
		gamePlayer[1] = data['player'][0];
		gamePlayer[2] = data['player'][1];
		gameState = true;
		
		/* Initialize the graphics. */
		initGraphics();
	}

	// update the board
	gameScore[1] = parseInt( data['score'][0] );
	gameScore[2] = parseInt( data['score'][1] );
	gameMoves = parseInt( data['moves'] );
	for (var ind = 0; ind < 12; ++ind) {
		var dec = getBalls(ind) - parseInt(data['board'][ind]);
		var inc =  parseInt(data['board'][ind]) - getBalls(ind);

		for (var i = 0; i < inc; ++i)
			addBall(ind);
		for (var i = 0; i < dec; ++i)
			removeBall(ind);
	}

	/* Check if the oponent has won. */
	game_checkWin();
	if (gameState == false) {
		endGame();
	}
	else {
		gameTurn = parseInt( data['turn'] );
		moveArrow(gameTurn - 1);
		setTimeout(game_nextMove(), 200);
	}
}

function getScore(player) {
	return gameScore[player + 1];
}

function gameAjaxCall(data, errorMessage) {
	$.ajax({
        url: '/backend/game/',
        type: 'post',
        data: data,
        error: function(html) {
            console.log(errorMessage);
        }
    });
}