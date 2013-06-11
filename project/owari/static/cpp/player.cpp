class Player{
	private: int Score;
    private: string Name;

    public:
      	Player() {
            Name = "player";
			Score = 0;
        }
        void addToScore(int points) {
            Score += points;
        }
        int getScore() {
            return Score;
        }
        string getName() {
            return Name;
        }
};

