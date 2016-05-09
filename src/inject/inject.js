(function() {


  // Init
  var init = function() {

    var interval;

    // Check if there's an active item.
    var activeItem = JSON.parse(localStorage.getItem('yoTimer')) ? JSON.parse(localStorage.getItem('yoTimer')).itemId : false;

    // Log time
    // ---------
    // itemType = TASK || 101_ERROR
    // effortSpent = "00:20"
    // loggedTime = "05/05/2016 13:11"
    var logTime = function(itemId, itemType, effortSpent, loggedTime) {

      debugger;
      headerScope.updateInlineEffortSpend(itemId, itemType, loggedTime,  effortSpent, "", "");

    };

    // Handle the stop-watch
    var timer = function(state) {
      var seconds = 0, minutes = 0, hours = 0, time,
          watch = $('.yo-timer-watch'),
          title = $('head title');
      // Start / Stop
      if (state == 'start') {
        if (watch.length < 1) {
          // Create the stop-watch
          watch = $('<time class="yo-timer-watch">00:00:00</time>').appendTo('body');
        }
        localStorage.setItem('yoTimerTitle', title.text());
        var add = function() {
          seconds++;
          if (seconds >= 60) {
            seconds = 0;
            minutes++;
            if (minutes >= 60) {
              minutes = 0;
              hours++;
            }
          }
          time = ('0' + hours).substr(-2) + ':' +
                 ('0' + minutes).substr(-2) + ':' +
                 ('0' + seconds).substr(-2);
          watch.text(time);
          title.text(time);
        };
        interval = setInterval(add, 1000);
      }
      else {
        clearInterval(interval);
        watch.remove();
        title.text(localStorage.getItem('yoTimerTitle'));
      }
    };

    var toggleTimer = function(btn) {
      var yo, hours, minutes, diffMs, item = btn.closest('.inrbx[item-id]');
      if ($('body').hasClass('yo-timer-running')) {
        // Timer running, log it.
        $('body').removeClass('yo-timer-running')
        item.removeClass('yo-timer-running');
        btn.text('Start Yo Timer');
        yo = JSON.parse(localStorage.getItem('yoTimer'));
        yo.loggedTime =  new Date();
        timer('stop');
        diffMs = yo.loggedTime - yo.time;
        hours = Math.round(diffMs / 3600000); // hours
        minutes = Math.round((diffMs % 3600000) / 60000); // minutes
        debugger;
        logTime(yo.itemId, yo.itemType, hours+':'+minutes, yo.loggedTime);
        localStorage.removeItem('yoTimer');
      }
      else {
        // Timer stopped, start it.
        $('body').addClass('yo-timer-running')
        item.addClass('yo-timer-running');
        btn.text('Stop Yo Timer');
        yo = {
          time: Date.now(),
          itemId: item.attr('item-id'),
          itemType: item.attr('itemtype')
        };
        debugger;
        timer('start');
        localStorage.setItem('yoTimer', JSON.stringify(yo));
      }
    };

    // var clickFn = function(e) {
    //   debugger;
    //   e.preventDefault();
    //   e.stopPropagation();
    // };
    // document.body.addEventListener('click', clickFn, true);

    $(document).on('DOMNodeInserted', function() {
      // Todo throttle
      if (activeItem) {
        $('[item-id="'+activeItem+'"]').not('.yo-timer-running').addClass('yo-timer-running');
      }

      $('div.the-time').not('.yo-timer-processed')
        .addClass('yo-timer-processed')
        .after(
          $('<a href="" class="yo-timer-btn">Start Yo Timer</a>')
            .on('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              toggleTimer($(this));
            })
        );
    });

  };

  // http://stackoverflow.com/a/14901197/1660055
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
        execute(init);

        // load("../tyapi.js", function () {
        //   execute(function(){$.noop();});
        // });

     }
    }, 100);

  });

})();
