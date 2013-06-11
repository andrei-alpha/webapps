using namespace std;

#include <set>
#include <map>
#include <list>
#include <deque>
#include <stack>
#include <queue>
#include <cmath>
#include <ctime>
#include <cctype>
#include <cstdio>
#include <vector>
#include <string>
#include <bitset>
#include <utility>
#include <iomanip>
#include <fstream>
#include <cstring>
#include <sstream>
#include <iostream>
#include <algorithm>
#include <functional>

#define oo (1<<30)
#define f first
#define s second
#define II inline
#define db double
#define ll long long
#define pb push_back
#define mp make_pair
#define Size(V) ((ll)(V.size()))
#define all(V) (V).begin() , (V).end()
#define CC(V) memset((V),0,sizeof((V)))
#define CP(A,B) memcpy((A),(B),sizeof((B)))
#define FOR(i,a,b) for(int (i)=(a);(i)<=(b);++(i))
#define REP(i, N) for (int (i)=0;(i)<(int)(N);++(i))
#define FORit(it, x) for (__typeof((x).begin()) it = (x).begin(); it != (x).end(); ++it)
#define printll(x) printf("%lld",(x))
#define printsp() printf(" ")
#define newline() printf("\n")
#define readll(x) scanf("%lld",&(x))
#define debugll(x) fprintf(stderr,"%lld\n",(x))

typedef vector<int> VI;
typedef pair<int,int> pi;

#include "game.cpp"
int maxLevel = 0;
int realMoves = 0;


class Ai{
    public:
        void bar(char* param){
            std::cout << "Hello " << param << std::endl;
        }
		int move(char* boardChar, int score1, int score2, int cur, int level);
};

extern "C" {
    Ai* Ai_new(){ return new Ai(); }
    void Ai_bar(Ai* ai, char* param){ ai->bar(param); }
	void Ai_move(Ai* ai, char* board, int score1, int score2, int cur, int level) 
	{ ai->move(board, score1, score2, cur, level); }
}

bool digit(char ch) {
	return (ch >= '0' && ch <= '9');
}

bool checkOnlyOne(Game* game)
{
	for(int i = 0;i < 12;++i)
		if(game->getStones(i) > 1)
			return false;
	
	return true;
}
	
int getOnlyOneScore(Game* game,int x,int y,int player) {
char board[12];
	
for(int i = 0;i < 12;++i)
	board[i] = (char)game->getStones(i);
			
	for(int score = 0;;player = player == 0 ? 1 : 0)
	{
		if(score != 0 && player == 0)
			y += 2;
		else if(score != 0)
			x += 2;
			
		if(x >= 24)
			return 1000 + (x - y);
		if(y >= 24)
			return -1000 + (y - x);
		
		score = 0;
		int start = (player == 0) ? 0 : 6;
		int end = (player == 0) ? 5 : 11;
					
		if(board[end] == 1 && board[end == 11 ? 0 : 6] == 1)
		{
			board[end] = board[end == 11 ? 0 : 6] = 0;
			score = 2;
			continue;
		}
		
		int poz = -1;
		for(int i = start;poz == -1 && i <= end;++i)
			if(board[i] == 1) poz = i;	
		
		if(poz == -1)
			continue;
		
		board[poz] = 0;
		poz = (poz + 1) % 12;
		++board[poz];
		if(board[poz] == 2)
		{
			board[poz] = 0;
			score = 2;
		}			
	}
}
int getScore(Game* game,int x,int y,int player, int level /* FOR DEBUG*/) {
	//baza
	++realMoves;
	
	if(x >= 24)
		return 1000 + (x - y);
	if(y >= 24)
		return -1000 - (y - x);
	
	if(checkOnlyOne(game) == true)
		return getOnlyOneScore(game, x, y, player);
	
	return - (3 * y + 5 * (24 - x) + (y - x) * 7);
}

