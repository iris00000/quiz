let radio; // 宣告 radio 物件
let inputBox; // 宣告輸入框物件（填空題用）
let submitButton; // 宣告按鈕
let resultText = ""; // 儲存結果文字
let questionData; // 儲存從 CSV 讀取的題目資料
let currentQuestion = 0; // 當前題目的索引
let correctCount = 0; // 答對的題數
let incorrectCount = 0; // 答錯的題數

function preload() {
  // 確保正確加載 CSV 文件
  questionData = loadTable("questions.csv", "csv", "header", () => {
    console.log("CSV Loaded:", questionData.getRowCount(), "rows");
  }, () => {
    console.error("Failed to load CSV file.");
  });
}

function setup() {
  // 產生一個全視窗的畫布
  createCanvas(windowWidth, windowHeight);
  console.log("Canvas created");
  background("#e9edc9");

  // 建立 Radio 選項
  radio = createRadio();
  radio.style('font-size', '35px');
  radio.style('color', '#1d3557');
  radio.position(windowWidth / 2 - 50, windowHeight / 2 + 50);

  // 建立輸入框（填空題用）
  inputBox = createInput();
  inputBox.style('font-size', '20px');
  inputBox.position(windowWidth / 2 - 100, windowHeight / 2 + 50);
  inputBox.hide(); // 預設隱藏輸入框

  // 建立按鈕
  submitButton = createButton('送出');
  submitButton.style('font-size', '20px');
  submitButton.position(windowWidth / 2 - 30, windowHeight / 2 + 150);
  submitButton.mousePressed(checkAnswer);

  // 顯示第一題
  loadQuestion(currentQuestion);
}

function draw() {
  background("#e9edc9");

  fill("#f7e1d7");
  noStroke();
  let rectWidth = windowWidth / 2;
  let rectHeight = windowHeight / 2;
  let rectX = (windowWidth - rectWidth) / 2;
  let rectY = (windowHeight - rectHeight) / 2;
  rect(rectX, rectY, rectWidth, rectHeight);

  fill("#000000");
  textSize(35);
  textAlign(CENTER, CENTER);

  // 如果還有題目，顯示題目
  if (currentQuestion < questionData.getRowCount()) {
    let question = questionData.getString(currentQuestion, "question");
    text(question, rectX + rectWidth / 2, rectY + rectHeight / 2 - 50);
  } else {
    // 顯示測驗結果
    text(`測驗結束！`, rectX + rectWidth / 2, rectY + rectHeight / 2 - 100);
    text(`答對題數: ${correctCount}`, rectX + rectWidth / 2, rectY + rectHeight / 2 - 50);
    text(`答錯題數: ${incorrectCount}`, rectX + rectWidth / 2, rectY + rectHeight / 2);
  }

  // 顯示結果文字
  textSize(25);
  fill("#000000");
  text(resultText, windowWidth / 2, windowHeight / 2 + 200);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (radio) radio.position(windowWidth / 2 - 50, windowHeight / 2 + 50);
  if (inputBox) inputBox.position(windowWidth / 2 - 100, windowHeight / 2 + 50);
  if (submitButton) submitButton.position(windowWidth / 2 - 30, windowHeight / 2 + 150);
}

function loadQuestion(index) {
  console.log("Loading question:", index);
  radio.html("");
  inputBox.hide(); // 預設隱藏輸入框
  radio.show(); // 預設顯示 Radio 選項

  // 如果還有題目，載入題目與選項
  if (index < questionData.getRowCount()) {
    let questionType = questionData.getString(index, "type"); // 題目類型
    let question = questionData.getString(index, "question");

    if (questionType === "choice") {
      // 載入選項
      let option1 = questionData.getString(index, "option1");
      let option2 = questionData.getString(index, "option2");
      let option3 = questionData.getString(index, "option3");
      let option4 = questionData.getString(index, "option4");

      radio.option(option1);
      radio.option(option2);
      radio.option(option3);
      radio.option(option4);
    } else if (questionType === "fill") {
      // 如果是填空題，顯示輸入框
      radio.hide();
      inputBox.show();
    }
  }
}

function checkAnswer() {
  let questionType = questionData.getString(currentQuestion, "type"); // 題目類型
  let correctAnswer = questionData.getString(currentQuestion, "answer"); // 取得正確答案
  let selected;

  if (questionType === "choice") {
    selected = radio.value(); // 取得選中的選項
  } else if (questionType === "fill") {
    selected = inputBox.value().trim(); // 取得輸入框的值
    inputBox.value(''); // 清空輸入框
  }

  if (selected === correctAnswer) {
    resultText = "答對";
    correctCount++;
  } else {
    resultText = "錯誤";
    incorrectCount++;
  }

  currentQuestion++;
  if (currentQuestion < questionData.getRowCount()) {
    loadQuestion(currentQuestion);
  } else {
    submitButton.html('再試一次');
    submitButton.mousePressed(resetQuiz);
  }
}

function resetQuiz() {
  currentQuestion = 0;
  correctCount = 0;
  incorrectCount = 0;
  resultText = "";
  submitButton.html('送出');
  submitButton.mousePressed(checkAnswer);
  loadQuestion(currentQuestion);
}