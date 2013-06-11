#include "bowl.cpp"
#include "player.cpp"

class Game {
	
	private: int currentPlayer;
	private: vector<Bowl*> table;
	private: vector<Player*> player; 
	
	public: 
	Game() {
		currentPlayer = 0;
		table.resize(12);
		player.resize(2);

		for(int i = 0;i < 12;++i)
			table[i] = new Bowl(4);
		player[0] = new Player();
		player[1] = new Player();
	}
	
	Game(int board[12], int cur, int score1, int score2) {
		currentPlayer = cur;
        table.resize(12);
        player.resize(2);

        for(int i = 0;i < 12;++i)
            table[i] = new Bowl(board[i]);
        player[0] = new Player();
        player[1] = new Player();
		player[0]->addToScore(score1);
		player[1]->addToScore(score2);
	} 

	int getCurrentPlayer() {
		return currentPlayer;
	}
	
	string toString(int x) {
		string res = "";
		for(; x || res.size() == 0; res.pb(x % 10 + '0'), x /= 10);
		std::reverse( all(res) );
		return res;
	}

	string getCurrentPlayerName() {
		return player[currentPlayer]->getName();
	}
	
	void swapPlayers() {
		currentPlayer = (currentPlayer + 1) % 2;
	}
	
	bool isValidMove(int bowl) {
		return 
			bowl < (currentPlayer + 1) * 6 && 
			bowl >= currentPlayer * 6 &&
			table[bowl]->getStones() != 0;
	}
	
	bool canCurrentPlayerMove() {
		for(int i = 0;i < 12;++i)
			if( isValidMove(i) )
				return true;
		
		return false;
	}
	
	int moveAI(int bowl) {
		//pre: the bowl is on the player side and not-empty
		
		int stones = table[bowl]->takeAllStones();
		for(int i = (bowl + 1) % 12, rem = stones;rem != 0; --rem, i = (i + 1) % 12)
			table[i]->depositStone();
		
		int points = 0;
		for(int i = 0;i < 12;++i)
			points += table[i]->updateAndGetScore();
		player[currentPlayer]->addToScore(points);
					
		return stones;
	}
	
	string move(int bowl) {
		//pre: the bowl is on the player side and not-empty
				
		string output = "";
		int stones = table[bowl]->takeAllStones();
		for(int i = (bowl + 1) % 12;stones != 0; --stones, i = (i + 1) % 12)
			table[i]->depositStone();
		
		int points = 0;
		for(int i = 0;i < 12;++i)
		{
			int temp = table[i]->updateAndGetScore();
			if(temp != 0)
				output += getCurrentPlayerName() + " has captured " + toString(temp) + " stones from bowl " + toString(i + 1) + "!\n";
			points += temp;
		}
		player[currentPlayer]->addToScore(points);
		
		if(points != 0)
			output += getCurrentPlayerName() + " has now score " + toString(player[currentPlayer]->getScore() ) + "\n";
		else
			output += getCurrentPlayerName() + " didn`t capture any stones\n";
		
		return output;
	}
	
	void revert(int bowl, int stones) {
		//pre: the bowl is on the player side and not-empty
				
		table[bowl]->depositStones(stones);
		int pending[12] = {0};
		
		for(int i = (bowl + 1) % 12,temp = stones;temp != 0; --temp, i = (i + 1) % 12)
			++pending[i];
		
		for(int i = 0;i < 12;++i)
		{
			if(pending[i] == 0)
				continue;
			
			if(table[i]->getStones() >= pending[i])
				table[i]->depositStones( -pending[i]);
			else {
				player[currentPlayer]->addToScore( -(pending[i] + 1) );
				table[i]->depositStones(1);
			}
		}
	}
	
	void addScore(int id, int points) {
		player[id]->addToScore(points);
	}
	
	void addStones(int bowl, int stones) {
		table[bowl]->depositStones(stones);
	}
	
	int getStones(int bowl) {
		if(bowl < 0 || bowl > 11)
			return -1;
		return table[bowl]->getStones();
	}
	
	vector<int> getScore() {
		vector<int> score(2);
		score[0] = player[0]->getScore();
		score[1] = player[1]->getScore();
		return score;
	}
	
	int getLeadingPlayer() {
		if(player[0]->getScore() > player[1]->getScore() )
			return 0;
		return 1;
	}
	
	string niceDisplay(int x,int cnt) {
		string res = toString(x);
		for(;(int)res.length() < cnt;res += " ");
		
		return res;
	}
	
	void display() {
		cout << "\n";
		cout << player[1]->getName() + ": " + toString(player[1]->getScore() ) << "\n";
		
		for(int i = 11;i >= 6;--i)
			cout << " " + niceDisplay(i + 1,2) + "  ";
		cout << "\n";
		for(int i = 11;i >= 6;--i)
			cout << "[" + niceDisplay(table[i]->getStones(),2) + "] ";
		cout << "\n";
		
		cout << "\n";
		for(int i = 0;i < 6;++i)
			cout << "[" + niceDisplay(table[i]->getStones(),2) + "] ";
		cout << "\n";
		for(int i = 0;i < 6;++i)
			cout << " " + niceDisplay((i + 1),2) + "  ";
		cout << "\n";
		
		cout << player[0]->getName() + ": " + toString(player[0]->getScore() ) << "\n";
		cout << "\n";
	}
	
	bool isOver() {
		if(player[0]->getScore() >= 24 || player[1]->getScore() >= 24)
			return true;
		return false;
	}
	
};

