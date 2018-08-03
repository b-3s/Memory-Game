/* variable declarations */
var deck = document.querySelector(".deck");
var movesSpan = document.querySelector(".moves")
var clickedCard;
var clickedCardLi;
var actualTime = document.querySelector(".actualTime");
var stars = document.querySelectorAll(".fa-star");
var modal = document.querySelector("#modal");
var m_stars = document.querySelector("#m_stars");
var m_moves = document.querySelector("#m_moves");
var m_time = document.querySelector("#m_time");

var listOfCards;
var compareStack = new Array();
let openCards;
let matchedCards;
let hold = 0; // set hold to 1 for disabling clicking
let moves = 0;
var interval;
let seconds = 0;
let minutes = 0;
let secondsToShow;
let minutesToShow;
let newGame = true;
let activeStars = 3;
let starLosingFigure = 4;

/*
 * Create a list that holds all of your cards
 */
listOfCards = ["diamond", "diamond", "paper-plane-o", "paper-plane-o", "anchor", "anchor", "bolt", "bolt", "cube", "cube", "leaf", "leaf", "bicycle", "bicycle", "bomb", "bomb"];

/*shuffle the list of cards */
shuffle(listOfCards);

/* for TESTING purposes only ------------------------------------------------------ */
// function showLog(){
// 	for (var i = 0; i < listOfCards.length; i++){
// 		// document.getElementById("trial").innerHTML += listOfCards[i] + ", ";
// 		console.log(listOfCards[i]);
// 	}
// }
// showLog();
/* TESTING END ---------------------------------------------------------------------*/


// Display Cards on the Page
function layOutCards(){
	for (var i = 0; i < listOfCards.length; i++){
		deck.innerHTML += '<li class="card"><i class="fa fa-' + listOfCards[i] +'"></i>';
	}

}

layOutCards();

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)

 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)

 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)

 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)

 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

/* setup EventListener for Cards */
deck.addEventListener('click', cardClicked);

function cardClicked(evt) {
	if(newGame == true){
		startTime();
		newGame = false;
	}
	if(hold === 0){
	    clickedCard = evt.target.firstElementChild;
	    clickedCardLi = evt.target;
	    displayCard(clickedCard, clickedCardLi);
	}
}

function displayCard(cardToShow, parentLi){
	/* show cards */
	parentLi.classList.add("open", "show");
	/* compareCards*/
	compareCards(cardToShow, parentLi);
}

function compareCards(cardToShow, parentLi){
	// String functions - remove "fa fa-"
	let actCardName = cardToShow.className.substr(6);
	// console.log("actCardName: " + actCardName);
	// push cards in stack and compare
	compareStack.push(actCardName);
	if(compareStack.length > 1){
		if(compareStack[0] == compareStack[1]){
			cardsMatch();
		}else{
			noCardsMatch();
		}
		compareStack.length = 0;
	}
	console.log("compareStack.length: " + compareStack.length);
}

function cardsMatch(){
	openCards = document.getElementsByClassName("card open show");
	// set Card Classes to "card match" -> means "match", and change classes accordingly
	while(openCards.length >= 1){
		openCards[0].classList.add("match");
		openCards[0].classList.remove("open", "show");
	}
	//set matched Cards
	matchedCards = document.getElementsByClassName("card match");
	// check whether game is won
	if(matchedCards.length == 16){
		gameWon();
	}
}

function noCardsMatch(){
	openCards = document.getElementsByClassName("card open show");
	hold = 1; // disable clicking as long as not matching cards are displayed

	// set Card Classes to "card" -> means "no match", and flip cards back after 1 sec -> change class accordingly
	setTimeout(function(){
		while(openCards.length >= 1){
		openCards[0].classList.remove("open", "show");
		}
		hold = 0;
		increaseMoves();
	}, 1000);
}

function increaseMoves(){
	moves++;
	movesSpan.innerHTML = moves;
	if(moves % starLosingFigure == 0 && activeStars > 0){ // check whether star has to fade due to too much moves
		fadeStars();
	}
}

function gameWon(){
		showEndModal();
		stopTime();
}

// modal
function showEndModal(){
	modal.style.display = "block";
	m_stars.innerHTML = activeStars;
	m_moves.innerHTML = moves;
	m_time.innerHTML = actualTime.innerHTML;
}

function hideEndModal(){
	modal.style.display = "none";
}

// time
function startTime(){
	var startTime = Date.now();
    interval = setInterval(function() {
       var elapsedTime = Date.now() - startTime;
       seconds = (elapsedTime / 1000).toFixed(0) % 60;
       if(seconds == 0){
       	minutes++;
       }
       if(seconds < 10){
       		secondsToShow = "0" + seconds;
       }else{
       		secondsToShow = seconds;
       }
       if(minutes < 10){
       		minutesToShow = "0" + minutes;
       }else{
       		minutesToShow = minutes;
       }
       actualTime.innerHTML = minutesToShow + ":" + secondsToShow;
    }, 1000);
}

function stopTime(){
	clearInterval(interval);
}

// stars
function fadeStars(){
	console.log("stars.length: " + stars.length);
	stars[activeStars-1].classList.add("faded");
	activeStars--;
}

// start new game
function newStart(){
	location.reload();
}


