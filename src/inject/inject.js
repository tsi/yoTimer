(function() {


  // Init
  var init = function() {

    // Log time
    // ---------
    // itemType = TASK || 101_ERROR
    // effortSpent = "00:20"
    // loggedTime = "05/05/2016 13:11"
    var logTime = function(itemType, taskId, effortSpent, loggedTime) {

      debugger;
      headerScope.updateInlineEffortSpend(taskId, itemType, loggedTime,  effortSpent, "", "");

    };

    // var clickFn = function(e) {
    //   debugger;
    //   e.preventDefault();
    //   e.stopPropagation();
    // };
    // document.body.addEventListener('click', clickFn, true);

    $(document).on('DOMNodeInserted', function() {
      $('div.the-time').not('.yo-timer-processed')
        .addClass('yo-timer-processed')
        .after(
          $('<a href="" class="yo-timer-btn">Start Yo Timer</a>')
            .on('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              $('head title').text('COUNTER');
              logTime(); // Not defined
            })
        );
    });

  };

  // Inject init() into page.
  var execute = function (body) {
    if(typeof body === "function") { body = "(" + body + ")();"; }
    var el = document.createElement("script");
    el.textContent = body;
    document.body.appendChild(el);
    return el;
  };

  // var load = function (src, on_load, on_error) {
  //   var el = document.createElement("script");
  //   el.setAttribute("src", src);
  //   if (on_load != null) { el.addEventListener("load", on_load); }
  //   if (on_error != null) { el.addEventListener("error", on_error); }
  //   document.body.appendChild(el);
  //   return el;
  // };

  chrome.extension.sendMessage({}, function(response) {


    var readyStateCheckInterval = setInterval(function() {
      if (document.readyState === "complete") {
        clearInterval(readyStateCheckInterval);
        console.log('readyState === "complete"');
        execute(init);

        // load("../tyapi.js", function () {
        //   execute(function(){$.noop();});
        // });

     }
    }, 100);

  });

})();
