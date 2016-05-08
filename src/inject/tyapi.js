(function() {
var logTime = function(itemType, taskId, effortSpent, loggedTime) {

  headerScope.updateInlineEffortSpend(taskId, itemType, loggedTime,  effortSpent, "", "");

};

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

})();