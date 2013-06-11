
class Bowl{
	
	private: int stones;
	private: int pending;
	
	public: Bowl(int stonesP) {
		stones = stonesP;
        pending = 0;
	}
		
	public: int getStones() {
		return stones;
	}
	
	public: int takeAllStones() {
		int temp = stones;
		stones = 0;
		return temp;
	}
	
	public: void depositStone() {
		++pending;
	}
	
	public: void depositStones(int stonesP) {
		stones += stonesP;
	}
	
	public: int updateAndGetScore() {
		int score = 0;
		
		int temp = stones;
		stones += pending;
		
		if(temp == 1 && pending != 0) {
			score = stones;
			stones = 0;
		}
		
		pending = 0;
		
		return score;
	}
};

