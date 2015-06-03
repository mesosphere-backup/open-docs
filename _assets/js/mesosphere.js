//= require templates/job-opening

(function() {
  var $carousel = $("#tutorial-carousel");
  var pathParts = window.location.pathname.split("/");
  var tutorialName = pathParts[pathParts.length - 2];

  function loadImgPlaceholders() {
    $carousel.find(".item.active [data-img-placeholder]").each(
      function(index, imgPlaceholder) {
        var $imgPlaceholder = $(imgPlaceholder);
        var attrs = $imgPlaceholder.data();

        // Don't copy the "data-img-placeholder" value as an attribute for the
        // new Image element.
        delete attrs.imgplaceholder;

        // Copy all data- attributes from the placeholder to the new Image
        // element and replace the placeholder with the image.
        $imgPlaceholder.replaceWith($("<img>").attr(attrs));
      }
    );
  }

  function pushCarouselState() {
    history.replaceState({}, "", "#" + $(this).find(".item.active").attr("id"));
  }

  function supportsHistoryApi() {
    return !!(window.history && history.replaceState);
  }

  function trackEvent() {
    if (window.analytics != null) {
      var currentSlideNumber =
        $carousel.find(".item.active").attr("id").substr(5);
      analytics.track("Viewed " + tutorialName + " slide", {
        "Slide#": currentSlideNumber
      });
    }
  }

  if (supportsHistoryApi()) {
    if ($carousel.length > 0) {
      $(window).on("popstate.bs.carousel", function() {
        var step;
        var hash = location.hash;

        if (hash) {
          step = parseInt(hash.substr(6), 10);
        } else {
          step = 0;
        }

        // Pause carousel state push while navigating to the proper slide.
        $carousel.off("slid", pushCarouselState);

        // Navigate to the slide from the hash.
        $carousel.carousel(step);

        // Restart state pushing after navigation is done.
        $carousel.on("slid.bs.carousel", pushCarouselState);
      });

      $carousel.on("slid.bs.carousel", pushCarouselState);
    }
  }

  $carousel.on("slid.bs.carousel", loadImgPlaceholders);
  $carousel.on("slid.bs.carousel", trackEvent);

  // --- Download analytics
  if (window.analytics != null) {
    analytics.trackLink($(".download-link"), "download.start", function(el) {
      return {
        rel: el.getAttribute('data-rel'),
        pkg: el.getAttribute('data-pkg')
      }
    });
  }

  // --- Enable smooth scrolling to anchors
  var scrollDuration = 500;
  $("a.scroll[href^='#']").on('click', function(e) {
    e.preventDefault();
    var hash = this.hash;
    $('html, body').animate({
       scrollTop: $("a[name=" + hash.slice(1) + "]").offset().top
     }, scrollDuration, function() { window.location.hash = hash; });
  });

  // --- Populate Job Listings
  var $listOpenings = $("#list-openings");
  if ($listOpenings.length > 0) {
    $.ajax({
      dataType: "jsonp",
      success: function(data) {
        var openings = "";
        data.jobs.forEach(function(job) {
          openings += window.JST["templates/job-opening"](job);
        });
        $listOpenings.html(openings);
      },
      url: "https://api.greenhouse.io/v1/boards/mesosphere/embed/jobs"
    })
  }

  $(".learn-get-started form").on("submit", function(event) {
    event.preventDefault();

    if ($(this).find("select").val() === "Choose an OS") {
      return;
    }

    window.location = $(this).find("option:selected").attr("data-instructions");
  });

  var $scheduleDemoModal = $("#schedule-demo-modal");
  $scheduleDemoModal.on("shown.bs.modal", function() {
    if (window.ga != null) {
      ga("send", "pageview", "/mountain-goats/modal");
    }
  });

  $("#schedule-demo-form").submit(function(event) {
    $scheduleDemoModal.modal("hide");

    if (window.ga != null) {
      ga("send", "pageview", "/mountain-goats/submit");
    }
  });

})();
