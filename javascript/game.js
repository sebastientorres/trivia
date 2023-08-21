exports = typeof window !== "undefined" && window !== null ? window : global;

exports.Game = function () {
  const maxNumberOfPlayers = 6;

  var players = new Array();
  var places = new Array(maxNumberOfPlayers);
  var purses = new Array(maxNumberOfPlayers);
  var inPenaltyBox = new Array(maxNumberOfPlayers);

  var popQuestions = new Array();
  var scienceQuestions = new Array();
  var sportsQuestions = new Array();
  var rockQuestions = new Array();

  const POP = 'Pop';
  const SCIENCE = 'Science';
  const SPORTS = 'Sports';
  const ROCK = 'Rock';

  this.createQuestionForCategory = function (cat, index) {
    return `${cat} Question ${index}`;
  }

  for (let i = 0; i < 50; i++) {
    popQuestions.push(this.createQuestionForCategory(POP, i));
    scienceQuestions.push(this.createQuestionForCategory(SCIENCE, i));
    sportsQuestions.push(this.createQuestionForCategory(SPORTS, i));
    rockQuestions.push(this.createQuestionForCategory(ROCK, i));
  }

  const deckArray = [
    {
      cat: POP,
      questions: popQuestions,
      index: 0,
    },

    {
      cat: SCIENCE,
      questions: scienceQuestions,
      index: 0,
    },
    {
      cat: SPORTS,
      questions: sportsQuestions,
      index: 0,
    },

    {
      cat: ROCK,
      questions: rockQuestions,
      index: 0,
    },
  ];

  /*
   * TODO
   *  Populate questionsArray with questionCat objs
   *
   *  Write logic to compare currentCategory vs questionsArray Obj,
   * then ask question.
   *
   * increment index of correct obj,
   *
   * insure index does not exceed obj.questions.length, else reset to 0.
   *
   * may need to for loop for questions about obj arr
   *
   * */

  var currentPlayer = 0;
  var isGettingOutOfPenaltyBox = false;

  var didPlayerWin = function () {
    //what is the winning condition? is it when player has 6 coins?, why the '!'?
    return !(purses[currentPlayer] == maxNumberOfPlayers);
  };

  /* Functions for accessing variables to enable testing  */
  this.getInPenaltyBox = function () {
    return inPenaltyBox;
  };

  this.getPlayerPurse = function () {
    return purses;
  };

  this.getCurrentPlayerNumber = function () {
    return currentPlayer;
  };

  this.getPopQuestions = function () {
    return popQuestions;
  };

  this.getQuestionsArray = function () {
    return deckArray;
  };

  let currentCategory = function () {
    if (places[currentPlayer] == 0) return POP;
    if (places[currentPlayer] == 4) return  POP;
    if (places[currentPlayer] == 8) return  POP;
    if (places[currentPlayer] == 1) return SCIENCE;
    if (places[currentPlayer] == 5) return SCIENCE;
    if (places[currentPlayer] == 9) return SCIENCE;
    if (places[currentPlayer] == 2) return SPORTS;
    if (places[currentPlayer] == 6) return SPORTS;
    if (places[currentPlayer] == 10) return SPORTS;
    return "Rock";
  };

  this.isPlayable = function () {
    return players.length >= 2;
  };

  this.add = function (playerName) {
    console.log(
      `Adding ${playerName} current number of players is ${this.howManyPlayers()}`
    );
    if (this.canAddNewPlayer(this.howManyPlayers())) {
      players.push(playerName);
      places[this.howManyPlayers() - 1] = 0;
      purses[this.howManyPlayers() - 1] = 0;
      inPenaltyBox[this.howManyPlayers() - 1] = false;

      console.log(playerName + " was added");
      console.log("They're player number " + players.length);

      return true;
    } else {
      console.log(`There are ${players.length} in this game, the max is 6`);
      console.log(
        `Couldn't add ${playerName}, There are too many players in this game!`
      );
      return false;
    }
  };

  this.getCurrentPlayer = function () {
    return players[currentPlayer];
  };

  this.changeCurrentPlayer = function () {
    currentPlayer += 1;
    if (currentPlayer === players.length) {
      currentPlayer = 0;
    }
  };

  this.howManyPlayers = function () {
    return players.length;
  };

  this.canAddNewPlayer = function (currentCount) {
    return currentCount < maxNumberOfPlayers;
  };

  this.addCoin = function () {
    purses[currentPlayer] += 1;
    console.log(
      `${players[currentPlayer]} now has ${purses[currentPlayer]} Gold Coin(s)`
    );
  };

  this.askQuestion = function (category = currentCategory()) {
    deckArray.forEach((deck) => {
      if (deck.cat === category) {
        deck.index = this.getDeckNextPosition(deck.questions, deck.index);
        console.log(deck.questions[deck.index]);
      }
    });
  };

  //can remove this now
  this.askQuestionFromCategory = function (questions, index) {
    console.log(questions[index]);
  };

  this.getDeckNextPosition = function (arr, index) {
    if (index == arr.length - 1) {
      return 0;
    } else {
      return ++index;
    }
  };

  /*
   * playRound()
   * responsible for:
   * - rolling dice for current player
   * - asking the question
   * - accepting the answer
   * - determining if there is a winner \ has the game ended?
   * -- no? setting the next player
   * -- yes? end the game
   *
   * */

  this.roll = function (roll) {
    if (this.isPlayable()) {
      console.log(players[currentPlayer] + " is the current player");
      console.log("They have rolled a " + roll);

      if (inPenaltyBox[currentPlayer]) {
        if (roll % 2 != 0) {
          isGettingOutOfPenaltyBox = true;

          console.log(
            players[currentPlayer] + " is getting out of the penalty box"
          );
          places[currentPlayer] = places[currentPlayer] + roll;
          if (places[currentPlayer] > 11) {
            places[currentPlayer] = places[currentPlayer] - 12;
          }

          console.log(
            players[currentPlayer] +
              "'s new location is " +
              places[currentPlayer]
          );
          console.log("The category is " + currentCategory());
          this.askQuestion();
        } else {
          console.log(
            players[currentPlayer] + " is not getting out of the penalty box"
          );
          isGettingOutOfPenaltyBox = false;
        }
      } else {
        places[currentPlayer] = places[currentPlayer] + roll;
        if (places[currentPlayer] > 11) {
          places[currentPlayer] = places[currentPlayer] - 12;
        }

        console.log(
          players[currentPlayer] + "'s new location is " + places[currentPlayer]
        );
        console.log("The category is " + currentCategory());
        this.askQuestion();
      }
      return true;
    } else {
      return false;
    }
  };

  this.wasCorrectlyAnswered = function () {
    if (inPenaltyBox[currentPlayer]) {
      if (isGettingOutOfPenaltyBox) {
        inPenaltyBox[currentPlayer] = false;
      } else {
        this.changeCurrentPlayer();
        //why are we returning true here? what does it signify?
        //early return to so bottom stuff doesn't happen, could have it in an else block.
        return true;
      }
    }
    console.log("Answer was correct!!!!");
    this.addCoin();
    const winner = didPlayerWin();
    this.changeCurrentPlayer();
    return winner;
  };

  this.wrongAnswer = function () {
    console.log("Question was incorrectly answered");
    console.log(players[currentPlayer] + " was sent to the penalty box");
    inPenaltyBox[currentPlayer] = true;

    this.changeCurrentPlayer();

    return true;
  };
  // return {popQuestions}
};

/*var notAWinner = false;

var game = new Game();

game.add('Chet');
game.add('Pat');
game.add('Sue');

do{

  game.playRound();

  game.roll(Math.floor(Math.random()*6) + 1);

  if(Math.floor(Math.random()*10) == 7){
    notAWinner = game.wrongAnswer();
  }else{
    notAWinner = game.wasCorrectlyAnswered();
  }

}while(!game.isThereAWinner());*/
