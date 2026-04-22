const express = require('express');
const router = express.Router();
const { readFile } = require('fs').promises;

router.get("/", async (req, res) => {
    let chosenWords = await getWords();
    console.log("Chosen Words: ", chosenWords);
    res.render('quiz', { chosenWords });
});

router.post("/", async (req, res) => {
    let chosenWords = await getWords();

    let userChoice = req.body.userChoice;
    let correctDef = req.body.correctDef;
    let totalQuestions = parseInt(req.body.totalQuestions) + 1;
    let totalCorrect = parseInt(req.body.totalCorrect);

    if (userChoice === correctDef) {
        totalCorrect++;
    }

    res.render('quiz', { chosenWords, totalQuestions, totalCorrect });
});

let getWords = async () => {
    let randomPart = getRandomPart();
    let allWords = await readFile('resources/allwords.txt', 'utf8');
    let wordArray = allWords.split('\n');
    shuffle(wordArray);

    let choices = [];
    while (choices.length < 5) {
        let line = wordArray.pop();
        let [word, part, def] = line.split('\t');
        if (part === randomPart) {
            choices.push(line);
        }
    }

    return choices;
}

let getRandomPart = () => {
    let parts = ['noun', 'verb', 'adjective'];
    let randomIndex = Math.floor(Math.random() * parts.length);
    let chosenPart = parts[randomIndex];
    return chosenPart;
}

let shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        let randomNumber = Math.floor(Math.random() * (i + 1));
        [array[i], array[randomNumber]] = [array[randomNumber], array[i]];
    }
    console.log("Array shuffled!");
}

module.exports = router;