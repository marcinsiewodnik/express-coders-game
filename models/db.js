const { ObjectId } = require('mongodb');
const { getDb } = require('./client');

const collectionQuestions = 'questions';
const collectionUsers = 'users';

const getQuestions = () => {

    const db = getDb();
    return db.collection(collectionQuestions);
}

const getUsers = () => {

    const db = getDb();
    return db.collection(collectionUsers);
}

function getId(id) {

    return ObjectId.isValid(id) ? ObjectId(id) : null;
}

// Api -> only these methods would be exported

exports.existUser = async (userId) => {

    const collectionUsers = getUsers();
    const user = await collectionUsers.find({ _id: getId(userId) }).toArray();
    return user.length !== 0 ? true : false;
}

exports.createUser = async () => {

    const collection = getUsers();

    const doc = { nextQuestion: 0, isGameOver: false, isHalfUsed: false, isAudienceAsked: false, isFriendUsed: false };
    const result = await collection.insertOne(doc);
    const _id = result.insertedId;

    // return the inserted user

    return { _id, ...doc }
}

exports.getQuestion = async (userId) => {

    const collectionUsers = getUsers();

    const userResult = await collectionUsers.find({ _id: getId(userId) }).toArray();

    let nextQuestion = userResult[0].nextQuestion;

    const collectionQuestions = getQuestions();

    const questionResult = await collectionQuestions.find({ questionNumber: nextQuestion }).toArray();

    if (questionResult.length !== 0) {

        const question = questionResult[0];

        const questionToReturn = {

            questionNumber: question.questionNumber,
            question: question.question,
            answers: [question.answer1, question.answer2, question.answer3, question.answer4],
            correctAnswer: question.correct,
            noMoreQuestions: false,
        }

        return questionToReturn;

    } else {

        // If the id not found, then there is no more questions in the database

        return {

            noMoreQuestions: true
        }
    }
}

exports.increaseQuestion = async (userId) => {

    const collectionUsers = getUsers();

    const userResult = await collectionUsers.find({ _id: getId(userId) }).toArray();

    const user = userResult[0];

    const nextQuestion = ++user.nextQuestion

    await collectionUsers.findOneAndUpdate({ _id: getId(userId) }, { $set: { nextQuestion } });
}

// implementing helpers in the game

exports.isGameOver = async (userId) => {

    const collectionUsers = getUsers();

    const userResult = await collectionUsers.find({ _id: getId(userId) }).toArray();

    const isGameOver = userResult[0].isGameOver;

    return isGameOver;
}

exports.gameOver = async (userId) => {

    const collectionUsers = getUsers();

    await collectionUsers.findOneAndUpdate({ _id: getId(userId) }, { $set: { isGameOver: true } });

}

exports.isFriendUsed = async (userId) => {

    const collectionUsers = getUsers();

    const userResult = await collectionUsers.find({ _id: getId(userId) }).toArray();

    const isFriendUsed = userResult[0].isFriendUsed;

    return isFriendUsed;
}

exports.useFriend = async (userId) => {

    const collectionUsers = getUsers();

    await collectionUsers.findOneAndUpdate({ _id: getId(userId) }, { $set: { isFriendUsed: true } });
}

exports.isHalfUsed = async (userId) => {

    const collectionUsers = getUsers();

    const userResult = await collectionUsers.find({ _id: getId(userId) }).toArray();

    const isHalfUsed = userResult[0].isHalfUsed;

    return isHalfUsed;
}

exports.useHalf = async (userId) => {

    const collectionUsers = getUsers();

    await collectionUsers.findOneAndUpdate({ _id: getId(userId) }, { $set: { isHalfUsed: true } });

}

exports.isAudienceAsked = async (userId) => {

    const collectionUsers = getUsers();

    const userResult = await collectionUsers.find({ _id: getId(userId) }).toArray();

    const isAudienceAsked = userResult[0].isAudienceAsked;

    return isAudienceAsked;
}

exports.askAudience = async (userId) => {

    const collectionUsers = getUsers();

    await collectionUsers.findOneAndUpdate({ _id: getId(userId) }, { $set: { isAudienceAsked: true } });

}