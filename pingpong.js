(function(){

    // Getting the elements through id's using query selector
    var ball = document.querySelector('#ball');
    var barA = document.querySelector('#barA');
    var barB = document.querySelector('#barB');
    var barAScore = document.querySelector('#barAScore')
    var barBScore = document.querySelector('#barBScore')

    // Defining names for bars and storing the data in local storage
    const storeName = "PingPongName";
    const storeScore = "PingPongMaxScore";
    const barAName = "bar 1";
    const barBName = "bar 2";

    // Defining some more useful variables
    let barAScoreUpdate = 0
    let barBScoreUpdate  = 0

    let score1=0
    let score2=0

    let maximumScore,
        movement,
        bar,
        ballSpeedXAxis = 2,
        ballSpeedYAxis = 2;
    
    let started = false;

    // Storing the width and height of viewport
    let windowWidthInner = window.innerWidth,
        windowHeightInner = window.innerHeight;


    // Storing data in local storage
    (function () {
        bar = localStorage.getItem(storeName);
        maximumScore = localStorage.getItem(storeScore);
        if (bar === "null" || maximumScore === "null") {
            alert("LET'S PLAY THE GAME!!!");
            maximumScore = 0;
            bar = "barA"
        } else {
            alert(bar + " has the maximum score of " + maximumScore * 100);
        }
        resetBoard(bar);
    })();



    // Resetting the game 
    function resetBoard(barName) {

        barA.style.left = (window.innerWidth - barA.offsetWidth) / 2 + 'px';
        barB.style.left = (window.innerWidth - barB.offsetWidth) / 2 + 'px';
        ball.style.left = (windowWidthInner - ball.offsetWidth) / 2 + 'px';
        barAScoreUpdate = 0
        barBScoreUpdate = 0
        barAScore.innerHTML = 0
        barBScore.innerHTML = 0

        // Whoever losses the game get's the ball next time
        if (barName === barBName) {
            ball.style.top = (barA.offsetTop + barA.offsetHeight) + 'px';
            ballSpeedYAxis = 2;
        } else if (barName === barAName) {
            ball.style.top = (barB.offsetTop - barB.offsetHeight) + 'px';
            ballSpeedYAxis = -2;
        }

        score1 = 0;
        score2 = 0;
        started = false;

    }


    // After Winning Display Score
    function storeWin(bar, score) {
        console.log("bar name is " +bar + "Score is " + score)
        if (score > maximumScore) {
            maximumScore = score;
            localStorage.setItem(storeName, bar);
            localStorage.setItem(storeScore, maximumScore);
        }
        clearInterval(movement);
        resetBoard(bar);

        alert(bar + " wins with a score of " + (score * 100));

    }


    // Adding Event Listener on pressing the key
    window.addEventListener('keypress', function () {
        let barSpeed = 20;

        let barRect = barA.getBoundingClientRect();


        if (event.code === "KeyD" && ((barRect.x + barRect.width) < window.innerWidth)) {
            barA.style.left = (barRect.x) + barSpeed + 'px';
            barB.style.left = barA.style.left;
        } else if (event.code === "KeyA" && (barRect.x > 0)) {
            barA.style.left = (barRect.x) - barSpeed + 'px';
            barB.style.left = barA.style.left;
        }

        // When user presses the Enter key
        if (event.code === "Enter") {

            if (!started) {
                started = true;
                let ballRect = ball.getBoundingClientRect();
                let ballX = ballRect.x;
                let ballY = ballRect.y;
                let ballDia = ballRect.width;

                let barAHeight = barA.offsetHeight;
                let barBHeight = barB.offsetHeight;
                let barAWidth = barA.offsetWidth;
                let barBWidth = barB.offsetWidth;

                movement = setInterval(function () {
                    // Moving the ball 
                    ballX += ballSpeedXAxis;
                    ballY += ballSpeedYAxis;

                    barAX = barA.getBoundingClientRect().x;
                    barBX = barB.getBoundingClientRect().x;

                    ball.style.left = ballX + 'px';
                    ball.style.top = ballY + 'px';


                    if ((ballX + ballDia) > windowWidthInner || ballX < 0) {
                        ballSpeedXAxis = -ballSpeedXAxis; // Reverses the direction
                    }

                    // Defining the center of the ball on display
                    let ballPos = ballX + ballDia / 2;

                    // Checking for bar 1
                    if (ballY <= barAHeight) {
                        // Changing ball direction in the opposite direction
                        ballSpeedYAxis = -ballSpeedYAxis; 
                        score1++;
                        barAScoreUpdate++;
                        barAScore.innerHTML = barAScoreUpdate*100;


                        // Checking if any of the bar losses
                        if ((ballPos < barAX) || (ballPos > (barAX + barAWidth))) {
                            storeWin(barBName, score1);
                        }
                    }

                    // Checking for bar 2
                    else if ((ballY + ballDia) >= (windowHeightInner - barBHeight)) {
                        // Changing ball direction in the opposite direction
                        ballSpeedYAxis = -ballSpeedYAxis;
                        score2++;
                        barBScoreUpdate++;
                        barBScore.innerHTML = barBScoreUpdate*100;

                        // Checking if any of the bar losses
                        if ((ballPos < barBX) || (ballPos > (barBX + barBWidth))) {
                            storeWin(barAName, score2);
                        }
                    }

                }, 10);

            }
        }

    });

})();