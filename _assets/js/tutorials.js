/*
This function returns the value portion from the query parameter key/value pair as specified by name.
E.g. if ?foo=bar&bam=baz are given, calling getParameterByName("foo") will yield "bar",
calling getParameterByName("nonexistent") will return an empty string
*/
function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
  return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function selectReplacementCandidates() {
  $('[data-replace]').each( function( index, element ) {
    var $el = $(element);
    var replacementValue = $el.data('replace');
    var paramValue = getParameterByName(replacementValue);

    if (paramValue !== "") {
      var delimiter = $el.data('replace-delimiter');
      var template = $el.data('replace-template');

      if (delimiter != null && template != null) {
        var splitValues = paramValue.split(delimiter);
        var elements = $.map(splitValues, function(val) {
          return template.replace("{value}", val).replace(/:\d+/, "");
        });
        $el.text(elements.join("\n"));
      } else {
        $el.text(paramValue);
      }

      if ($el.parent().text().indexOf("http://") === 0) {
        $el.attr('onclick', "window.open( $(this).parent().text(), '_blank');");
        $el.css("cursor", "pointer");
      }
    }
  });
}

function removeSegments(personalized) {
  $("[data-personalized]").each(function( index, element ) {
    if (personalized) {
      if ($(element).data('personalized') === "hide") {
        $(element).remove();
      }
    } else {
      if ($(element).data('personalized') === "show") {
        $(element).remove();
      }
    }
  });
}

// Sets up ZeroClipbaord
function setupClipboard() {
  //Wrap every dom element containing a data-code attribute inside a container and place a copy button.
  $("[data-code]").wrap("<div class=\"code-wrapper\">");
  var begin = "<button data-clipable=\"true\" title=\"Copy command\" data-copied-msg=\"Copied command!\" class=\"btn btn-default btn-xs clipboard-btn\" data-encoded=\"";
  var end = "\"><i class='glyphicon glyphicon-file'></button>";

  $(".code-wrapper").each( function() {
    //We're encoding the URI such that special characters can be handled.
    var button = begin + encodeURI($(this).text()) + end;
    console.log();
    $(this).append(button);
  });

  ZeroClipboard.config( { moviePath: '{% asset_path ZeroClipboard.swf %}' } );
  var clip = new ZeroClipboard( $(".clipboard-btn") );

  clip.on('dataRequested', function (client, args) {
    clip.setText( decodeURI($(this).data('encoded')) );
  });
}

function recordProgress() {
  var state = JSON.parse(localStorage.getItem("tutorialProgress")) || {};
  $(".step-tutorial").click(function() {
    state[window.location.pathname] = this.getAttribute("href").slice(-1);

    localStorage.setItem("tutorialProgress", JSON.stringify(state));
  });
}

function isPersonalized() {
  if (getParameterByName("master-ip") === "" &&
    getParameterByName("mesos-pkg") === "") {
    // Not personalized
    return false;
  } else {
    // Personalized
    return true;
  }
}

function setupPersonalization() {
  $( "#personalization-form" ).on( "submit", function( event ) {
    event.preventDefault();
    var queryUrl = 'http://' + window.location.host + window.location.pathname + "?" + $( this ).serialize();
    window.location = queryUrl;
  });

  $(document).on("click", ".tutorial-configure", function() {
    $("#personalization-modal").modal();
  });

  $(document).on("click", ".popover-buttons", function() {
    $(".tutorial-configure").popover("hide");
  });

  $(document).on("click", ".clear-all", function(event) {
    event.preventDefault();
    $(this).closest("form").find("input[type=text]").val("");
  });

  if (!isPersonalized()) {
    $(".tutorial-configure").popover({
      placement: "bottom",
      html: "true",
      title: $("#config-popover h4").text(),
      content: $("#config-popover .content").html(),
      trigger: "manual"
    }).popover("show");
  }
}

setupPersonalization();
selectReplacementCandidates();
setupClipboard();
recordProgress();
