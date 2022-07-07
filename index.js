// HTML TARGETS
const game = document.getElementById('game');
const scoreDisplay = document.getElementById('score');

// To run the program and see it on a browser you need a server
// else chrome, firefox... will not run the program

// To request the json file containing all the questions
fetch("questions.json")
  .then(response => {
    return response.json();
  })
  .then(jsondata => {
    jsondata.forEach(category => addCategory(category));
  });

// variable to store the score. Here so can be called in other functions
let score = 0;

  // While iterating acros the array will call this function to
  // make the content of the cards variable
function addCategory(category){
  // make a column for every genre
  const column = document.createElement('div');
  column.classList.add('genre-column');

  // make a div with the title content
  const genreTitle = document.createElement('div');
  genreTitle.classList.add('genre-title');
  genreTitle.innerText = category.genre;

  // "Push" the content to the HTML
  column.appendChild(genreTitle);
  game.append(column);

  // create a card for each question
  category.questions.forEach(question => {
    const card = document.createElement('div');
    card.classList.add('card');
    column.append(card);

    card.innerHTML = question.points;

    // this are the valuees of every card
    // if the user opens the inspector can see the answers
    card.setAttribute('data-question', question.question);
    card.setAttribute('data-answer-1', question.answers[0]);
    card.setAttribute('data-answer-2', question.answers[1]);
    card.setAttribute('data-correct', question.correct);
    card.setAttribute('data-value', question.points);

    // event listener for the flip the card
    card.addEventListener('click', flipCard);
  });
}

function flipCard() {
  // removing the text
  this.innerHTML = "";
  // adding style when clicked
  this.style.fontSize = "15px";
  this.style.lineHeight = "30px";

  // creating the div for the new fliped card
  const textDisplay = document.createElement('div');
  textDisplay.classList.add('card-text');
  // textDisplay.innerHTML = this.getAttribute('data-question');
  const firstButton = document.createElement('button');
  const secondButton = document.createElement('button');

  // adding classes and inner text on the card
  firstButton.classList.add('first-button');
  secondButton.classList.add('second-button');
  firstButton.innerHTML = this.getAttribute('data-answer-1');
  secondButton.innerHTML = this.getAttribute('data-answer-2');

  // to send the choice made by the user to the function
  firstButton.addEventListener('click', getResult);
  secondButton.addEventListener('click', getResult);

  // adding it to the HTML
  this.append(textDisplay, firstButton, secondButton);
  textDisplay.innerHTML = this.getAttribute('data-question');

  // when the user clicks a card the rest can't flip
  const allCards = Array.from(document.querySelectorAll('.card'));
  allCards.forEach(card => card.removeEventListener('click', flipCard))

}

// function checks if the answer is correct and adds a point or
// removes a point if the answer it's wrong
function getResult() {
  const allCards = Array.from(document.querySelectorAll('.card'));
  allCards.forEach(card => card.addEventListener('click', flipCard));

  const cardOfButton = this.parentElement

  if (cardOfButton.getAttribute('data-correct') == this.innerHTML){
    // add the value to the score
    score = score + parseInt(cardOfButton.getAttribute('data-value'));
    // add the score value to the HTML
    scoreDisplay.innerHTML = score;
    // adding the class to the card to show that it's correct
    cardOfButton.classList.add('correct-answer');
    // iterate over all the elements until there are none
    setTimeout(() => {
      while (cardOfButton.firstChild) {
        cardOfButton.removeChild(cardOfButton.lastChild);
      }
      cardOfButton.innerHTML = cardOfButton.getAttribute('data-value');
    }, 100);
  } else {
    cardOfButton.classList.add('wrong-answer');
    setTimeout(() => {
      while (cardOfButton.firstChild) {
        cardOfButton.removeChild(cardOfButton.lastChild)
      }
      cardOfButton.innerHTML = 0;
    }, 100)
  }
  cardOfButton.removeEventListener('click', flipCard);
}