vector<int> compute(Game* game,int alpha, int beta, int level) {

    if(level == maxLevel)
	{
		vector<int> res = game->getScore();
		vector<int> res2(3);
		res2[0] = res[0];
		res2[1] = res[1];
		res2[2] = getScore(game, res[0], res[1], game->getCurrentPlayer(), level );
		return res2;
	}
	
	int player = game->getCurrentPlayer();
	int cnt = 0,score1 = 0,score2 = 0,bestMove = 0,bestScore = player == 0 ? -1000000 : 1000000;
	bool moved = false;
	
    for(int i = 0;i < 12;++i)
		if( game->isValidMove(i) == true)
			++cnt;
		
	cnt = std::max(1, cnt);

	bool ok = true;
	for(int i = 0;i < 12 && ok;++i)
	{
		if( game->isValidMove(i) == false)
			continue;		

		moved = true;
		int stones = game->moveAI(i);
				
		if(game->isOver() == true || checkOnlyOne(game) == true) //this player wins
		{
			vector<int> res = game->getScore();
			int nextPlayer = game->getCurrentPlayer() == 1 ? 2 : 1;
			int tempScore = getScore(game, res[0], res[1], nextPlayer, level);
			
			if(player == 0)
				alpha = std::max(alpha, tempScore);
			else
				beta = std::min(beta, tempScore);
			
			if(beta <= alpha)
				ok = false; //Break condition
			
			//if(level == 0)
			//	cout << i + " : " + tempScore + " " + res[0] + " " + res[1];
			
			if( (player == 0 && tempScore > bestScore) || (player == 1 && tempScore < bestScore) ) {
				bestScore = tempScore;
				score1 = res[0];
				score2 = res[1];
				bestMove = i;
			}
			
			game->revert(i, stones);
			continue;
		}
		
		game->swapPlayers();
		vector<int> res = compute(game, alpha, beta, cnt == 1 ? level : level + 1); //call to next level
		game->swapPlayers();
		int tempScore = res[2];
		
		if(player == 0)
			alpha = std::max(alpha, tempScore);
		else
			beta = std::min(beta, tempScore);
		
		if(beta <= alpha)
			 ok = false; //Break condition
		
		//if(level == 0)
		//	System.out.println(i + " : " + tempScore + " " + res[0] + " " + res[1]);
					
		if( (player == 0 && tempScore > bestScore) || (player == 1 && tempScore < bestScore) ) {
			bestScore = tempScore;
			score1 = res[0];
			score2 = res[1];
			bestMove = i;
		}
		
		game->revert(i, stones);
		//game.display();
	}
	
	if(moved == false)
	{
		game->swapPlayers();
		vector<int> res = compute(game, alpha, beta, level); //call to next level
		game->swapPlayers();
		int tempScore = res[2];
		
		//if(level == 0)
		//	System.out.println("no move");
		
		bestScore = tempScore;
		score1 = res[0];
		score2 = res[1];
		bestMove = -1;
	}
	
	vector<int> res(3);
	res[0] = (level == 0 ? bestMove : score1);
	res[1] = score2;
	res[2] = bestScore;
	return res;
}

int parseInt(char* &boardChar) {
	if( digit(*boardChar) == false)
		++boardChar;
	
	int res = 0;
	for(; digit(*boardChar); res = res * 10 + *boardChar - '0', ++boardChar);
	return res; 
}

int Ai::move(char* boardChar, int score1, int score2, int cur, int level) {
    int board[12];
    realMoves = 0;
    maxLevel = level;

    for(int i = 0;i < 12;++i)
        board[i] = parseInt(boardChar);

    //FOR DEBUG start
	//cout << "board: ";
    //for(int i = 0;i < 12;++i)
    //  cout << board[i] << " ";
    //cout << "\n";
    //cout << score1 << " " << score2 << " " << cur << " " << level << std::endl;
    //FOR DEBUG end

    Game* game = new Game(board, cur, score1, score2);
    vector<int> move = compute(game, -999999, 999999, 0);
    return move[0];
}

