const quizData = [
  {
    question: "What does HTML stand for?",
    options: [
      "HyperText Markup Language.",
      "Hyper Transfer Markup Language.",
      "HighText Markup Language.",
      "HyperText Machine Language.",
    ],
    correct: 0,
  },

  {
    question: "Which tag is used to define an unordered list in HTML?",
    options: ["<ol>", "<ul>", "<li>", "<list>"],
    correct: 1,
  },

  {
    question: "How do you add a comment in HTML?",
    options: [
      "<!--- This is a comment --->",
      "// This is a comment",
      "/* This is a comment */",
      "<!-- This is a comment -->",
    ],
    correct: 3,
  },

  {
    question: "Which tag is used to define an ordered list in HTML?",
    options: ["<li>", "<ul>", "<ol>", "<list>"],
    correct: 2,
  },
];

const quiz = document.querySelector("#quiz");
const timer = document.querySelector("#clock");
// const scores = document.querySelector("#score");
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
  quiz.innerHTML = `
                <div class="result">
                <h2>Your Score: ${score}/${quizData.length} correct Answers</h2>
                <p>Congractulations on completing the quiz!</p>
                <button class="reloadBtn" onclick="location.reload()">Play Again</button>
                </div>`;
}

// check that the answer selected by the user is correct or incorrect.
function checkAnswer() {
  const selectedOptionIndex = getSelectedOption();
  if (selectedOptionIndex >= 0) {
    if (selectedOptionIndex === quizData[currentQuestion].correct) {
      score = score + 1;
      questionResult.innerText = `Your Answer is correct`;
    } else {
      questionResult.innerText = `Your Answer is wrong | The correct answer is ${
        quizData[currentQuestion].options[quizData[currentQuestion].correct]
      }`;
    }
    currentQuestion++;
  } else {
    questionResult.innerText = "Please select an answer";
  }
}

function optionNotSelectedOnTimerEnd() {
  questionResult.innerText = "Time Out";
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

function changeQuestionOnTimerEndOrOnBtnClick(isButtonClicked) {
  if (time === 0 || isButtonClicked) {
    clearInterval(timeInterval);
    checkAnswer();
    setTimeout(() => {
      loadNextQuestion();
    }, 1000);
    return;
  }
  time = time - 1;
  timer.innerText = timerFormat(time);
}

function startTimer() {
  timeInterval = setInterval(changeQuestionOnTimerEndOrOnBtnClick, 1000);
}

// startTimer();

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
