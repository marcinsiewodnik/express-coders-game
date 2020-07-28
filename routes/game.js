const db = require("../models/db");
const express = require("express");

// We need a router -> code divided into modules

const router = express.Router();

router.all("*", async (req, res, next) => {

    // Using cookies

    if (!req.session.userId) {

        // We add a new user to the database

        const user = await db.createUser();
        req.session.userId = user._id;
    }

    next();
})

router.get("/favicon.icon", (req, res) => {

    res.sendStatus(200);
});


// Our api -> methods returning json

router.get('/question', async (req, res) => {

    const user = req.session.userId;

    const currentQuestion = await db.getQuestion(user);
    const isGameOver = await db.isGameOver(user);

    if (currentQuestion.noMoreQuestions) {

        res.json({

            winner: true
        });

    } else if (isGameOver) {

        res.json({

            looser: true
        })

    } else {

        // We play futher

        const { question, answers } = currentQuestion;

        res.json({

            question,
            answers
        })
    }
})

router.post('/answers/:index', async (req, res) => {

    // query parameters

    let { index } = req.params;
    const user = req.session.userId;

    const currentQuestion = await db.getQuestion(user);

    index = parseInt(index);
    const correctIndex = currentQuestion.correctAnswer;

    const isGoodAnswer = index === correctIndex;

    if (!isGoodAnswer) {

        await db.gameOver(user);
    }

    if (currentQuestion.noMoreQuestions) {

        res.json({

            winner: true
        })

    } else if (await db.isGameOver(user)) {

        res.json({

            looser: true
        });

    } else {

        // First we increse the nextQuestion in user -> only then we can send an answer

        await db.increaseQuestion(user);

        res.json({

            goodAnswers: ++currentQuestion.questionNumber,
        })
    }
})

// Helpers

router.get('/help/friend', async (req, res) => {

    const user = req.session.userId;

    const currentQuestion = await db.getQuestion(user);
    const callToAFriendUsed = await db.isFriendUsed(user);

    if (callToAFriendUsed) {

        return res.json({

            text: 'This help has been already used'
        })
    }

    await db.useFriend(user);

    // Logic -> there is 50% changes that our friend knows the answer

    const doesFriendKnowTheAnswer = Math.random() < 0.5;
    const question = currentQuestion;

    const correctAnswer = question.correctAnswer;

    let text = null;

    if (doesFriendKnowTheAnswer) {

        text = `I think that the correct answer is: ${currentQuestion.answers[correctAnswer]}`

    } else {

        text = `Sorry my friend, I don't know`
    }

    res.json({

        text
    })

});

router.get('/help/half', async (req, res) => {

    const user = req.session.userId;

    const currentQuestion = await db.getQuestion(user);
    const halfOnHalfUsed = await db.isHalfUsed(user);

    if (halfOnHalfUsed) {

        return res.json({

            text: 'This help has been already used'
        })
    }

    await db.useHalf(user);

    // Logic -> we eliminate two answer

    const wrongAnswers = [];

    currentQuestion.answers.forEach((s, index) => {

        if (index !== currentQuestion.correctAnswer) {

            wrongAnswers.push(index);
        };
    });

    wrongAnswers.splice(Math.floor(Math.random() * wrongAnswers.length), 1);

    // We send answers to remove to the front-end

    res.json({

        answersToRemove: wrongAnswers
    })
});

router.get('/help/crowd', async (req, res) => {

    const user = req.session.userId;

    const currentQuestion = await db.getQuestion(user);
    const questionToTheCrowdUsed = await db.isAudienceAsked(user);

    if (questionToTheCrowdUsed) {

        return res.json({

            text: 'This help has been already used'
        })
    }

    await db.askAudience(user);


    const procents = [10, 20, 30, 40];

    for (let i = procents.length - 1; i > 0; i--) {

        const change = Math.floor(Math.random() * 10);

        procents[i] += change;
        procents[i - 1] -= change;
    }

    const { correctAnswer } = currentQuestion;

    // ES6 syntach

    [procents[3], procents[correctAnswer]] = [procents[correctAnswer], procents[3]]

    // We send a table with procents from the audience

    res.json({

        procents
    });
})

router.get("/restart", async (req, res, next) => {

    // Functionality -> a user has an opportunity to play the game again

    req.session.userId = '';

    res.redirect("/");
})


module.exports = router;