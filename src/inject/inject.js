(function() {

  // Log time
  // ---------
  // itemType = TASK || 101_ERROR
  // effortSpent = "00:20"
  // loggedTime = "05/05/2016 13:11"
  var logTime = function(itemType, taskId, effortSpent, loggedTime) {

    headerScope.updateInlineEffortSpend(taskId, itemType, loggedTime,  effortSpent, "", "");

  };

  // Init
  var init = function() {

    $(document).on('DOMNodeInserted', function() {
      $('a.start-stop').not('.yo-timer-processed')
        .addClass('yo-timer-processed')
        .after(
          $('<a href="" class="yo-timer-btn">Start Yo Timer</a>')
            .on('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              console.log('START');
              logTime(); // Not defined
            })
        );
    });

  };

  chrome.extension.sendMessage({}, function(response) {

    var readyStateCheckInterval = setInterval(function() {
      if (document.readyState === "complete") {
        clearInterval(readyStateCheckInterval);
        console.log('readyState === "complete"');
        init();
      }
    }, 100);
  });

})();
