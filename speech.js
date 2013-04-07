$(function() {
  var recognizing = false;
  var globalTranscript = "";

  if (!('webkitSpeechRecognition' in window)) {
    info('Web speech does not exist. Please upgrade');
  } else {
    info('Web speech exists!');

    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = function() {
      recognizing = true;
      globalTranscript = "";
      $('#show-transcript').hide();
      info("Listening...");
    };

    recognition.onerror = function(event) {
      console.error(event);
      if (event.error == 'no-speech') {
        info("Error: No speech detected");
      }
      if (event.error == 'audio-capture') {
        info("Error: Problem capturing audio");
      }
      if (event.error == 'not-allowed') {
        info("Error: Not allowed to record");
      }
    };

    recognition.onend = function() {
      recognizing = false;
      $('#show-transcript').show();
      info('Done listening');
      showStart();
    };

    recognition.onresult = function(event) {
      var interim_transcript = '';
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          var transcript = event.results[i][0].transcript;
          process(transcript);
        }
      }
    };

    $('#start-button').click(function() {
      if (recognizing) {
        showStart();
        return recognition.stop();
      }

      showStop();
      recognition.start();
    });
  }

  $('#show-transcript').click(function() {
    $('#transcript').text(globalTranscript);
  });

  function process(transcript) {
    console.log(transcript);
    globalTranscript += transcript;
    var words = transcript.toLowerCase().split(" ");

    var rightMatches = ["next", "nice", "max", "x"];
    var leftMatches = ["previous", "last"];
    var slideMatches = ["slide", "line", "live", "life", "lives", "lied"];

    for (var i=0; i<words.length; i++) {
      if (isMatch(i, rightMatches)) {
        // Right
        break;
      }
      else if (isMatch(i, leftMatches)) {
        // Left
        break;
      }
    }

    function isMatch(i, matches) {
      return isIn(words[i], matches) &&
             i !== (words.length - 1) &&
             isIn(words[i+1], slideMatches);
    }

    function isIn(element, array) {
      return array.some(function(el) { return el === element; });
    }
  }

  function showStart() {
    $('#start-button').text("Start");
  }

  function showStop() {
    $('#start-button').text("Stop");
  }

  function info(msg) {
    $('#info').text(msg);
  }
});
