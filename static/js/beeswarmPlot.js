// let width = 1000,
//   height = 250,
//   radius = 5;
let swarm_margin = {top: 20, right: 50, bottom: 20, left: 10};

let width =
    d3
        .select("#swarm-wrapper")
        .node()
        .getBoundingClientRect().width -
    swarm_margin.right -
    swarm_margin.left,
    height = 200 - swarm_margin.top - swarm_margin.bottom,
    radius = 5;

let svg = d3
    .select("#swarm-wrapper")
    .append("svg")
    .attr("width", width + swarm_margin.left + swarm_margin.right)
    .attr("height", height + swarm_margin.top + swarm_margin.bottom);

let swarm_container = svg.attr(
    "transform",
    "translate(" + swarm_margin.left + ",0)"
);

function brushended() {
    if (!d3.event.sourceEvent) {
        // console.log("fuck1");
        return;
    } // Only transition after input.
    if (!d3.event.selection) {
        // add reset code
        d3.select("#music_dancebility").html("");
        d3.select("#music_energy").html("");
        d3.select("#music_acousticness").html("");

        d3.select("#music_speechiness").html("");
        d3.select("#music_loudness").html("");
        d3.select("#music_tempo").html("");

        d3.select("#music_liveness").html("");
        d3.select("#music_valence").html("");
        d3.select("#music_duration_ms").html("");

        drawMusicValenceHistogram();
        drawMusicTempoHistogram();
        drawMusicDurationHistogram();

        drawMusicDancebilityHistogram();
        drawMusicEnergyilityHistogram();
        drawMusicAcousticnessHistogram();

        // drawMusicInstrumentalnessHistogram();
        drawMusicSpeechinessHistogram();
        drawMusicLoudnessHistogram();
        drawMusicLivenessHistogram();

        d3.select("#table-content-billboard").html("");
        getMusicList_billboard();

        d3.select("#wordCloud-billboard").html("");
        drawWordCloud();
        return;
    } // Ignore empty selections.
    var d0 = d3.event.selection.map(x.invert),
        d1 = d0.map(d3.timeDay.round);
    //   // If empty when rounded, use floor & ceil instead.
    if (d1[0] >= d1[1]) {
        d1[0] = d3.timeDay.floor(d0[0]);
        d1[1] = d3.timeDay.offset(d1[0]);
    }

    startDate = d1[0].toISOString().split("T")[0];
    endDate = d1[1].toISOString().split("T")[0];

    d3.select("#music_dancebility").html("");
    d3.select("#music_energy").html("");
    d3.select("#music_acousticness").html("");

    d3.select("#music_speechiness").html("");
    d3.select("#music_loudness").html("");
    d3.select("#music_tempo").html("");

    d3.select("#music_liveness").html("");
    d3.select("#music_valence").html("");
    d3.select("#music_duration_ms").html("");

    drawMusicValenceHistogram(startDate, endDate);
    drawMusicTempoHistogram(startDate, endDate);
    drawMusicDurationHistogram(startDate, endDate);

    drawMusicDancebilityHistogram(startDate, endDate);
    drawMusicEnergyilityHistogram(startDate, endDate);
    drawMusicAcousticnessHistogram(startDate, endDate);

    // drawMusicInstrumentalnessHistogram();
    drawMusicSpeechinessHistogram(startDate, endDate);
    drawMusicLoudnessHistogram(startDate, endDate);
    drawMusicLivenessHistogram(startDate, endDate);

    d3.select("#table-content-billboard").html("");
    getMusicList_billboard(startDate, endDate);

    d3.select("#wordCloud-billboard").html("");
    drawWordCloud(startDate, endDate);
}

swarm_container
    .append("line", "svg")
    .classed("main_line", true)
    .attr("x1", swarm_margin.left)
    .attr("y1", (height * 2) / 3)
    .attr("x2", width)
    .attr("y2", (height * 2) / 3)
    .attr("stroke-width", 1.5)
    .attr("stroke", "#A3A0A6");

let x = d3.scaleTime().range([swarm_margin.left, width]);

let parseTime = d3.timeParse("%Y-%m-%d");

let data_set = "one";

