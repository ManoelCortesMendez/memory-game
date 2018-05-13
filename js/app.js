/*Use IIFE to avoid polluting global scope*/
(function () {

    /* Get elements */

    // Define list of all card icons -- each appears twice to form pairs
    const cardIcons = ["airplane-icon", "art-icon", "bell-icon", "dice-icon", "fire-icon", "paw-icon", "sun-icon", "world-icon", "airplane-icon", "art-icon", "bell-icon", "dice-icon", "fire-icon", "paw-icon", "sun-icon", "world-icon"];
    const cardFronts = document.getElementsByClassName('card-front');
    const resetButton = document.getElementById('reset-button');
    const board = document.getElementById('board');

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

        // Get card back and hide it
        cardContainer.lastElementChild.classList.add('hide-back');
    }

    /* Add event listeners */

    board.addEventListener('click', function (event) {
        // Trigger only when a card back is clicked
        if (event.target.classList.contains('card-back')) {
            // Get clicked card container
            const cardContainer = event.target.parentElement;

            revealCard(cardContainer);

        }
    });

    resetButton.addEventListener('click', function () {
        // Reload page to reset -- a bit lazy but easy
        document.location.reload();
    });

    /* Call functions */

    resetGame(cardIcons, cardFronts);

})();
