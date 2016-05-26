(function() {
  "use strict";

  // yoTimer
  var yoTimer = function() {
    var TIME_LOGS_PATH = 'timeLogs';
    var ACTIVE_TIMER_PATH = 'activeTimer';
    var user = localStorage.getItem('yoTimer.user');
    var timerRef;
    var logRef;
    var FBTimer = {itemId : false, itemType : false, status : 0, startTime : false};

    var getDiffInString = function() {
      var seconds, minutes, hours, time, loggedTime = Date.now();
      var diffS = (loggedTime - FBTimer.startTime) / 1000;
      if (diffS < 1) {
        return "00:00:00";
      }

      // 2- Extract hours:
      hours = parseInt( diffS / 3600 ); // 3,600 seconds in 1 hour
      diffS = diffS % 3600; // seconds remaining after extracting hours
      // 3- Extract minutes:
      minutes = parseInt( diffS / 60 ); // 60 seconds in 1 minute
      // 4- Keep only seconds not extracted to minutes:
      seconds = parseInt(diffS % 60);
      time = ('0' + hours).substr(-2) + ':' +
        ('0' + minutes).substr(-2) + ':' +
        ('0' + seconds).substr(-2);
      return time;
    };

    var getStartTimeInString = function() {
      var minutes, hours, time, loggedTime = new Date(FBTimer.startTime);
      // Hours part from the timestamp
      hours = loggedTime.getHours();
      // Minutes part from the timestamp
      minutes = "0" + loggedTime.getMinutes();
      // Will display time in 10:30 format
      time = hours + ':' + minutes.substr(-2);
      return time;
    };

    var timerValueCallback = function(snapshot) {
      var newVal = snapshot.val();
      var toggleTimer = false;
      if (FBTimer.status === 0 && newVal.status === 1) {
        //Start timer.
        toggleTimer = true;
      }
      else if (FBTimer.status === 1 && newVal.status === 0) {
        //Stop timer
        toggleTimer = true;
      }
      FBTimer = newVal;
      if (toggleTimer) {
        toggleDomTimer();
      }
    };

    var setFBRef = function() {
      timerRef = new Firebase("https://yotimer.firebaseio.com/" + ACTIVE_TIMER_PATH + "/" + user);
      logRef = new Firebase("https://yotimer.firebaseio.com/" + TIME_LOGS_PATH + "/" + user);
      timerRef.on("value", timerValueCallback, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
    };
    setFBRef();

    var getTimer = function() {
      return FBTimer;
    };
    var timerInteval;


    // Log time
    // ---------
    // itemType = TASK || 101_ERROR
    // effortSpent = "00:20"
    // loggedTime = "05/05/2016 13:11"
    var logTime = function(itemId, itemType, effortSpent, loggedTime) {
      headerScope.updateInlineEffortSpend(itemId, itemType, loggedTime,  effortSpent, "", "");
    };

    var toggleFBTimer = function(id) {
      var item = $('.inrbx[item-id="' + id + '"]');
      if (FBTimer.status === 0) {
        startFBTimer(item.attr('item-id'), item.attr('itemtype'));
        item
          .addClass('yo-timer-running')
          .find('.yo-timer-btn')
          .text('Stop Yo Timer');
      }
      else {
        var loggedTime = Date.now(), diffS, hours, minutes, seconds;
        var loggedDate = new Date();
        diffS = (loggedTime - FBTimer.startTime) / 1000;
        // 2- Extract hours:
        hours = parseInt( diffS / 3600 ); // 3,600 seconds in 1 hour
        diffS = diffS % 3600; // seconds remaining after extracting hours
        // 3- Extract minutes:
        minutes = parseInt( diffS / 60 ); // 60 seconds in 1 minute
        if (minutes === 0) {
          minutes = 1;
        }
        logTime(FBTimer.itemId, FBTimer.itemType, hours+':'+minutes, loggedDate);

        updateFBLog(loggedTime, loggedDate, hours+':'+minutes);
        stopFBTimer();
        item
          .removeClass('yo-timer-running')
          .find('.yo-timer-btn')
          .text('Start Yo Timer');
      }
    };

    var toggleDomTimer = function() {

      var watch = $('.yo-timer-watch');
      var title = $('head title');

      if (FBTimer.status == 1) {
        $('[item-id="'+FBTimer.itemId+'"]').not('.yo-timer-running')
          .addClass('yo-timer-running');

        $('body').addClass('yo-timer-running');
        if (watch.length < 1) {
          // Create the stop-watch
          watch = $('<div class="yo-timer-watch" />');
          watch.append('<time class="yo-timer-time">'+ getDiffInString() +'</time>');
          watch.append(
            $('<time />')
              .addClass('yo-timer-edit')
              .text(getStartTimeInString())
              .prop('contenteditable', true)
              .keypress(function(e) {
                if (e.which === 13) {
                  e.preventDefault();
                  toggleTimeEdit();
                }
              })
          );
          watch.append($('<i title="Edit time"> E </i>').click(toggleTimeEdit));
          watch.append($('<i title="Stop timer"> S </i>').click(stopFromTimer));
          watch.appendTo('body');
        }

        localStorage.setItem('yoTimer.title', title.text());
        var add = function() {
          title.text(getDiffInString());
          watch.find('.yo-timer-time').text(getDiffInString());
        };

        var initTimer = function() {
          timerInteval = setInterval(add, 1000);
        };
        setTimeout(initTimer, parseInt(Date.now()/1000) * 1000 + 1000);

      }
      else {
        $('div.yo-timer-running').removeClass('yo-timer-running');
        $('body').removeClass('yo-timer-running');
        clearInterval(timerInteval);
        watch.remove();
        title.text(localStorage.getItem('yoTimer.title'));
      }
    };

    var startFBTimer = function(itemId, itemType) {
      updateFBTimer({itemId : itemId, itemType : itemType, status : 1, startTime : parseInt(Date.now()/1000) * 1000 + 1000});
    };

    // newTime: "10:30"
    var editFBTimer = function(newTime) {
      // Leave only numbers ("10:30" -> "1030")
      // Pad 9:30 with 0, so it's 09:30
      newTime = "0" + newTime.replace(/[^0-9]/g, '');
      var newTimeStamp = new Date();
      newTimeStamp.setHours(
        parseInt(newTime.substr(-4, 2), 10),
        parseInt(newTime.substr(-2), 10),
        0, 0 );
      newTimeStamp = newTimeStamp.getTime();
      FBTimer.startTime = parseInt(newTimeStamp/1000) * 1000 + 1000;
      updateFBTimer(FBTimer);
    };

    var stopFBTimer = function() {
      updateFBTimer({itemId : false, itemType : false, status : 0, startTime : false});
    };

    var updateFBLog = function(endTime, endDate, duration) {
      logRef.child(endTime).set({
        itemId : FBTimer.itemId,
        itemType : FBTimer.itemType,
        startTime : FBTimer.startTime,
        endTime : endTime,
        loggedTime : endDate.toLocaleString(),
        duration : duration
      });
    };

    var updateFBTimer = function(params) {
      timerRef.set(params);
    };

    var toggleTimeEdit = function() {
      var watch = $('.yo-timer-watch');
      if (watch.hasClass('editing')) {
        editFBTimer(watch.find('.yo-timer-edit').text());
      }
      watch.toggleClass('editing');
    };

    var stopFromTimer = function() {
      var activeItem = false;
      var yoTimer = getTimer();
      if (yoTimer.status == 1) {
        activeItem = yoTimer.itemId;
      }
      if (activeItem) {
        toggleFBTimer(activeItem);
      }
    };

    $(document).on('DOMNodeInserted', function() {

      var activeItem = false;
      var yoTimer = getTimer();
      if (yoTimer.status == 1) {
        activeItem = yoTimer.itemId;
      }

      if ($('div.the-time').not('.yo-timer-processed').size() > 0) {
        $('div.the-time').not('.yo-timer-processed')
          .addClass('yo-timer-processed')
          .after(
            $('<a href="" class="yo-timer-btn">Start Yo Timer</a>')
              .on('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                toggleFBTimer($(this).closest('.inrbx[item-id]').attr('item-id'));
              })
          );
        if (activeItem) {
          $('[item-id="'+activeItem+'"]').find('.yo-timer-btn')
            .text('Stop Yo Timer');
        }
      }


      if (activeItem) {
        $('[item-id="'+activeItem+'"]').not('.yo-timer-running')
          .addClass('yo-timer-running');
      }

    });

  };

  // http://stackoverflow.com/a/14901197/1660055
  // Inject yoTimer() into page.
  var execute = function (body) {
    if(typeof body === "function") { body = "(" + body + ")();"; }
    var el = document.createElement("script");
    el.textContent = body;
    document.body.appendChild(el);
    return el;
  };

  // Load Firebase script fron CDN.
  var load = function (src, on_load, on_error) {
     var el = document.createElement("script");
     el.setAttribute("src", src);
     if (on_load !== null) { el.addEventListener("load", on_load); }
     if (on_error !== null) { el.addEventListener("error", on_error); }
     document.body.appendChild(el);
     return el;
  };

  var yoTimerUser;

  chrome.extension.sendMessage({}, function(response) {

    var readyStateCheckInterval = setInterval(function() {
      if (document.readyState === "complete") {
        clearInterval(readyStateCheckInterval);

        chrome.storage.sync.get({
          yoTimerUid: ''
        }, function(items) {
          localStorage.setItem('yoTimer.user', items.yoTimerUid);
        });

        load("https://cdn.firebase.com/js/client/2.4.2/firebase.js", function () {
          execute(yoTimer);
        });

     }
    }, 100);

  });

})();
