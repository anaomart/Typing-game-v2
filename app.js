let words =
    "eight air they horse heat morning age walk sit quick came numeral gold heat did will map her know heard deep group until help speed special piece test been how river free music same start there man six week lead yes reach above unit record nothing own wonder more small head same mother best ago press house fill are don't body blue weight pose back now follow gave feel note work soon all paint real port power correct front must keep world door him piece talk use room laugh before earth listen farm try while appear if he eight table bed move act war by stay street govern each here island red short four boat his teach find street against complete beauty hot game vowel use ease pose came told more that distant six word mountain big standard see animal back much cry though don't learn why cut came me strong two night tell language fast stand am class age there which start map common front stay short him this let thousand object light game to began came bring street road write at is father us sing up rock bring wonder both yet teach moon best four special noun machine head fish green sun move moon boat place such laugh note also dry yet take are bird went fly warm short half made school since street product language for watch certain busy north work produce differ plain laugh listen last cut live good ever whole young animal ground over whole done road follow plan carry own fact even fill far new should own fly carry people green small near tree strong end will several help song go mile ship standard weight ask nothing end force cry let one gold black found top door but new country name form wood numeral";
words = words.split(" ");
let wordsDiv = document.getElementById("words");
const gameTime = 30 * 1000;
window.timer = null;
window.gameStart = null;
const overlay = document.querySelector('.overlay')
const result = document.querySelector('.result');
const button = document.querySelector('.box button')
const p = document.querySelector('.box p')
button.addEventListener('click', () => {
    gameOver();
    setTimeout(() => { location.reload() }, 0)
})

function addClass(el, name) {
    el.className += " " + name;
}

function removeClass(el, name) {
    el.className = el.className.replace(name, "");
}

function randomWord() {
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
}

function formatWord(word) {
    return `
    <div class='word'>
    <span class='letter'>${word
            .split("")
            .join('</span><span class="letter">')}</span>
     </div>`;
}

function getWPM() {
    const words = [...document.querySelectorAll('.word')]
    const lastTypedWord = document.querySelector('.word.current')
    const lastTypedWordIndex = words.indexOf(lastTypedWord);
    const typedWords = words.slice(0, lastTypedWordIndex);
    const correctWords = typedWords.filter(word => {
        const letters = [...word.children];
        const incorrectLetter = letters.filter(letter => letter.className.includes('incorrect'));
        const correctLetters = letters.filter(letter => letter.className.includes('correct'));
        return incorrectLetter.length === 0 && correctLetters.length === letters.length;

    });
    return correctWords.length / gameTime * 60000;
}

function gameOver() {
    overlay.style.display = 'block'
    clearInterval(window.timer);
    addClass(document.getElementById('game'), 'over');
    result.innerHTML = 'WPM:' + getWPM();
    const text = { 40: "You doing Great " }
    p.innerHTML = getWPM() < 20 ? "You can do better <br> practice Here  <a href='https://www.keybr.com/'>Click</a>" : getWPM() < 50 ? "You doing Great " : "Wow " + getWPM() + " This is impressive"
}

function newGame() {

    wordsDiv.innerHTML = "";
    document.getElementById('info').innerHTML = gameTime / 1000
    for (let i = 0; i < 300; i++) {
        wordsDiv.innerHTML += formatWord(randomWord());
    }
    window.timer = null;
    addClass(document.querySelector(".word"), "current");
    addClass(document.querySelector(".letter"), "current");
    const currentWord = document.querySelector(".word.current");
    let cursor = document.getElementById('cursor')
    cursor.style.left = currentWord.getBoundingClientRect().right + 50 + "px";
    cursor.style.top = currentWord.getBoundingClientRect().top + "px";
}

