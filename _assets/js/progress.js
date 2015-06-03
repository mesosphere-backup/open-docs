(function() {

  if (window.location.pathname != "/tutorials/") { return; }

  var diameter = 80;
  var radius = diameter / 2;

  var arc = d3.svg.arc()
      .outerRadius(radius)
      .innerRadius(radius - 5);

  var pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return d; });

  var tutorialProgress = JSON.parse(
    localStorage.getItem("tutorialProgress")) || {};

  d3.selectAll(".learn-progress-dial").each(function() {
    var step = tutorialProgress[this.getAttribute("data-key")];
    if (step === "s") {
      step = parseInt(this.getAttribute("data-steps"), 10);
    } else {
      step = parseInt(step, 10) || 0;
    }

    var progress = (step / parseInt(this.getAttribute("data-steps"), 10)) * 100;
    var data = [ progress, 100 - progress ];

    var svg = d3.select(this).select(".dial")
      .append("svg")
      .attr({ "width": diameter, "height": diameter })
      .append("g")
      .attr("transform", "translate(" + radius + "," + radius + ")");

    var g = svg.selectAll()
        .data(pie(data))
      .enter().append("g")
        .classed("progress-state", function(d, i) { return i === 0; })
        .classed("progress-fill", function(d, i) { return i === 1; })
        .append("path")
        .attr("d", arc);

    d3.select(this)
      .classed("progress-none", progress === 0 )
      .classed("progress-active", progress > 0 && progress < 100 )
      .classed("progress-complete", progress === 100 )
      .select(".dial")
      .append("div")
      .classed("dial-text", true)
      .text(Math.floor(progress) + "%");
  });

})();

