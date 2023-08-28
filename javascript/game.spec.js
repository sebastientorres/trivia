require('./game.js');


describe('all tests!', () => {

  describe('The test environment', function() {
    it('should pass', function() {
      expect(true).toBe(true);
    });

    it("should access game", function() {
      expect(Game).toBeDefined();
    });
  });

  describe("our player number tests", function() {
    it('should not be playable when initialised', function () {
      const game = new Game;
      expect(game.isPlayable()).toBe(false);
    });

    it('should not be playable when 1 player has been added', function () {
      const game = new Game;

      game.add("Bonzo");

      expect(game.isPlayable()).toBe(false);
    });

    it('should have a minimum of two players to be playable', function () {
      const game = new Game;

      game.add("John");
      game.add("Steve");

      expect(game.isPlayable()).toBe(true);
    });

    it('should not be able to roll if weve not added two players', function () {

      const game = new Game;

      expect(game.getCurrentPlayer()).toBeUndefined();
      const didRollHappen = game.roll(2);

      expect(didRollHappen).toBe(false)

    });

    it('should be able to roll if when we are playable', function () {

      const game = new Game;

      game.add("Jeff");
      game.add("Golum");

      expect(game.getCurrentPlayer()).toBeDefined();

      const didRollHappen = game.roll(2);

      expect(didRollHappen).toBe(true)

    });

    it("game should have a maximum of 6 players", function () {

      const game = new Game;

      for (let i = 1; i < 7; i++) {
        expect(game.add(`${i}`)).toBe(true);
      }

      expect(game.add("7")).toBe(false);
      expect(game.add("8")).toBe(false);

    });



  });

  describe("Penalty box tests", function() {

    it("Player that is currently in box, rolls odd and answers correctly, is released", function(){

      const game = new Game;

      game.add('Jeff');
      game.add('steve');
      game.getInPenaltyBox()[0] = true;

      game.roll(1);

      game.wasCorrectlyAnswered();
      expect(game.getInPenaltyBox()[0]).toBe(false);
    });

    it("Player currently in penalty box, does NOT roll odd, answers correctly, is NOT released", function(){

      const game = new Game;

      game.add("Jedd");
      game.add("Bill");
      game.getInPenaltyBox()[0] = true;

      game.roll(2);
      game.wasCorrectlyAnswered();
      expect(game.getInPenaltyBox()[0]).toBe(true);
    })
  });

  describe("Coin and purse tests", function() {
    it("Player answers one question correctly, has one coin", function() {
      const game = new Game;

      game.add("Jess");
      game.add("August");
      game.roll(3);
      game.wasCorrectlyAnswered();
      expect(game.getPlayerPurse()[0]).toBe(1)
    });

    it("Player currently in pen box, being released, answers correctly, gains one coin", function() {
      const game = new Game;

      game.add('Jeff');
      game.add('steve');
      game.getInPenaltyBox()[0] = true;

      game.roll(1);

      game.wasCorrectlyAnswered();
      expect(game.getPlayerPurse()[0]).toBe(1);

    });

    it("Player currently in pen box, NOT being release, answers correctly, does NOT gain one coin", function() {

      const game = new Game;

      game.add("Jedd");
      game.add("Bill");
      game.getInPenaltyBox()[0] = true;

      game.roll(2);
      game.wasCorrectlyAnswered();
      expect(game.getPlayerPurse()[0]).toBe(0);
    })
  });

  describe("Player turn tests", function() {
    it("Two player game, first player answers correctly, second players turn", function() {
      const game = new Game;

      game.add("Guilty")
      game.add("Treeson");
      game.roll(2);
      game.wasCorrectlyAnswered();
      let actual = game.getCurrentPlayerNumber();
      expect(actual).toEqual(1);

    })
  })

  describe("questions", function () {

    it('When asking a question deck of questions remains the same length', () => {
      const game = new Game;
      const numberOfQuestionAsked = game.getPopQuestions().length
      const popQuestions = game.getQuestionsArray()[0];

      for (let i = 0; i < numberOfQuestionAsked ; i++) {
        game.askQuestionFromCategory('Pop');
      }

      expect(popQuestions.questions.length).toEqual(50);
    });

    it('should keep track of the current index of questions and the index should increment expectedly', () => {
      const game = new Game;

      const numberOfQuestionsAsked = 10;
      const popObj = game.getQuestionsArray()[0];

      for (let i = 0; i < numberOfQuestionsAsked; i++) {
        game.askQuestion('Pop');
      }

      expect(popObj.index).toEqual(10)
    });

    it("more questions asked than there are in deck, should go back to the beginning of the deck", () => {
      const game = new Game;

      const numberOfQuestionAsked = game.getPopQuestions().length+=1;
      const popObj = game.getQuestionsArray()[0];

      for(let i=0; i< numberOfQuestionAsked; i++){
        game.askQuestion('Pop');
      }
      expect(popObj.index).toEqual(0)
    })


  })
   describe("Category tests", function (){

     it ("Add new category, new item added to deck array", () => {
       const game = new Game;

       const catName = 'LOTR';
       const questionsArrayLength = game.getQuestionsArray().length;

       expect(game.getQuestionsArray().length).toBe(questionsArrayLength);

       game.addCategory(catName);

       expect(game.getQuestionsArray().length).toBe(questionsArrayLength + 1);

     })
   })

  it("All categories have a deck of questions of the same length", () => {
    let game = new Game;
    const deck = game.getQuestionsArray();
    const expectedNumberOfQuestions = game.getPopQuestions().length
    game.addCategory('LOTR');

    for (let i=0; i<deck.length; i++){
      expect(deck[i].questions.length).toBe(expectedNumberOfQuestions);
    }

  })
});
