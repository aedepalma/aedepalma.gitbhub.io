var width = 800;
var height = 600;

var svg = d3.select("#viz")
    .attr("width", width)
    .attr("height", height);

var map = svg.select("#map");

d3.json("usa.json")
    .then(function (usa) {
        console.log(usa);

        d3.csv("/final/Zillow Rent.csv")
            .then(function (csvData) {

                //projection
                var geoJSON = topojson.feature(usa, usa.objects.states);
                geoJSON.features = geoJSON.features.filter(function (d) {
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
                    .attr("fill", "#666666")
                    .style("stroke", "#FFFFFF")



                //circles


                function drawCircles(year) {

                    var dots = map.selectAll("circle")
                        .data(csvData);

                    var dotEnter = dots.enter().append("circle")
                        .attr("class", "dots")
                        .attr("cx", 0)
                        .attr("cy", 0)
                        .attr("r", 0);


                    dots.merge(dotEnter)
                        .on("mousemove", function (event, d) {
                            console.log("tooltip data:", d);
                            var tooltip = d3.select("#tooltip")
                                .style("display", "block")
                                .style("top", event.pageY + 10 + "px")
                                .style("left", event.pageX + 10 + "px")
                                .html("City: " + d.city + "<br />Rent: $" + d[year + '-01'])
                        })
                        .on("mouseout", function () {
                            d3.select("#tooltip")
                                .style("display", "none");
                        })
                        .transition().duration(1000)
                        .attr("r", function (d) {
                            return d[year + '-01'] * 0.00825
                        })
                        .attr("cx", function (d) {
                            var coords = proj([d.long, d.lat])
                            return coords[0];
                        })
                        .attr("cy", function (d) {
                            var coords = proj([d.long, d.lat])
                            return coords[1];
                        })
                        .style("fill", function (d) {
                            if (d[year + '-01'] < 1600)
                                return "#84CBCB"
                            else if (d[year + '-01'] < 2300)
                                return "#008080"
                        });
                }

                d3.selectAll(".button").on("click", function () {
                    var buttonYear = d3.select(this).html();
                    console.log(buttonYear)
                    drawCircles(buttonYear);

                })

            })

        //zoom
        var zoom = d3.zoom()
            .translateExtent([
                [0, 0], [width, height]
            ])
            .scaleExtent([1, 8])
            .on("zoom", zoomed);

        function zoomed(event) {
            map.attr("transform", event.transform);
        }

        svg.call(zoom);




    })
