const timeTakenEl = document.querySelector(".time__taken span");
const numberOfMistakesEl = document.querySelector(".mistakes span");
const quoteEl = document.querySelector(".random__quote");
const userInputEl = document.querySelector(".user__input");
const startBtnEl = document.querySelector(".start__typing");
const resultCardEl = document.querySelector(".result");
const resultWpmEl = document.querySelector(".result__wpm");
const resultTimeEL = document.querySelector(".result__time--taken");
const resultMistakesEL = document.querySelector(".result__mistakes");

let timeTaken = 0;
let numberOfMistakes = 0;
let timerID;
let quoteArray = [];
let userInputArray = [];
userInputEl.disabled = true;

const reset = () => {
    timeTaken = 0;
    numberOfMistakes = 0;
    timeTakenEl.textContent = 0;
    numberOfMistakesEl.textContent = 0;
    userInputEl.value = "";
    getRandomQuote();
};

const getRandomQuote = async () => {
    const apiURL = "https://api.quotable.io/random?minLength=120&maxLength=150";
    const res = await fetch(apiURL);
    const { content } = await res.json();
    quoteArray = content
        .split("")
        .map((c) => `<span class="quote__chars">${c}</span>`);
    let result = "";
    quoteArray.forEach((c) => {
        result += c;
    });
    quoteEl.innerHTML = result;
};

const calculateResult = () => {
    const totalCharacters = userInputArray.length;
    const wpm = Math.round(totalCharacters / 5 / (timeTaken / 60));
    return wpm;
};

startBtnEl.addEventListener("click", () => {
    if (startBtnEl.textContent === "START TYPING") {
        userInputEl.disabled = false;
        userInputEl.focus();
        startBtnEl.textContent = "END TEST";
        timerID = setInterval(() => {
            timeTaken++;
            timeTakenEl.textContent = timeTaken;
        }, 1000);
    } else if (startBtnEl.textContent === "END TEST") {
        if (quoteArray.length !== userInputArray.length) {
            document.querySelector(".complete").style.top = "5%";
            setTimeout(() => {
                document.querySelector(".complete").style.top = "-100%";
            }, 2000);
            userInputEl.focus();
        } else {
            userInputEl.disabled = true;
            startBtnEl.textContent = "RESET";
            clearInterval(timerID);
            resultCardEl.classList.remove("hidden");
            resultTimeEL.textContent = timeTaken;
            resultMistakesEL.textContent = numberOfMistakes;
            resultWpmEl.textContent = calculateResult();
        }
    } else if (startBtnEl.textContent === "RESET") {
        startBtnEl.textContent = "START TYPING";
        reset();
        resultCardEl.classList.add("hidden");
    }
});

userInputEl.addEventListener("input", (e) => {
    userInputArray = e.target.value.split("");
    const arr = Array.from(document.querySelectorAll(".quote__chars"));
    arr.forEach((c, i) => {
        if (c.innerHTML === userInputArray[i]) {
            c.classList.add("correct");
        } else if (userInputArray[i] == null) {
            if (c.classList.contains("correct")) c.classList.remove("correct");
            if (c.classList.contains("incorrect")) {
                c.classList.remove("incorrect");
                numberOfMistakes--;
                numberOfMistakesEl.innerHTML = numberOfMistakes;
            }
        } else if (c.innerHTML !== userInputArray[i]) {
            if (!c.classList.contains("incorrect")) {
                c.classList.add("incorrect");
                numberOfMistakes++;
                numberOfMistakesEl.innerHTML = numberOfMistakes;
            }
        }
    });
});

window.addEventListener("load", getRandomQuote);

const query = window.matchMedia("(min-width: 992px)");
if (!query.matches) {
    document.body.innerHTML = "";
    document.body.style.backgroundColor = "#f0f9ff";
    document.body.innerHTML = `
       <div class="error">
            <h1>This is supposed to be opened in desktop devices</h1>
            <h1>😒😒😒</h1>
       </div>
    `;
}
