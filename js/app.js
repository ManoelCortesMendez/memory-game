/* Use IIFE to avoid polluting global scope */
(function () {

    /* Get elements */

    // Define list of all card icons -- each appears twice to form pairs
    const cardIcons = ["plane-icon", "art-icon", "cloud-icon", "die-icon", "fire-icon", "paw-icon", "sun-icon", "world-icon", "plane-icon", "art-icon", "cloud-icon", "die-icon", "fire-icon", "paw-icon", "sun-icon", "world-icon"];
    const board = document.getElementById('board');
    const cardFronts = document.getElementsByClassName('card-front');
    const movesCounter = document.getElementById('moves-counter');
    let movesCount = 0;
    const starsCounter = document.getElementById('stars-counter');
    const resetButton = document.getElementById('reset-button');
    let firstCard, secondCard; /* Save between clicks -- see playGame() */

    /* Declare functions */

    // Fisher-Yates shuffle: http://stackoverflow.com/a/2450976
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

    function resetGame(cardIcons, cardFronts) {
        // Shuffle icons
        const cardIconsShuffled = shuffle(cardIcons);

        // Assign shuffled icons to card fronts
        for (index in cardIcons) {
            cardFronts[index].classList.add(cardIcons[index]);
        }
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

    function compareCards(firstCard, secondCard) {
        const firstIcon = firstCard.firstElementChild.classList[2];
        const secondIcon = secondCard.firstElementChild.classList[2];

        // Return true if cards match, false otherwise
        if (firstIcon === secondIcon) {
            return true;
        } else {
            return false;
        }
    }

    function styleMatchedCard(cardContainer) {
        cardContainer.firstElementChild.classList.add('matched-card');
    }

    function styleMismatchedCard(cardContainer) {
        cardContainer.firstElementChild.classList.add('mismatched-card');
    }

    // TODO: implement victory message

    function incrementMovesCounter() {
        movesCount += 1;

        // Increment displayed move counter once per two card flips
        if (movesCount % 2 === 0) {
            switch (movesCount) {
                case 2:
                    movesCounter.innerText = `${movesCount/2} move`;
                    break;
                default:
                    movesCounter.innerText = `${movesCount/2} moves`;
            }
        }
    }

    function adjustStarsCounter() {
        // If <= 30 moves, 3 stars; > 30, 2; > 35, 1 star; > 40, 0
        if (movesCount > 40) {
            starsCounter.children[0].classList.add('star-outlined');
        } else if (movesCount > 35) {
            starsCounter.children[1].classList.add('star-outlined');
        } else if (movesCount > 30) {
            starsCounter.children[2].classList.add('star-outlined');
        }
    }

    /* Main function --- control flow of game */
    function playGame(clickEvent) {

        // Check if movesCount is pair --- if not, no mismatched pairs
        if (movesCount % 2 === 0) {
            // Get mismatched pair --- if there is one
            const mismatchedPair = board.querySelectorAll('div.mismatched-card');

            // If mismatch found, flip it down and reset its styling
            if (mismatchedPair.length === 2) {
                // Remove mismatch styling
                mismatchedPair[0].classList.remove('mismatched-card');
                mismatchedPair[1].classList.remove('mismatched-card');

                // Hide mismatched pair
                hideCard(mismatchedPair[0].parentElement);
                hideCard(mismatchedPair[1].parentElement);
            }
        }

        // Trigger only when a face-down card (ie a card back) is clicked
        if (clickEvent.target.classList.contains('card-back')) {
            // Increment moves counter
            incrementMovesCounter();

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

                // Apply appropriate styling for match or mismatch
                if (compareCards(firstCard, secondCard)) {
                    styleMatchedCard(firstCard);
                    styleMatchedCard(secondCard);
                } else {
                    styleMismatchedCard(firstCard);
                    styleMismatchedCard(secondCard);
                }
            }
        }
    }

    /* Add event listeners */

    // Launch game when board is clicked
    board.addEventListener('click', function (event) {
        playGame(event);
    });

    resetButton.addEventListener('click', function () {
        // Reload page to reset
        document.location.reload();
    });

    /* Call functions */

    // Reset game immediately after page load --- ie initial set-up
    resetGame(cardIcons, cardFronts);
})();
