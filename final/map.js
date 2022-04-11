var width = 800;
var height = 600;

var svg = d3.select("#viz")
    .attr("width", width)
    .attr("height", height);

var map = svg.select("#map");

    d3.json("usa.json")
    .then(function(usa) {
            
    console.log(usa);

var geoJSON = topojson.feature(usa, usa.objects.states);
    geoJSON.features = geoJSON.features.filter(function(d) {
        return d.id !== "ATA";
    });
            
    console.log(geoJSON);

var proj = d3.geoAlbersUsa()
    .fitSize([width, height], geoJSON);
            
var path = d3.geoPath()
    .projection(proj);
            
var states = map.selectAll("path")
    .data(geoJSON.features);

    states.enter().append("path")
        .attr("d", path)
        .attr("fill", "#008080")
        .style("stroke", "#FFFFFF")
        .on('click', function(d){
            d3.select(this).classed("selected", true)
        })

//data           
d3.csv("/final/Zillow Rent.csv")
        .then(function(csvData){
        console.log(csvData)
    })

//circles
var dots = map.selectAll("circle")
                .data(csvData);

            dots.enter().append("circle")
                .attr("transform", function(d){
                return "translate(" + proj(d.coords) + ")";
            })
                .attr("r", 3.5)
                .style("fill", "white")
                .style("stroke", "black")

//zoom
var zoom = d3.zoom()
    .translateExtent([
        [0, 0], [width, height]
         ])
    .scaleExtent([1, 8])
    .on("zoom", zoomed);
            
    function zoomed (event) {
    map.attr("transform", event.transform);
    }

svg.call(zoom);

d3.select("#viz")
  .on("mousemove", function(event) {
    
    var tooltip = d3.select("#tooltip")
        .style("display", "block")
        .style("top", event.pageY + 10 + "px")
        .style("left", event.pageX + 10 + "px")

    tooltip.select("#city").html("Boston, MA")
    tooltip.select("#rent").html("2,700")

})

    .on("mouseout", function() {
    d3.select("#tooltip")
      .style("display", "none");

});


        
});