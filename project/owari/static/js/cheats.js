var cheatId = 0;
var cheatPos = 0;
var cheats_system = [];

var cheatsJson = [
	{
		'id': 0,
		'name': 'Balls Heaven',
		'cost': 50,
		'text': '"Some say that you might receive 4 stones in one ' +
		'of your bowls. However this ancient rune comes with a cost."'
	},
	{
		'id': 1,
		'name': 'Score Fountain',
		'cost': 90,
		'text': '"Even if you`re in the desert a magic oasis ' + 
		'can transform a full bowl in pure gold. This is your lucky day."'
	},
	{
		'id': 2,
		'name': 'Ancient Earthquake',
		'cost': 180,
		'text': '"Straight from the earth`s fury this medieval rune will ' + 
		'take you to the other side of the board. Not to be taken lightly."'
	},
	{
		'id': 3,
		'name': 'Stone Storm',
		'cost': 230,
		'text': '"Rain comes quite rare in those desert lands but when it does ' + 
		'i`ll grow stones from pure sand. Move with caution."'
	},
	{
		'id': 4,
		'name': 'Old Wine',
		'cost': 60,
		'text': '"This beverage will make the stones look alive so they can move ' + 
		'around or is it just your imagination?"'
	}
];

function initCheats() {
	cheatId = 0;
	setTimeout(placeCheat, getRand(2000, 5000) );
}

function placeCheat() {
	if (gameState == false)
		return;

	// Place another cheat only if we have enough space
	if (cheatPos < 5) {
		var type = getRand(0, 4);

		if (cheatsJson[type]['cost'] <= curr_user['gold']) {
			var cheat = new Cheat(type);
			cheat.init();
			cheat.place(cheatPos);
			cheat.show();
			cheats_system[cheat.id] = cheat;

			cheatPos = cheatPos + 1;
			var time = getRand(4000, 6000);
			setTimeout(cheat.close, time);
		}
	}

	setTimeout(placeCheat, getRand(2000, 5000) );
}

function closeAllCheats() {
	for (id in cheats_system) {
		var cheat = cheats_system[id];

		if (cheat != null)
			cheat.close();
	}
}

function refreshCheats() {
	cheatPos = 0;
	for (id in cheats_system) {
		var cheat = cheats_system[id];

		if (cheat != null) {
			cheat.place(cheatPos);
			cheatPos = cheatPos + 1;
		}
	}
}

function getRand(min, max) {
	return Math.ceil(Math.random() * (max - min) + min);
}

function Cheat(type) {
	cheatId = cheatId + 1;

	this.type = type;
	this.name = cheatsJson[this.type]['name'];
	this.gold = cheatsJson[this.type]['cost'];
	this.text = cheatsJson[this.type]['text'];
	this.id = cheatId;
}

Cheat.prototype.place = function(position) {
	$('#cheat-' + this.id).css('top', position * 150 + 50);
}

Cheat.prototype.init = function() {
	var cheatWindowTemplate = $('#cheatWindowTemplate').html();
	var template = cheatWindowTemplate.format(this.id, this.name, this.gold, this.text);

	$('body').append(template);
	var _this = this;
	$('#cheat-' + this.id).click( function() { _this.click(); } );
}

Cheat.prototype.show = function() {
	$('#cheat-' + this.id).fadeIn(1000);
}

Cheat.prototype.close = function() {
	cheats_system[this.id] = null;
	$('#cheat-' + this.id).fadeOut(2000);

	var _this = this;
	setTimeout($('#cheat-' + _this.id).remove, 2000);
	setTimeout(refreshCheats, 2000);
}

Cheat.prototype.click = function() {
	if (gamePlayer[gameTurn] != curr_user['id']) {
		$('#cheat-message-' + this.id).css('color', 'red');
		$('#cheat-message-' + this.id).html('Next time wait for your turn!');
		this.close();
		return;
	}

	if (curr_user['gold'] < this.gold) {
		$('#cheat-message-' + this.id).css('color', 'red');
		$('#cheat-message-' + this.id).html('You don`t have enough gold!');
		this.close();
		return;
	}

	$('#cheat-message-' + this.id).css('color', 'green');
	$('#cheat-message-' + this.id).html('Abracadabra!');

	if (this.type == 0) cheat_BallsHeaven();
	if (this.type == 1) cheat_ScoreFountain();
	if (this.type == 2) cheat_AncientEarthquake();
	if (this.type == 3) cheat_StoneStorm();
	if (this.type == 4) cheat_OldWine();
	setBallsScore(gameTurn, gameScore[gameTurn]);

	this.close();
}

function cheat_BallsHeaven() {
	var bowl = (gameTurn == 1 ? getRand(0, 5) : getRand(6, 11) );
	addBall(bowl);
	addBall(bowl);
	addBall(bowl);
	addBall(bowl);
}

function cheat_ScoreFountain() {
	var best = 0;
	for (var i = 0; i < 12; ++i)
		if (validMove(i, true) && getBalls(i) > getBalls(best))
			best = i;

	var balls = getBalls(best);
	for (var i = 0; i < balls; ++i)
		removeBall(best);
	gameScore[gameTurn] += balls;
}

function cheat_AncientEarthquake() {
	for (var i = 0; i < 6; ++i)
		cheat_swapBowls(i, i + 6);
}

function cheat_StoneStorm() {
	for (var i = 0; i < 12; ++i)
		addBall(i);
}

function cheat_OldWine() {
	for (var i = 0; i < 100; ++i) {
		var x = getRand(0, 11);
		var y = getRand(0, 11);

		if (getBalls(x) > 0) {
			removeBall(x);
			addBall(y);
		}
	}
}

function cheat_swapBowls(x, y) {
	var bX = getBalls(x);
	var bY = getBalls(y);

	for (var i = 0; i < bX; ++i) {
		removeBall(x);
		addBall(y);
	}
	for (var i = 0; i < bY; ++i) {
		removeBall(y);
		addBall(x);
	}
}
