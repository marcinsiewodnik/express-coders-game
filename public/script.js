const init = () => {

    const question = document.querySelector(".question");

    const answerParagrafs = document.querySelectorAll(".answer p");
    const answerButtons = document.querySelectorAll(".answer button");

    const gameBoard = document.querySelector(".game-board");
    const title = document.querySelector('.title');
    const goodAnswersSpan = document.querySelector('#good-answers');

    // populating the page with a given question

    const renderQuestion = (data) => {

        if (data.winner) {

            gameBoard.innerText = "";

            title.innerText = "You won. Congratulations!";

        } else if (data.looser) {

            gameBoard.innerText = "";

            title.innerText = "You lost. Mayby next time!";

        } else {

            question.innerText = data.question;

            const answers = data.answers;

            for (let i = 0; i < answers.length; i++) {

                answerParagrafs[i].innerText = answers[i]
            }
        }
    }

    const getNextQuestion = () => {

        fetch("/question", {

            method: 'GET',

        })
            .then(r => r.json())
            .then(data => {

                renderQuestion(data);
            })
    }

    getNextQuestion();

    const handleAnswer = (data) => {

        clearData();

        if (data.winner) {

            gameBoard.innerText = "";
            title.innerText = "You won. Congratulations!";

        } else if (data.looser) {

            gameBoard.innerText = "";
            title.innerText = "You lost. Maybe next time!"

        } else {

            goodAnswersSpan.innerText = data.goodAnswers;

            getNextQuestion();
        }
    }

    const sendAnswer = (index) => {

        fetch((`/answers/${index}`), {

            method: 'POST',

        })
            .then(r => r.json())
            .then(data => {

                handleAnswer(data);
            })
    }

    answerButtons.forEach(button => {

        button.addEventListener("click", e => {

            // dataset -> access to attributes

            const index = e.target.parentNode.dataset.answer;

            sendAnswer(index);
        });
    });

    // helpers to use in the game

    // call to a friend

    const tipDiv = document.querySelector(".tip");

    function handleFriendsAnswer(data) {

        clearData();

        const pElement = document.createElement("p");

        pElement.innerText = data.text;

        tipDiv.append(pElement);
    }

    const callToAFriend = () => {

        fetch("/help/friend", {

            method: 'GET',

        })
            .then(r => r.json())
            .then(data => {

                handleFriendsAnswer(data);
            })
    }

    const buttonFriend = document.querySelector("button[data-help='callToAFriend']");

    buttonFriend.addEventListener('click', callToAFriend);

    // fifty-fifty

    function handleHalfOnHalfAnswer(data) {

        clearData();

        if (data.text) {

            const pElement = document.createElement("p");

            pElement.innerText = data.text;

            tipDiv.append(pElement);



        } else {

            for (const button of answerButtons) {

                if (data.answersToRemove.indexOf(Number(button.dataset.answer)) > -1) {

                    button.disabled = true;
                }
            }
        }
    }

    function halfOnHalf() {

        fetch("/help/half", {

            method: 'GET',

        })
            .then(r => r.json())
            .then(data => {

                handleHalfOnHalfAnswer(data);
            })
    }

    const buttonFiftyFifty = document.querySelector("button[data-help='halfOnHalf']");

    buttonFiftyFifty.addEventListener("click", halfOnHalf);

    // question to the crowd

    const spanProcents = document.querySelectorAll(".procent");

    function handleCrowdAnswer(data) {

        clearData();

        if (data.text) {

            const pElement = document.createElement("p");

            pElement.innerText = data.text;

            tipDiv.append(pElement);

        } else {

            data.procents.forEach((procent, index) => {

                spanProcents[index].innerText = procent + "%";

            })
        }
    }

    function questionToTheCrowd() {

        fetch("/help/crowd", {

            method: 'GET',

        })
            .then(r => r.json())
            .then(data => {

                handleCrowdAnswer(data);
            })
    }

    document.querySelector("button[data-help='questionToTheCrowd']").addEventListener('click', questionToTheCrowd);

    // const buttonsHelp = document.querySelectorAll(".help-button");

    // buttonsHelp.forEach(button => {

    //     button.addEventListener('click', function () {

    //         this.setAttribute("disabled", true);
    //     });

    // })

    // Before rendering the next question or before using one of the helpers -> we have to clear the changes

    const clearData = () => {

        answerButtons.forEach(buttonItem => {

            buttonItem.disabled = false;
        })

        spanProcents.forEach(spanItem => {

            spanItem.innerText = "";
        })

        tipDiv.innerText = "";
    }
}

init();


