d3.select("#chart1")
  .on("mousemove", function(event) {
    
    
    var tooltip = d3.select("#tooltip")
        .style("display", "block")
        .style("top", event.pageY + 10 + "px")
        .style("left", event.pageX + 10 + "px")

    tooltip.select("#name").html("Mexico")
    tooltip.select("#value").html("2.3B")

  })
  .on("mouseout", function() {
    d3.select("#tooltip")
      .style("display", "none");

  });