document.getElementById("game").addEventListener("keyup", (e) => {
    document.querySelector('#cursor').style.display = "block";
    const allWords = [...document.querySelectorAll('.word')]
    const key = e.key;
    const currentWord = document.querySelector(".word.current");
    const currentLetter = document.querySelector(".letter.current");
    const expected = currentLetter ? currentLetter.innerHTML : " ";
    const isLetter = key.length === 1 && key !== " ";
    const isSpace = key === " ";
    const isBackspace = key == "Backspace";
    let isFirstLetter = false;
    currentWord ? (isFirstLetter = currentLetter === currentWord.firstElementChild) : null;
    console.log({ key, expected });
    if (document.querySelector('#game.over')) {
        return;
    }

    if (!window.timer && isLetter) {
        window.timer = setInterval(() => {
            if (!window.gameStart) {
                window.gameStart = (new Date()).getTime();
            }
            const currentTime = (new Date()).getTime();
            const msPassed = currentTime - window.gameStart;
            const sPassed = Math.floor(msPassed / 1000);
            const sLeft = (gameTime / 1000) - sPassed;
            if (sLeft <= 0) {
                gameOver();
                return;
            }
            document.getElementById('info').innerHTML = sLeft;

        }, 1000)
    }


    if (isLetter) {
        if (currentLetter) {
            addClass(currentLetter, key === expected ? "correct" : "incorrect");
            removeClass(currentLetter, "current");
            if (currentLetter.nextSibling) {
                addClass(currentLetter.nextSibling, "current");
            }
        } else {
            // const incorrectLetter = document.createElement("span");
            // incorrectLetter.innerHTML += key;
            // incorrectLetter.className = "letter incorrect extra";
            // currentWord.appendChild(incorrectLetter);
        }
    }
    if (isSpace) {
        if (expected !== " ") {
            const letterToInvalidate = [
                ...document.querySelectorAll(".word.current .letter:not(.correct)"),
            ];
            letterToInvalidate.forEach((letter) => addClass(letter, "incorrect"));
        }
        removeClass(currentWord, "current");
        addClass(currentWord.nextElementSibling, "current");
        if (currentLetter) {
            removeClass(currentLetter, "current");
        }
        addClass(currentWord.nextElementSibling.firstElementChild, "current");
    }
    if (isBackspace) {
        if (!currentWord.previousElementSibling && !currentLetter.previousElementSibling) return;

        if (currentLetter && isFirstLetter) {
            removeClass(currentWord, "current");
            addClass(currentWord.previousElementSibling, "current");
            removeClass(currentLetter, "current");
            addClass(currentWord.previousElementSibling.lastElementChild, "current");
            removeClass(
                currentWord.previousElementSibling.lastElementChild,
                "correct"
            );
            removeClass(
                currentWord.previousElementSibling.lastElementChild,
                "incorrect"
            );
        }
        if (currentLetter && !isFirstLetter) {
            removeClass(currentLetter, "current");
            addClass(currentLetter.previousElementSibling, "current");
            removeClass(currentLetter.previousElementSibling, "correct");
            removeClass(currentLetter.previousElementSibling, "incorrect");
        }
        if (!currentLetter) {
            addClass(currentWord.lastElementChild, "current");
            removeClass(currentWord.lastElementChild, "correct");
            removeClass(currentWord.lastElementChild, "incorrect");
        }

        const words = document.getElementById("words");
        const margin = parseInt(words.style.marginTop || "0");
        margin && (words.style.marginTop = margin + 35 + "px");
    }
    if (currentWord.getBoundingClientRect().top > 256) {
        const words = document.getElementById("words");
        const margin = parseInt(words.style.marginTop || "0");
        words.style.marginTop = margin - 35 + "px";
    }
    // move the courser
    const nextLetter = document.querySelector(".letter.current");
    const courser = document.querySelector("#cursor");
    const nextWord = document.querySelector(".word.current");
    if (nextLetter) {
        courser.style.top = nextLetter.getBoundingClientRect().top + 2 + "px";
        courser.style.left = nextLetter.getBoundingClientRect().left + 2 + "px";
    } else {
        courser.style.top = nextWord.getBoundingClientRect().top + 7 + "px";
        courser.style.left = nextWord.getBoundingClientRect().right + 2 + "px";
    }
});
document.getElementById('newGame').addEventListener('click', () => {
    gameOver();
    setTimeout(() => { location.reload() }, 2000)
})

newGame();