$.ajax({
    url: "/getMusic",
    type: "GET",
    data: {
        state: "billboard",
        startDate: "1965",
        endDate: "2016"
    },
    success: function (data) {
        data = JSON.parse(data);

        data.forEach(function (d) {
            d.strDate = d.releaseDate;

            if (d.releaseDate.length == 4) {
                d.releaseDate = d.releaseDate + "-01-01";
            }
            d.releaseDate = parseTime(d.releaseDate);
            d.rank = +d.rank;
            return d;
        });

        x.domain(d3.extent(data, d => d.releaseDate));

        swarm_container
            .append("g")
            .attr("class", "brush")
            .call(
                d3
                    .brushX()
                    .extent([
                        [0, 0],
                        [width, height + swarm_margin.top + swarm_margin.bottom]
                    ])
                    .on("end", brushended)
            )
            .attr("transform", "translate(0," + swarm_margin.top + ")");

        function tick() {
            d3.selectAll(".circ")
                .attr("cx", function (d) {
                    //   console.log(d);
                    //   return x(d.x);
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                });
        }

        //let tooltips = d3.select("this").append("div")
         //   .attr("class", "tooltip")
           // .style("opacity", 0);

      let tooltip = d3.select("body")
          .append("div")
          .style("position", "absolute")
          .style("z-index", "10")
          .style("background", "white")
          .style("visibility", "hidden");

        let circles = swarm_container
            .selectAll(".circ")
            .data(data)
            .enter();
        circles
            .append("defs")
            .append("pattern")
            .attr("id", function (d) {
                return d.track + "-icon";
            }) // just create a unique id (id comes from the json)
            .attr("width", 1)
            .attr("height", 1)
            .attr("patternContentUnits", "objectBoundingBox")
            .append("svg:image")
            .attr("xlink:xlink:href", function (d) {
                return d.image_path;
            }) // "icon" is my image url. It comes from json too. The double xlink:xlink is a necessary hack (first "xlink:" is lost...).
            .attr("x", 0)
            .attr("y", 0)
            .attr("height", 1)
            .attr("width", 1)
            .attr("preserveAspectRatio", "xMinYMin slice");

        circles
            .append("circle")
            .attr("class", "circ")
            .attr("id", d => "circ-" + d.track)
            .attr("r", d => {
                let tempR = 10 / Math.log(d.rank + 1);

                if (tempR < 3) {
                    return 3;
                }

                return tempR;
            })
            .attr("cx", function (d) {
                return x(d.releaseDate);
            })
            .attr("cy", function () {
                return (height * 2) / 3;
            })
            .on("mousemove", function(d){return tooltip.text(d.releaseDate.getDate()+ "-"+ d.releaseDate.getMonth()+"-"+d.releaseDate.getFullYear()+ "  "+" '"+ d.track + "'")
            .style("visibility", "visible")
            .style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
            .on("mouseover", function (d) {

                let circ = d3
                    .select(this)
                    .style("stroke", "#56C6D8")
                    .style("stroke-width", 3);

                circ
                    .transition()
                    .duration(300)
                    .attr("r", d => {
                        let tempR = 10 / Math.log(d.rank + 1);

                        if (tempR <= 5) {
                            //   return 6;
                            d3.select(this)
                                .style("fill", "url(#" + d.track + "-icon)")
                                .style("fill-opacity", "1");
                            // return "url(#" + d.track + "-icon)";
                        }

                        // return tempR * 2;
                        return 20;
                    });

                // console.log(d);

                // give a highlight on histogram
                // 1. valence
                d3.selectAll(".valence_bin17").each(function (d2) {
                    if (d.valence >= d2.x0 && d.valence < d2.x1) {
                        d3.select(this).style("fill", "red");
                    }
                });
                // 2. tempo
                d3.selectAll(".tempo_bin1").each(function (d2) {
                    if (d.tempo >= d2.x0 && d.tempo < d2.x1) {
                        d3.select(this).style("fill", "red");
                    }
                });

                // 3. duration
                d3.selectAll(".duration_bin19").each(function (d2) {
                    if (d.duration_ms >= d2.x0 && d.duration_ms < d2.x1) {
                        d3.select(this).style("fill", "red");
                    }
                });
                //4. dancability
                d3.selectAll(".dancebility_bin7").each(function (d2) {
                    if (d.dancebility >= d2.x0 && d.dancebility < d2.x1) {
                        d3.select(this).style("fill", "red");
                    }
                });
                //5. energy
                d3.selectAll(".energy_bin1").each(function (d2) {
                    if (d.energy >= d2.x0 && d.energy < d2.x1) {
                        d3.select(this).style("fill", "red");
                    }
                });
                //6. acousticness
                d3.selectAll(".acousticness_bin5").each(function (d2) {
                    if (d.acousticness >= d2.x0 && d.acousticness < d2.x1) {
                        d3.select(this).style("fill", "red");
                    }
                });
                //7. speechness
                d3.selectAll(".speechiness_bin9").each(function (d2) {
                    if (d.speechiness >= d2.x0 && d.speechiness < d2.x1) {
                        d3.select(this).style("fill", "red");
                    }
                });
                //8. loudness
                d3.selectAll(".loudness_bin11").each(function (d2) {
                    if (d.loudness >= d2.x0 && d.loudness < d2.x1) {
                        d3.select(this).style("fill", "red");
                    }
                });
                //9. liveness
                d3.selectAll(".liveness_bin15").each(function (d2) {
                    if (d.liveness >= d2.x0 && d.liveness < d2.x1) {
                        d3.select(this).style("fill", "red");
                    }
                });

             // tooltips.transition()
               //   .duration(2000)
                //.style("opacity", .9);
              //tooltips.html(d.releaseDate + "<br/>"  + d.track)
                //  .style("left", (d3.event.pageX) + "px")
                  //.style("top", (d3.event.pageY - 28) + "px");

              //tooltip.style("visibility", "visible") ;
              //console.log(d.releaseDate + "<br/>"  + d.track);
            })
            .on("mouseout", function (d) {
                tooltip.style("visibility", "hidden") ;

                let circ = d3
                    .select(this)
                    .style("stroke", "black")
                    .style("stroke-width", 1);

                circ
                    .transition()
                    .duration(300)
                    .attr("r", d => {
                        let tempR = 10 / Math.log(d.rank + 1);

                        if (tempR <= 5) {
                            d3.select(this)
                                .style("fill", "")
                                .style("fill-opacity", "0.5");
                        }

                        return tempR;
                    });

                // remove a highlight on histogram
                // 1. valence
                d3.selectAll(".valence_bin17").each(function (d2) {
                    if (d.valence >= d2.x0 && d.valence < d2.x1) {
                        d3.select(this).style("fill", "blue");
                    }
                });
                // 2. tempo
                d3.selectAll(".tempo_bin1").each(function (d2) {
                    if (d.tempo >= d2.x0 && d.tempo < d2.x1) {
                        d3.select(this).style("fill", "blue");
                    }
                });

                // 3. duration
                d3.selectAll(".duration_bin19").each(function (d2) {
                    if (d.duration_ms >= d2.x0 && d.duration_ms < d2.x1) {
                        d3.select(this).style("fill", "blue");
                    }
                });
                //4. dancability
                d3.selectAll(".dancebility_bin7").each(function (d2) {
                    if (d.dancebility >= d2.x0 && d.dancebility < d2.x1) {
                        d3.select(this).style("fill", "blue");
                    }
                });
                //5. energy
                d3.selectAll(".energy_bin1").each(function (d2) {
                    if (d.energy >= d2.x0 && d.energy < d2.x1) {
                        d3.select(this).style("fill", "blue");
                    }
                });
                //6. acousticness
                d3.selectAll(".acousticness_bin5").each(function (d2) {
                    if (d.acousticness >= d2.x0 && d.acousticness < d2.x1) {
                        d3.select(this).style("fill", "blue");
                    }
                });
                //7. speechness
                d3.selectAll(".speechiness_bin9").each(function (d2) {
                    if (d.speechiness >= d2.x0 && d.speechiness < d2.x1) {
                        d3.select(this).style("fill", "blue");
                    }
                });
                //8. loudness
                d3.selectAll(".loudness_bin11").each(function (d2) {
                    if (d.loudness >= d2.x0 && d.loudness < d2.x1) {
                        d3.select(this).style("fill", "blue");
                    }
                });
                //9. liveness
                d3.selectAll(".liveness_bin15").each(function (d2) {
                    if (d.liveness >= d2.x0 && d.liveness < d2.x1) {
                        d3.select(this).style("fill", "blue");
                    }
                });
            })
            .style("fill", d => {
                let tempR = 10 / Math.log(d.rank + 1);

                if (tempR < 4) {
                    return;
                }

                return "url(#" + d.track + "-icon)";
            })
            .style("fill-opacity", d => {
                let tempR = 10 / Math.log(d.rank + 1);
                if (tempR < 4) {
                    return 0.4;
                }
                return 1;
            });

        let simulation = d3
            .forceSimulation(data)
            .force(
                "x",
                d3
                    .forceX(function (d) {
                        return x(d.releaseDate);
                    })
                    .strength(2)
            )
            .force("y", d3.forceY((height * 2) / 3).strength(0.3))
            .force(
                "collide",
                d3.forceCollide(d => {
                    let tempR = 10 / Math.log(d.rank + 1);
                    if (tempR < 4) {
                        return 4;
                    }
                    return tempR;
                })
            )
            //   .stop();
            // //   .alphaDecay(0)
            // //   .alpha(0.12)
            .on("tick", tick);
    },
    error: function () {
        alert("error: beeswarm");
    }
});
