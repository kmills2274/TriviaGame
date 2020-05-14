$(document).ready(function(){
  
    // Event listeners
    $("#remaining-time").hide();
    $("#start").on('click', trivia.startGame);
    $(document).on('click' , '.option', trivia.guessChecker);
    
  })
  
  // Vars
  var trivia = {
    
    correct: 0,
    incorrect: 0,
    unanswered: 0,
    currentSet: 0,
    timer: 20,
    timerOn: false,
    timerId : '',

    // Questions
    questions: {
      q1: 'Tom Ford previously served as the creative director for both Yves Saint Laurent and which other brand?',
      q2: 'What is the name of the Parisian street where the first Chanel boutique is located?',
      q3: 'Louis Vuitton originally began as a manufacturer of what type of item?',
      q4: 'Who is the current editor-in-chief of Vogue America?',
      q5: 'Which of these cities is not considered to be one of the "big four" fashion capitals?',
      q6: 'What does the term Prêt-à-Porter translate to?',
      q7: "The soles of Christian Louboutin heels are what distinct color?"
    },

    // Answer Choices
    options: {
      q1: ['Gucci', 'Valentino', 'Moschino', 'Chanel'],
      q2: ['Avenue Montaigne', 'The Champs-Élysées', 'Rue Neuve des Capucines', 'Rue Cambon'],
      q3: ['Shoes', 'Hats', 'Scarves', 'Trunks'],
      q4: ['Samantha Berry', 'Alexa Chung', 'Anna Wintour', 'Nina Garcia'],
      q5: ['Berlin','Paris','New York','London'],
      q6: ['Made to Measure','Ready to Wear','Off the Runway','Made to Order'],
      q7: ['Teal', 'Red', 'Black','Gold']
    },

    // Correct Answers
    answers: {
      q1: 'Gucci',
      q2: 'Rue Cambon',
      q3: 'Trunks',
      q4: 'Anna Wintour',
      q5: 'Berlin',
      q6: 'Ready to Wear',
      q7: 'Red'
    },

   
    // Start game
    startGame: function(){

      // Reset game results
      trivia.currentSet = 0;
      trivia.correct = 0;
      trivia.incorrect = 0;
      trivia.unanswered = 0;
      clearInterval(trivia.timerId);
      
      // Game Section
      $('#game').show();
      
      // Results
      $('#results').html('');
      
      // Timer
      $('#timer').text(trivia.timer);
      
      // Hide "start" button
      $('#start').hide();
  
      // Show remaining time
      $('#remaining-time').show();
      
      // Ask question
      trivia.nextQuestion();
      
    },

    // Loop through and display next question and options 
    nextQuestion : function(){
      
      // 20 second timer for each question
      trivia.timer = 20;
       $('#timer').removeClass('last-seconds');
      $('#timer').text(trivia.timer);
      
  
      if(!trivia.timerOn){
        trivia.timerId = setInterval(trivia.timerRunning, 1000);
      }
      
      // Questions var
      var questionContent = Object.values(trivia.questions)[trivia.currentSet];
      $('#question').text(questionContent);
      
      // Choice options var
      var questionOptions = Object.values(trivia.options)[trivia.currentSet];
      
      // Creates the answer choice buttons
      $.each(questionOptions, function(index, key){
        $('#options').append($('<button class="option btn btn-light btn-lg">'+key+'</button>'));
      })
      
    },

    // Decrement timer
    timerRunning : function(){
     
      // Timer remaining turns red when below 5 seconds
      if(trivia.timer > -1 && trivia.currentSet < Object.keys(trivia.questions).length){
        $('#timer').text(trivia.timer);
        trivia.timer--;
          if(trivia.timer === 4){
            $('#timer').addClass('last-seconds');
          }
      }

      // (Else) If timer has run out- add 1 to unanswered count & show correct answer
      else if(trivia.timer === -1){
        trivia.unanswered++;
        trivia.result = false;
        clearInterval(trivia.timerId);
        resultId = setTimeout(trivia.guessResult, 5000);
        $('#results').html('<h3>Time is up! The correct answer was: ' + Object.values(trivia.answers)[trivia.currentSet] + '</h3>');
      }

      // (Else) If all the questions have been answered- end game & display results
      else if(trivia.currentSet === Object.keys(trivia.questions).length){
        
        // adds results of game (correct, incorrect, unanswered) to the page
        $('#results')
          .html('<h3> &hearts; Thanks for playing! &hearts; </h3>'+
          '<h3>Correct: '+ trivia.correct +'</h3>'+
          '<h3>Incorrect: '+ trivia.incorrect +'</h3>'+
          '<h3>Unaswered: '+ trivia.unanswered +'</h3>'+
          '<h2>Want to try again?</h2>');
        
        // hide game sction
        $('#game').hide();
        
        // show start button to begin a new game
        $('#start').show();
      }
      
    },

    // Evaluate the chosen answer
    guessChecker : function() {
      
      var resultId;
      
      // Answer to the current question 
      var currentAnswer = Object.values(trivia.answers)[trivia.currentSet];
      
      // If the text of the user choice matches the answer to the current question, add 1 to correct count
      if($(this).text() === currentAnswer){
        
        trivia.correct++;
        clearInterval(trivia.timerId);
        resultId = setTimeout(trivia.guessResult, 2000);
        $('#results').html('<h3>Genius!</h3>');
      }

      // (Else) If the user chose the wrong option, add 1 to incorrect count
      else{

        // Turn button red for incorrect choice
        $(this).addClass('btn-danger').removeClass('btn-light');
        
        trivia.incorrect++;
        clearInterval(trivia.timerId);
        resultId = setTimeout(trivia.guessResult, 4000);
        $('#results').html('<h3>Faux pas! The correct answer was: ' + currentAnswer +'</h3>');
      }
      
    },

    guessResult : function(){
      
      // Increment to next question set
      trivia.currentSet++;
      
      // Remove the options and results
      $('.option').remove();
      $('#results h3').remove();
      
      // Next question
      trivia.nextQuestion();
       
    }
  
  }