gameModule = (function() {
	'use strict'
    let exports = {
        timer: {}
    }
    const gameTimerElement = document.getElementById("game-timer");
    const operationElement = document.getElementById("operation");
	const resultStatusElement = document.getElementById("result-status");
	
	const conentElement = document.getElementsByClassName("content")[0];
	
    const circleAnimation = document.getElementsByClassName("circle_animation")[0];
	const navBar = document.getElementsByClassName("navbar")[0];
	const dropDownMenu = navBar.getElementsByClassName("dropdown-content")[0];
	let lastSelectedItem = dropDownMenu.getElementsByClassName('selected')[0];
	
	const dropDownTextContent = document.getElementById("dropbtn-text");
    const answerInputFieldElement = document.getElementById("answer");
	
    const totalPointsElement = document.getElementById("total-points");
    const lostPointsElement = document.getElementById("lost-points");
    const gainedPointsElement = document.getElementById("gained-points");
	
    const startPauseGameButton = document.getElementById("start-pause-game");
    const resetGameButton = document.getElementById("reset-game");
	


	const levelsTimers = [10, 20, 35, 50,60,80];
	const mathOperations = {
		add:'add', 
		sub:'sub', 
		mul:'mul', 
		div:'div',
		getRandomOp:function(mx){	
			let r =  Math.floor(Math.random() * (mx));
			return Object.keys(mathOperations)[r]
		}
	}
    let gameTimer;
	let correctResult;

	const game = {
		levels:{
		EASY : "easy",
        NORMAL : "normal",
        HARD : "hard",
        EXPERT : "expert",
        GENIUS : "genius",
		MEGA_GENIUS : "mgenius"
		},
		currentGameLevelTimer:levelsTimers[0],
        isAnswerError : false,
        isGamePaused : true,
        isTimerDone : true,
        gainedPointsCounter : 0,
		lostPoints: 0 ,
		totalPoints: 0 ,
		clearInput:function() {
			answerInputFieldElement.value = "";
			answerInputFieldElement.style.backgroundColor = "white";
		},
		
		increasePoints:function () {
			gainedPointsElement.innerHTML = (++this.gainedPointsCounter);
			totalPointsElement.innerHTML = (++this.totalPoints);
			
			resultStatusElement.setAttribute("src","res/correct-sign.svg");
			
		},
		
		reducePoints:function () {
			totalPointsElement.innerHTML = (--this.totalPoints);
			lostPointsElement.innerHTML = (++this.lostPoints);
			
			resultStatusElement.setAttribute("src","res/incorrect-sign.svg");
			
		},
		pause:function(){

			if(!answerInputFieldElement.hasAttribute("disabled"))
				answerInputFieldElement.setAttribute("disabled", "");
			
			if(gameTimerElement.classList.contains('animated'))
				gameTimerElement.classList = "";
			
            operationElement.style.visibility = "hidden";
            startPauseGameButton.innerHTML = "<i class=\"fas fa-play\"></i>&nbsp;&nbsp;Resume Game";
			
		},
		start:function(){

			if(answerInputFieldElement.hasAttribute("disabled"))
				answerInputFieldElement.removeAttribute("disabled", "");
			
			if(resetGameButton.hasAttribute("disabled"))
				resetGameButton.removeAttribute("disabled","");
			
			if(!gameTimerElement.classList.contains('animated'))
				gameTimerElement.classList = "animated flash infinite delay-0s";
			
            operationElement.style.visibility = "visible";
			startPauseGameButton.innerHTML = "<i class=\"fas fa-pause\"></i>&nbsp;&nbsp;Pause Game";
			
            if (this.isTimerDone) {
		
                countdown(this.currentGameLevelTimer)
                this.isTimerDone = false;
            }
			
		},
	
	}
	let currentGameLevel = game.levels.EASY;
	
    /**Buttons events */
    startPauseGameButton.addEventListener('click', startPauseGame);
	
	resetGameButton.addEventListener('click', resetGame);
	
	dropDownMenu.addEventListener('click',function(ev){
		
		let target = ev.target;
		updateSelectedMenuItem(target);
		
	});
    /************************** ************* ************* ************* ************* *************  */
    /**Input events */
    answerInputFieldElement.addEventListener('keydown',function() {
		//console.log("key down event handler");
        this.style.color = "#888";
    });

	answerInputFieldElement.addEventListener('keyup',function() {

        this.style.color = "black";
        let inputAnswer = this.value.trim();
        if (inputAnswer === "" || inputAnswer === undefined) {
            game.clearInput();
        }
		if (!isNaN(inputAnswer) && inputAnswer != "" && inputAnswer != undefined) {
			genLevelOperation(inputAnswer,this);
        } //end if
		

 
		
    }); 

    /************************** ************* ************* ************* ************* *************  */
	
    function checkAnswer(val, input,levelOperationGenMthd) {
		
        if (val === correctResult) {

            levelOperationGenMthd(operationElement);
            game.clearInput();
            game.increasePoints();
            resetTimer();
			clearInterval(gameTimer);
			countdown(game.currentGameLevelTimer);
 
            
        } else {
            game.isAnswerError = true;
            input.style.backgroundColor = "red";
        }
	
    };
	/**************************************************************************************************/
    function genEasyLevelOperation(oprElement) {

        let operandsnNumber = getRandomInteger(2, 2),
            operandRandValue,
            mathOperation,
            operands = [];
        correctResult = 0;
        var currentOPERATION;
        oprElement.innerHTML = "";
        for (let i = 0; i < operandsnNumber; i++) {
            mathOperation = mathOperations.add;

            operandRandValue = getRandomInteger(0, 20);
            operands[i] = operandRandValue;
            if (operandRandValue < 0) {
                oprElement.innerHTML += ("<span>(" + operands[i] + ")</span>")

            } else {
                oprElement.innerHTML += ("<span>" + operands[i] + "</span>");
            }

            switch (mathOperation) {
                case mathOperations.add:
                    currentOPERATION = operationData.add;
                    if (i == operandsnNumber - 1) break;
                    oprElement.innerHTML += ("&nbsp;<span><img id=\"plus\" src=\"./res/add.png\" alt=\"+(add)\"/></span>&nbsp;");
                    break;
                default:
                    break;
            }
            if (i < operandsnNumber - 1) {
                InputStack.push(operands[i], new Operation(currentOPERATION));
            } else {
                InputStack.evaluate(operands[i]);
                break;
            }

        }
        oprElement.innerHTML += ("<span>&nbsp;<img src=\"./res/equal.png\" alt=\"=(EQ)\"/></span>");
		
		/*
		if (isTimerDone) {
			countdown(currentGameLevel)
			isTimerDone = false;
		}
        */

		correctResult = InputStack.getPartialResult();
        //console.log("expected correct result:" + correctResult);
	
    };
    
	function genNormalLevelOperation(oprElement) {

        let operandsnNumber  = getRandomInteger(2, 2),
            operandRandValue,
            mathOperation, operands = [];
        correctResult  = 0;
        let currentOPERATION;
        oprElement.innerHTML = "";
        for (let i = 0; i < operandsnNumber; i++) {
			
            mathOperation  = mathOperations.getRandomOp(2);
			console.log("operation:"+mathOperation);

            operandRandValue = getRandomInteger(-10, 40);
			console.log("operand is:"+operandRandValue)
            operands[i] = operandRandValue;
            if (operandRandValue < 0) {
                oprElement.innerHTML +=("<span>(" + operands[i] + ")</span>");
            } else {
                oprElement.innerHTML +=("<span>" + operands[i] + "</span>");
            }

            switch (mathOperation) {
                case mathOperations.add:
                    currentOPERATION = operationData.add;
                    if (i == operandsnNumber - 1) break;
                    oprElement.innerHTML +=("&nbsp;<span><img id=\"plus\" src=\"./res/add.png\" alt=\"+(add)\" /></span>&nbsp;");
                    break;
                case mathOperations.sub:
                    currentOPERATION = operationData.subtract;
                    if (i == operandsnNumber - 1) break;
                    oprElement.innerHTML +=("&nbsp;<span><img id=\"minus\" src=\"./res/sub.png\" alt=\"-(sub)\" /></span>&nbsp;");
                    break;
                default:
                    break;
            }
            if (i < operandsnNumber - 1) {
                InputStack.push(operands[i], new Operation(currentOPERATION));
            } else {
                InputStack.evaluate(operands[i]);
                break;
            }

        }
        oprElement.innerHTML +=("<span>&nbsp;<img src=\"./res/equal.png\" alt=\"=(EQ)\"/></span>");
        correctResult = InputStack.getPartialResult();
        console.log("normal correct result:" + correctResult);
    }
    	
	function genHardLevelOperation(oprElement) {
        var operandsnNumber = getRandomInteger(2, 3),
            operandRandValue,
            mathOperation, operands = [];
        correctResult = 0;
        var currentOPERATION;
        oprElement.innerHTML = "";
        for (let i = 0; i < operandsnNumber; i++) {
            mathOperation = mathOperations.getRandomOp(3);

            operandRandValue = getRandomInteger(-10, 50);
            operands[i] = operandRandValue;
            if (operandRandValue < 0) {
                oprElement.innerHTML +=("<span>(" + operands[i] + ")</span>");
            } else {
                oprElement.innerHTML +=("<span>" + operands[i] + "</span>");
            }


            switch (mathOperation) {
                case 'add':
                    currentOPERATION = operationData.add;
                    if (i == operandsnNumber - 1) break;
                    oprElement.innerHTML +=("&nbsp;<span><img id=\"plus\" src=\"./res/add.png\" alt=\"+(add)\" /></span>&nbsp;");
                    break;
                case 'sub':
                    currentOPERATION = operationData.subtract;
                    if (i == operandsnNumber - 1) break;
                    oprElement.innerHTML +=("&nbsp;<span><img id=\"minus\" src=\"./res/sub.png\" alt=\"-(sub)\" /></span>&nbsp;");
                    break;
                case 'mul':
                    currentOPERATION = operationData.multiply;
                    if (i == operandsnNumber - 1) break;
                    oprElement.innerHTML +=("&nbsp;<span><img id=\"mul\" src=\"./res/mul.png\" alt=\"(mul)\" /></span>&nbsp;");
                    break;
                default:
                    break;
            }
            if (i < operandsnNumber - 1) {
                InputStack.push(operands[i], new Operation(currentOPERATION));
            } else {
                InputStack.evaluate(operands[i]);
                break;
            }

        }
        oprElement.innerHTML +=("<span>&nbsp;<img src=\"./res/equal.png\" alt=\"=(EQ)\"/></span>");
        correctResult = InputStack.getPartialResult();
        console.log("hard result:" + correctResult);
    }
	
    function genExpertLevelOperation(oprElement) {
        let operandsnNumber = getRandomInteger(2, 4),
            operandRandValue,
            mathOperation, operands = [];
        correctResult = 0;
        let currentOPERATION;
		oprElement.innerHTML = ("");
        for (let i = 0; i < operandsnNumber; i++) {
            mathOperation = mathOperations.getRandomOp(4);

            operandRandValue = getRandomInteger(-40, 99);
            operands[i] = operandRandValue;
            if (operandRandValue < 0) {
                oprElement.innerHTML +=("<span>(" + operands[i] + ")</span>");
            } else {
                oprElement.innerHTML +=("<span>" + operands[i] + "</span>");
            }


            switch (mathOperation) {
                case 'add':
                    currentOPERATION = operationData.add;
                    if (i == operandsnNumber - 1) break;
                    oprElement.innerHTML +=("&nbsp;<span><img id=\"plus\" src=\"./res/add.png\" alt=\"+(add)\" /></span>&nbsp;");
                    break;
                case 'sub':
                    currentOPERATION = operationData.subtract;
                    if (i == operandsnNumber - 1) break;
                    oprElement.innerHTML +=("&nbsp;<span><img id=\"minus\" src=\"./res/sub.png\" alt=\"-(sub)\" /></span>&nbsp;");
                    break;
                case 'mul':
                    currentOPERATION = operationData.multiply;
                    if (i == operandsnNumber - 1) break;
                    oprElement.innerHTML +=("&nbsp;<span><img id=\"mul\" src=\"./res/mul.png\" alt=\"(mul)\" /></span>&nbsp;");
                    break;
                case 'div':
                    currentOPERATION = operationData.divide;
                    if (i == operandsnNumber - 1) break;
                    oprElement.innerHTML +=("&nbsp;<span><img id=\"div\" src=\"./res/div.png\" alt=\"(div)\" /></span>&nbsp;");
                    break;
                default:
                    break;
            }
            if (i < operandsnNumber - 1) {
                InputStack.push(operands[i], new Operation(currentOPERATION));
            } else {
                InputStack.evaluate(operands[i]);
                break;
            }
            var res = InputStack.getPartialResult();
            if (!res) {
                console.log("Error divisio by:" + res);
				console.log(operands);
                return true;
            }

        }
		//note that the result is rounded
        oprElement.innerHTML +=("<span>&nbsp;<img src=\"./res/equal.png\" alt=\"=(EQ)\"/></span>");
        correctResult = Math.round(InputStack.getPartialResult());
        console.log("expert result:" + correctResult);

    }

    function genGeniusLevelOperation(oprElement) {
        let operandsnNumber = getRandomInteger(2, 4),
            operandRandValue,
            mathOperation, operands = [];
        correctResult = 0;
        let currentOPERATION;
        oprElement.innerHTML = ("");
        for (let i = 0; i < operandsnNumber; i++) {
            mathOperation = mathOperations.getRandomOp(4);

            operandRandValue = getRandomInteger(-999, 999);
            operands[i] = operandRandValue;
            if (operandRandValue < 0) {
                oprElement.innerHTML += ("<span>(" + operands[i] + ")</span>");
            } else {
                oprElement.innerHTML += ("<span>" + operands[i] + "</span>");
            }


            switch (mathOperation) {
                case 'add':
                    currentOPERATION = operationData.add;
                    if (i == operandsnNumber - 1) break;
                    oprElement.innerHTML +=("&nbsp;<span><img id=\"plus\" src=\"./res/add.png\" alt=\"+(add)\" /></span>&nbsp;");
                    break;
                case 'sub':
                    currentOPERATION = operationData.subtract;
                    if (i == operandsnNumber - 1) break;
                    oprElement.innerHTML +=("&nbsp;<span><img id=\"minus\" src=\"./res/sub.png\" alt=\"-(sub)\" /></span>&nbsp;");
                    break;
                case 'mul':
                    currentOPERATION = operationData.multiply;
                    if (i == operandsnNumber - 1) break;
                    oprElement.innerHTML +=("&nbsp;<span><img id=\"mul\" src=\"./res/mul.png\" alt=\"(mul)\" /></span>&nbsp;");
                    break;
                case 'div':
                    currentOPERATION = operationData.divide;
                    if (i == operandsnNumber - 1) break;
                    oprElement.innerHTML +=("&nbsp;<span><img id=\"div\" src=\"./res/div.png\" alt=\"(div)\" /></span>&nbsp;");
                    break;
                default:
                    break;
            }
            if (i < operandsnNumber - 1) {
                InputStack.push(operands[i], new Operation(currentOPERATION));
            } else {
                InputStack.evaluate(operands[i]);
                break;
            }
            var res = InputStack.getPartialResult();
            if (!res) {
                console.log("Error divisio by:" + res);
				console.log(operands);
                return true;
            }

        }
        oprElement.innerHTML +=("<span>&nbsp;<img src=\"./res/equal.png\" alt=\"=(EQ)\"/></span>");
        correctResult = InputStack.getPartialResult();
        console.log(" genius result:" + correctResult);

    }

    function genMegaLevelOperation(oprElement) {
        var operandsnNumber = getRandomInteger(4, 6),
            operandRandValue,
            mathOperation, operands = [];
        correctResult = 0;
        var currentOPERATION;
        oprElement.innerHTML =("");
        for (var i = 0; i < operandsnNumber; i++) {
            mathOperation = mathOperations.getRandomOp(4);

            operandRandValue = getRandomInteger(-9999, 9999);
            operands[i] = operandRandValue;
            if (operandRandValue < 0) {
                oprElement.innerHTML +=("<span>(" + operands[i] + ")</span>");
            } else {
                oprElement.innerHTML +=("<span>" + operands[i] + "</span>");
            }


            switch (mathOperation) {
                case 'add':
                    currentOPERATION = operationData.add;
                    if (i == operandsnNumber - 1) break;
                    oprElement.innerHTML +=("&nbsp;<span><img id=\"plus\" src=\"./res/add.png\" alt=\"+(add)\" /></span>&nbsp;");
                    break;
                case 'sub':
                    currentOPERATION = operationData.subtract;
                    if (i == operandsnNumber - 1) break;
                    oprElement.innerHTML +=("&nbsp;<span><img id=\"minus\" src=\"./res/sub.png\" alt=\"-(sub)\" /></span>&nbsp;");
                    break;
                case 'mul':
                    currentOPERATION = operationData.multiply;
                    if (i == operandsnNumber - 1) break;
                    oprElement.innerHTML +=("&nbsp;<span><img id=\"mul\" src=\"./res/mul.png\" alt=\"(mul)\" /></span>&nbsp;");
                    break;
                case 'div':
                    currentOPERATION = operationData.divide;
                    if (i == operandsnNumber - 1) break;
                    oprElement.innerHTML +=("&nbsp;<span><img id=\"div\" src=\"./res/div.png\" alt=\"(div)\" /></span>&nbsp;");
                    break;
                default:
                    break;
            }
            if (i < operandsnNumber - 1) {
                InputStack.push(operands[i], new Operation(currentOPERATION));
            } else {
                InputStack.evaluate(operands[i]);
                break;
            }
            var res = InputStack.getPartialResult();
            if (!res) {
                console.log("Error divisio by:" + res);
				console.log(operands);
                return true;
            }

        }
        oprElement.innerHTML +=("<span>&nbsp;<img src=\"./res/equal.png\" alt=\"=(EQ)\"/></span>");
        correctResult = InputStack.getPartialResult();
        console.log("mega result:" + correctResult);

    }
	/*********************************************************************************************/
	
    function countdown(secs) {
        gameTimerElement.innerHTML = ""
        let seconds = secs;

		
		
		gameTimerElement.innerHTML = secs;
		gameTimer = setInterval(function() {
			if (!game.isGamePaused) {
				gameTimerElement.innerHTML = --seconds;
				if (seconds <= 0) {
					resetTimer();
					game.reducePoints();
					seconds=game.currentGameLevelTimer;
					genLevelOperation();
				}

			}
		}, 1000);



    }
	
	function resetTimer() {
        gameTimerElement.innerHTML = game.currentGameLevelTimer;
    }
	
	function startPauseGame(){
	
        if (game.isGamePaused) {
			game.start();

        } else {
			game.pause();
        }
		
        game.isGamePaused = !game.isGamePaused;
        answerInputFieldElement.focus();
    
		
	}
	
	function resetGame(){
		
		if(gameTimer)clearInterval(gameTimer);

		game.isTimerDone = true;
		game.isGamePaused = true;
		
		answerInputFieldElement.style.color = "black";
		answerInputFieldElement.style.backgroundColor = "white";
		answerInputFieldElement.value = "";
		
		operationElement.style.visibility = "hidden";
        startPauseGameButton.innerHTML = `<i class="fas fa-play"></i>&nbsp;&nbsp;Start Game`;
		if(!answerInputFieldElement.hasAttribute("disabled"))
			answerInputFieldElement.setAttribute("disabled", "");
		
		game.gainedPointsCounter = 0;
		game.lostPoints = 0;
		game.totalPoints = 0;
		
		
		gainedPointsElement.innerHTML = (game.gainedPointsCounter);
		lostPointsElement.innerHTML = (game.lostPoints);
		totalPointsElement .innerHTML = (game.totalPoints);
		
		if(gameTimerElement.classList.contains('animated'))
			gameTimerElement.classList = "";
		
		resultStatusElement.setAttribute("src","res/correct-sign.svg");
		gameTimerElement.innerHTML = game.currentGameLevelTimer
		resetGameButton.setAttribute("disabled","");		
		//answerInputFieldElement.focus();
    
		genLevelOperation();
	}
	
	function init() {
		
		
        gameTimerElement.innerHTML = game.currentGameLevelTimer;
		if(!answerInputFieldElement.hasAttribute("disabled"))
			answerInputFieldElement.setAttribute("disabled", "");
        
		operationElement.style.visibility = "hidden";
        if (answerInputFieldElement != "") {
            answerInputFieldElement.focus();
            game.clearInput();
        }
		//genEasyLevelOperation(operationElement);
		genLevelOperation();

		window.addEventListener('blur',function(){
			if(!game.isGamePaused){
				game.pause();
			}
    
			game.isGamePaused = true;
	
		
		});		
		window.addEventListener('focus',function(){
			/*
			if(game.isGamePaused){
				game.start();
			}
    
			game.isGamePaused = false;
			answerInputFieldElement.focus();
			*/
		});
	
		//note : warn/prompt that when changing the level the score is lost unless saved
		window.addEventListener('keydown',function(event) {
			let target;
			if (event.ctrlKey) {
				if(event.which === 13){
					//ENTER key pressed
					event.preventDefault();
					resetGame();
					
					
					return;
				}

				let key = String.fromCharCode(event.which).toLowerCase();
				switch (key) {
					
					case 'c':
						event.preventDefault();
						game.clearInput();


						break;
					case 's':
		
						event.preventDefault();
						target = dropDownMenu.children.easy;
						updateSelectedMenuItem(target);
						
	
						
						break;
					case 'o':
						event.preventDefault();
						//event.stopPropagation();
						target = dropDownMenu.children.normal;
						updateSelectedMenuItem(target);

						
						break;
					case 'h':
						event.preventDefault();
						target = dropDownMenu.children.hard;
						updateSelectedMenuItem(target);
						
	
						break;
					case 'e':
						event.preventDefault();
						target = dropDownMenu.children.expert;
						updateSelectedMenuItem(target);
						


						break;
					case 'g':
						event.preventDefault();
						target = dropDownMenu.children.genius;
						updateSelectedMenuItem(target);
						

						break;
					case 'm':
						event.preventDefault();
						target = dropDownMenu.children.mgenius;
						updateSelectedMenuItem(target);
						

						
	
						break;
					case 'p':
						event.preventDefault();
						//start or pause game
						startPauseGame();
						break;
					break;
					default:
						break;
				}//end switch
			}//end if
		});
    };

	function getRandomInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
	
    function changeSkin(oldClass,newClass) {
	
	   navBar.classList.remove(oldClass);
	   navBar.classList.add(newClass);
	   conentElement.classList.remove(oldClass);
	   conentElement.classList.add(newClass);

    }
	
	function updateSelectedMenuItem(target){
		if(target.tagName === 'A' && !target.classList.contains('selected') && target.id != 'customized'){
			
			changeSkin(lastSelectedItem.id,target.id);
			dropDownTextContent.textContent = `LEVEL/${target.id.toUpperCase()}`;
			target.classList = lastSelectedItem.classList;
			lastSelectedItem.classList = "";
			lastSelectedItem = target;
			
		
		
			switch (target.id) {
		
				case game.levels.EASY:
	
	
	
					currentGameLevel = game.levels.EASY;
					game.currentGameLevelTimer = levelsTimers[0];
		
					
					break;
				case game.levels.NORMAL:
		

					currentGameLevel = game.levels.NORMAL;
					game.currentGameLevelTimer = levelsTimers[1];
		
					break;
				case game.levels.HARD:
		
		
					currentGameLevel = game.levels.HARD;
					game.currentGameLevelTimer = levelsTimers[2];
	
					
					break;
				case game.levels.EXPERT:
				
					currentGameLevel = game.levels.EXPERT;
					game.currentGameLevelTimer = levelsTimers[3];
					
			
					break;
				case game.levels.GENIUS:
			
					currentGameLevel = game.levels.GENIUS;
					game.currentGameLevelTimer = levelsTimers[4];
		
					
					
					break;
				case game.levels.MEGA_GENIUS:
		
					
					currentGameLevel = game.levels.MEGA_GENIUS;
					game.currentGameLevelTimer = levelsTimers[5];
			
					

					break;
		
				default:
					break;
			}//end switch
		
		
			resetGame();
			
			answerInputFieldElement.focus();
		}
	}
    
	function genLevelOperation(inputAnswer,inputAnserElem){


            switch (currentGameLevel) {
                case game.levels.EASY:
					if(inputAnswer && inputAnserElem){
		
						checkAnswer(parseInt(inputAnswer), inputAnserElem,genEasyLevelOperation);
					}else{
				
						genEasyLevelOperation(operationElement);
					}

                    break;
                case game.levels.NORMAL:
					if(inputAnswer && inputAnserElem){
			
						checkAnswer(parseInt(inputAnswer), inputAnserElem,genNormalLevelOperation);
					}else{
		
						genNormalLevelOperation(operationElement);
					}

                    break;
                case game.levels.HARD:

					if(inputAnswer && inputAnserElem){
			
						checkAnswer(parseInt(inputAnswer), inputAnserElem,genHardLevelOperation);
					}else{
		
						genHardLevelOperation(operationElement);
					}
				
                    break;
                case game.levels.EXPERT:
					if(inputAnswer && inputAnserElem){
			
						checkAnswer(parseInt(inputAnswer), inputAnserElem,genExpertLevelOperation);
					}else{
		
						genExpertLevelOperation(operationElement);
					}
                    break;
                case game.levels.GENIUS:
					if(inputAnswer && inputAnserElem){
			
						checkAnswer(parseInt(inputAnswer), inputAnserElem,genGeniusLevelOperation);
					}else{
		
						genGeniusLevelOperation(operationElement);
					}
                    break;
                case game.levels.MEGA_GENIUS:
					if(inputAnswer && inputAnserElem){
			
						checkAnswer(parseInt(inputAnswer), inputAnserElem,genMegaLevelOperation);
					}else{
		
						genMegaLevelOperation(operationElement);
					}
                    break;

                default:
		
            }
	
		
		
		
	}
	/**initial methodes calls */
    init();
    /*************************/
    
    return exports;
}());