import { quizData } from "./questions.js";

const quiz = document.querySelector(".quiz-card");
const timer = document.querySelector("#clock");
const answerElm = document.querySelectorAll(".answer");
const [questionElm, option_1, option_2, option_3, option_4] =
  document.querySelectorAll(
    "#question, #option_1, #option_2, #option_3, #option_4"
  );
const submitBtn = document.querySelector("#submit");
const questionResult = document.querySelector("#questionResult");
const questionNo = document.querySelector(".current-question");

let currentQuestion = 0;
let score = 0;

function loadQuiz() {
  const { question, options } = quizData[currentQuestion];

  questionElm.innerText = `${currentQuestion + 1}: ${question}`;

  options.forEach((curOption, index) => {
    window[`option_${index + 1}`].innerText = curOption;
  });
}

loadQuiz();

function getSelectedOption() {
  let ans_index;
  answerElm.forEach((curOption, index) => {
    if (curOption.checked) {
      ans_index = index;
    }
  });
  return ans_index;
}

function deselectedAnswers() {
  answerElm.forEach((curElem) => (curElem.checked = false));
}

// Display the final score of the user on a new screen.
function showResult() {
  quiz.innerHTML = `<div class="result">
    <h2>🎉 Well Done!</h2>
    <p>You scored <span class="highlight">${score}</span> out of <span class="highlight">${
    quizData.length
  }</span>!</p>
    <p class="message">${
      score === quizData.length
        ? "Perfect score! You nailed it! 💯"
        : "Keep it up! Try again to improve your score. 💪"
    }</p>
    <button class="reloadBtn" onclick="location.reload()">🔄 Try Again</button>
  </div>`;
}

// check that the answer selected by the user is correct or incorrect.
function checkAnswer() {
  const selectedOptionIndex = getSelectedOption();
  if (selectedOptionIndex === quizData[currentQuestion].correct) {
    score = score + 1;
    questionResult.innerText = `Your Answer is correct`;
    questionResult.style.color = "rgba(83, 232, 83, 0.8)";
  } else {
    questionResult.innerHTML = `<span style="color: red;">Your Answer is wrong</span> |
    <span style="color: orange;">The correct answer is:</span>
    <span id="correct-answer" style="color: rgba(83, 232, 83, 0.8);"></span>`;
    document.getElementById("correct-answer").innerText = `${
      quizData[currentQuestion].options[quizData[currentQuestion].correct]
    }`;
  }
}

// disable the answer options and next question button
function disableRadioBtnsAndBtnClick() {
  answerElm.forEach((rb) => (rb.disabled = true));
  submitBtn.disabled = true;
}

// enable the answer options and next question button
function enableRadioBtnsAndBtnClick() {
  answerElm.forEach((rb) => (rb.disabled = false));
  submitBtn.disabled = false;
}

function optionNotSelectedOnTimerEnd() {
  questionResult.innerText = "Time Out!";
  questionResult.style.color = "rgb(198, 139, 28)";
}

// shows the current and total no. of questions
function checkQuestionNo() {
  questionNo.innerText = `${currentQuestion + 1} of ${
    quizData.length
  } Questions`;
}

checkQuestionNo();

// Question Timer feature
let time = 15;
timer.innerText = timerFormat(time);
let timeInterval;

function timerFormat(time) {
  if (time < 10) {
    return (time = "0" + time);
  }
  return time;
}

function changeQuestionOnTimerEnd() {
  if (time === 0) {
    const selectedOptionIndex = getSelectedOption();
    selectedOptionIndex === undefined
      ? optionNotSelectedOnTimerEnd()
      : checkAnswer();
    currentQuestion++;
    clearInterval(timeInterval);
    disableRadioBtnsAndBtnClick();
    setTimeout(() => {
      loadNextQuestion();
      enableRadioBtnsAndBtnClick();
    }, 2000);
  }
}

function changeQuestionOnBtnClick() {
  const selectedOptionIndex = getSelectedOption();
  if (selectedOptionIndex === undefined) {
    questionResult.innerText = "Please select an answer";
    questionResult.style.color = "red";
    return;
  }
  checkAnswer();
  currentQuestion++;
  clearInterval(timeInterval);
  disableRadioBtnsAndBtnClick();
  setTimeout(() => {
    loadNextQuestion();
    enableRadioBtnsAndBtnClick();
  }, 2000);
}

function changeQuestionOnTimerEndOrOnBtnClick(isButtonClicked = false) {
  if (time === 0 || isButtonClicked) {
    isButtonClicked === true
      ? changeQuestionOnBtnClick()
      : changeQuestionOnTimerEnd();
    return;
  }
  time = time - 1;
  timer.innerText = timerFormat(time);
}

function startTimer() {
  timeInterval = setInterval(changeQuestionOnTimerEndOrOnBtnClick, 1000);
}

startTimer();

function loadNextQuestion() {
  if (currentQuestion < quizData.length) {
    deselectedAnswers();
    questionResult.innerText = "";
    loadQuiz();
    checkQuestionNo();
    submitBtn.innerText =
      currentQuestion < quizData.length - 1 ? `Next Ques` : `Submit`;
    time = 15;
    timer.innerText = timerFormat(time);
    startTimer();
  } else {
    showResult();
  }
}

// button click
submitBtn.addEventListener("click", () => {
  changeQuestionOnTimerEndOrOnBtnClick(true);
});
