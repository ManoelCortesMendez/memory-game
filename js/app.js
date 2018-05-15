// Use IIFE to avoid polluting global scope
(function () {
  // Define variables
  const cardIcons = [
    'art-icon', 'art-icon',
    'cloud-icon', 'cloud-icon',
    'die-icon', 'die-icon',
    'fire-icon', 'fire-icon',
    'paw-icon', 'paw-icon',
    'plane-icon', 'plane-icon',
    'sun-icon', 'sun-icon',
    'world-icon', 'world-icon'
  ]; // List each item twice to create matching pairs
  let movesCount = 0;
  let matchesCount = 0;
  let stars = 3;
  let firstCard, secondCard; // Save cards between clicks
  let startTime, elapsedTime;
  let intervalId; // Id interval to later be able to stop it

  // Get elements
  const gameboard = document.getElementById('gameboard');
  const cardFronts = document.getElementsByClassName('card-front');
  const movesCounter = document.getElementById('moves-counter');
  const starsCounter = document.getElementById('stars-counter');
  const timer = document.getElementById('timer');
  const resetBtn = document.getElementById('reset-btn');
  const victoryModal = document.getElementById('victory-modal');
  const statsModal = document.getElementsByClassName('stat');
  const resetBtnModal = document.getElementById('reset-btn-modal');


  // Declare functions
  // Fisher-Yates shuffle -- see stackoverflow.com/a/2450976
  function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  function revealCard(cardContainer) {
    // Get card front and reveal it
    cardContainer.firstElementChild.classList.add('reveal-front');
    cardContainer.firstElementChild.classList.remove('hide-front');

    // Get card back and hide it
    cardContainer.lastElementChild.classList.add('hide-back');
    cardContainer.lastElementChild.classList.remove('reveal-back');
  }

  function hideCard(cardContainer) {
    // Get card front and hide it
    cardContainer.firstElementChild.classList.add('hide-front');
    cardContainer.firstElementChild.classList.remove('reveal-front');

    // Remove mismatched card styling
    cardContainer.firstElementChild.classList.remove('mismatched-card');

    // Get card back and reveal it
    cardContainer.lastElementChild.classList.add('reveal-back');
    cardContainer.lastElementChild.classList.remove('hide-back');
  }

  function startTimer() {
    elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    timer.innerText = `${elapsedTime} s`; // Update time displayed
  }

  function incrementMovesCounter() {
    movesCount += 1;

    // Increment displayed move counter once per two card flips
    if (movesCount % 2 === 0) {
      movesCounter.innerText = (movesCount === 2) ? `${movesCount/2} move` : `${movesCount/2} moves`;
    }
  }

  function adjustStarsCounter() {
    /* Thresholds:
        - 30 moves or less: 3 stars
        - 31 to 35 moves: 2 stars
        - 36 moves or more: 1 star */
    stars = (movesCount <= 30) ? 3 : (movesCount <= 35 ? 2 : 1);

    if (stars === 2) {
      starsCounter.children[2].classList.add('star-outlined');
    } else if (stars === 1) {
      starsCounter.children[1].classList.add('star-outlined');
    }
  }

  function compareCards(firstCard, secondCard) {
    // Get card's icon class and assign it to local variable for convenicence
    const firstIcon = firstCard.firstElementChild.classList[2];
    const secondIcon = secondCard.firstElementChild.classList[2];

    // Return true if cards match, false otherwise
    return (firstIcon === secondIcon) ? true : false;
  }

  function styleMatchedCard(cardContainer) {
    cardContainer.firstElementChild.classList.add('matched-card');
  }

  function styleMismatchedCard(cardContainer) {
    cardContainer.firstElementChild.classList.add('mismatched-card');
  }

  function checkIfVictory(currentMatches) {
    if (currentMatches === 8) {
      // Stop timer
      clearInterval(intervalId);

      // Set modal stats: final time, moves, and stars
      statsModal[0].innerText = `Time: ${elapsedTime}s`;
      statsModal[1].innerText = `Moves: ${movesCount/2}`;
      statsModal[2].innerText = `Stars: ${stars}`;

      // Display modal
      victoryModal.showModal();
    }
  }

  function resetGame(cardIcons, cardFronts) {
    // Shuffle icons
    const cardIconsShuffled = shuffle(cardIcons);

    // Assign shuffled icons to card fronts
    for (const index in cardIcons) {
      cardFronts[index].classList.add(cardIcons[index]);
    }
  }

  // Main function -- control game flow
  function playGame(clickEvent) {
    // Check if movesCount is pair -- if not, mismatch impossible so skip
    if (movesCount % 2 === 0) {
      // Get mismatching pair -- if there is one
      const mismatchedPair = gameboard.querySelectorAll('.mismatched-card');

      // If mismatching pair found, flip it down and reset its styling
      if (mismatchedPair.length === 2) {
        // Remove mismatching pair styling
        mismatchedPair[0].classList.remove('mismatched-card');
        mismatchedPair[1].classList.remove('mismatched-card');

        // Flip mismatching pair down
        hideCard(mismatchedPair[0].parentElement);
        hideCard(mismatchedPair[1].parentElement);
      }
    }

    // Trigger only when a face-down card (ie a card back) is clicked
    if (clickEvent.target.classList.contains('card-back')) {
      // Increment moves counter
      incrementMovesCounter();

      // If first move, start timer
      if (movesCount === 1) {
        startTime = Date.now()

        // Call startTimer() every 1 second
        intervalId = window.setInterval(startTimer, 1000);
      }

      // Adjust stars
      adjustStarsCounter();

      // Get clicked card container
      const cardContainer = clickEvent.target.parentElement;

      // Reveal clicked card
      revealCard(cardContainer);

      // Assess whether cards match -- if moves counter is even
      if (movesCount % 2 === 1) {
        firstCard = cardContainer;
      } else {
        secondCard = cardContainer;

        // Apply green styling to matches, red to mismatches
        if (compareCards(firstCard, secondCard)) {
          // Increment matches count
          matchesCount += 1;

          // Check for a victory
          checkIfVictory(matchesCount);

          // Style matches
          styleMatchedCard(firstCard);
          styleMatchedCard(secondCard);
        } else {
          // Style mismatches
          styleMismatchedCard(firstCard);
          styleMismatchedCard(secondCard);
        }
      }
    }
  }

  /* Add event listeners */
  gameboard.addEventListener('click', function (event) {
    // Launch game when gameboard is clicked
    playGame(event);
  });

  resetBtn.addEventListener('click', function () {
    // Reload page to reset
    document.location.reload();
  });

  resetBtnModal.addEventListener('click', function () {
    // Reload page to reset
    document.location.reload();
  });

  /* Call functions */
  resetGame(cardIcons, cardFronts); // Set up game on page load
})();
