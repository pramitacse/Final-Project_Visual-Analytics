let histo_margin = { top: 20, right: 10, bottom: 20, left: 20 },
  histo_width =
    +d3
      .select("#multi-histogram")
      .node()
      .getBoundingClientRect().width /
      3 -
    histo_margin.left -
    histo_margin.right,
  histo_height = 150 - histo_margin.top - histo_margin.bottom;

let histo_opacity = 0.2;
let y_max_domain = 70;
let filteredMusicCollection = new Map();

function giveHighlight(trackID) {
  let tempR = +d3.select("#circ-" + trackID).attr("r");

  d3.select("#circ-" + trackID)
    .style("stroke", "#56C6D8")
    .style("stroke-width", 3)
    // .transition()
    // .duration(300)
    .attr("r", function() {
      if (tempR >= 17) {
        return tempR + 2;
      }

      return 17;
    });
}

function removeHighlight(trackID) {
  let currR = +d3.select("#circ-" + trackID).attr("r");
  d3.select("#circ-" + trackID)
    .style("stroke", "black")
    .style("stroke-width", 1)
    // .transition()
    // .duration(300)
    .attr("r", d => {
      let tempR = 10 / Math.log(d.rank + 1);

      if (currR >= 19) {
        return currR - 2;
      }

      return tempR;
    });
}

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

/////************************ music_dancebility   ************************///////
function drawMusicDancebilityHistogram(startDate = "1965", endDate = "2016") {
  let dance_svg = d3
    .select("#music_dancebility")
    .append("svg")
    .attr("width", histo_width + histo_margin.left + histo_margin.right)
    .attr("height", histo_height + histo_margin.top + histo_margin.bottom)
    .append("g")
    .attr(
      "transform",
      "translate(" + histo_margin.left + "," + histo_margin.top + ")"
    );

  dance_svg
    .append("text")
    .attr(
      "transform",
      "translate(" + (histo_width / 2 - histo_margin.left) + ",0)"
    )
    .text("Dancebility");

  $.ajax({
    url: "/getFeatureData",
    type: "GET",
    data: {
      feature: "dancebility",
      startDate: startDate,
      endDate: endDate
      // "dancebility" indicate the danceability
    },
    success: function(data) {
      data = JSON.parse(data)[0];

      top50_feature = data["top50"];
      billboard_feature = data["billboard"];

      top50_feature.forEach(d => {
        d.dancebility = +d.dancebility;
      });

      billboard_feature.forEach(d => {
        d.dancebility = +d.dancebility;
      });

      let x = d3.scaleLinear().range([0, histo_width]);

      x.domain([
        Math.min(
          d3.min(top50_feature, d => d.dancebility),
          d3.min(billboard_feature, d => d.dancebility)
        ),
        Math.max(
          d3.max(top50_feature, d => d.dancebility),
          d3.max(billboard_feature, d => d.dancebility)
        )
      ]);

      dance_svg
        .append("g")
        .attr("transform", "translate(0," + histo_height + ")")
        .call(d3.axisBottom(x));

      let histogram = d3
        .histogram()
        .value(function(d) {
          return d.dancebility;
        }) // I need to give the vector of value
        .domain(x.domain()) // then the domain of the graphic
        .thresholds(x.ticks(20)); // then the numbers of bins
      // And apply this function to data to get the bins

      let bins7 = histogram(billboard_feature);
      let bins8 = histogram(top50_feature);

      let y = d3.scaleLinear().range([histo_height, 0]);

      let y_max_domain =
        d3.max(bins7, function(d) {
          return d.length;
        }) > 100
          ? 100
          : d3.max(bins7, function(d) {
              return d.length;
            });

      y.domain([
        0,
        y_max_domain
        //   d3.max(bins1, function(d) {
        //     return d.length;
        //   })
      ]); // d3.hist has to be called before the Y axis obviously

      dance_svg.append("g").call(d3.axisLeft(y));

      // // append the bar rectangles to the svg element

      dance_svg
        .selectAll(".dancebility_bin8")
        .data(bins8)
        .enter()
        .append("rect")
        .attr("class", "dancebility_bin8")
        .attr("x", 1)
        .attr("transform", function(d) {
          return "translate(" + x(d.x0) + "," + y(d.length) + ")";
        })
        .attr("width", function(d) {
          return x(d.x1) - x(d.x0) - 1;
        })
        .attr("height", function(d) {
          return histo_height - y(d.length);
        })
        .style("fill", "green")
        .style("opacity", 0.6);

      dance_svg
        .selectAll(".dancebility_bin7")
        .data(bins7)
        .enter()
        .append("rect")
        .attr("class", "dancebility_bin7")
        .attr("x", 1)
        .attr("transform", function(d) {
          return "translate(" + x(d.x0) + "," + y(d.length) + ")";
        })
        .attr("width", function(d) {
          return x(d.x1) - x(d.x0) - 1;
        })
        .attr("height", function(d) {
          return histo_height - y(d.length);
        })
        .style("fill", "blue")
        .style("opacity", histo_opacity)
        .on("mouseover", function(d) {
          d3.select(this).style("fill", "red");

          let isClick = d3.select(this).attr("isClick");
          if (isClick == "true") return;

          for (let track of d) {
            giveHighlight(track["track"]);
          }
        })
        .on("mouseleave", function(d) {
          let isClick = d3.select(this).attr("isClick");
          if (isClick == "true") return;

          d3.select(this).style("fill", "blue");
          for (let track of d) {
            removeHighlight(track["track"]);
          }
        })
        .attr("isClick", false)
        .on("click", function(d) {
          let isClick = d3.select(this).attr("isClick");

          if (isClick == "false") {
            d3.select(this).attr("isClick", "true");
            d3.select(this).style("fill", "red");
            // console.log(d3.select(this).attr("isClick"));
            isOneHistoClicked = true;

            if (filteredMusicCollection.has("dancebility")) {
              tempList = filteredMusicCollection.get("dancebility");
            } else {
              tempList = [];
            }

            for (let track of d) {
              let trackName = track["track"].split("_");
              trackName = trackName.join(" ");
              trackName = capitalize(trackName);

              tempList.push(trackName);
              giveHighlight(track["track"]);
            }

            filteredMusicCollection.set("dancebility", tempList);
            filterMusic_billboard(filteredMusicCollection);
          } else {
            d3.select(this).attr("isClick", "false");
            d3.select(this).style("fill", "blue");

            let trackList = filteredMusicCollection.get("dancebility");
            let temp = [];

            for (let track of d) {
              let trackName = track["track"].split("_");
              trackName = trackName.join(" ");
              trackName = capitalize(trackName);
              //   console.log(trackName);
              //   console.log(trackList);
              //   console.log(trackList.includes(trackName));

              if (trackList.includes(trackName)) {
                trackList = trackList.filter(function(e) {
                  return e !== trackName;
                });
              }

              removeHighlight(track["track"]);
            }

            if (trackList.length == 0) {
              filteredMusicCollection.delete("dancebility");
            } else {
              filteredMusicCollection.set("dancebility", trackList);
            }
            //
            filterMusic_billboard(filteredMusicCollection);
          }
        });
    },
    error: function(err) {
      alert("error: music dancebility");
    }
  });
}

// /////************************ music_energy   ************************///////
function drawMusicEnergyilityHistogram(startDate = "1965", endDate = "2016") {
  let energy_svg = d3
    .select("#music_energy")
    .append("svg")
    .attr("width", histo_width + histo_margin.left + histo_margin.right)
    .attr("height", histo_height + histo_margin.top + histo_margin.bottom)
    .append("g")
    .attr(
      "transform",
      "translate(" + histo_margin.left + "," + histo_margin.top + ")"
    );

  energy_svg
    .append("text")
    .attr(
      "transform",
      "translate(" + (histo_width / 2 - histo_margin.left) + ",0)"
    )
    .text("Energy");
  $.ajax({
    url: "/getFeatureData",
    type: "GET",
    data: {
      feature: "energy",
      startDate: startDate,
      endDate: endDate
      // "energy " indicate the energy of the music
    },
    success: function(data) {
      data = JSON.parse(data)[0];

      top50_feature = data["top50"];
      billboard_feature = data["billboard"];

      top50_feature.forEach(d => {
        d.energy = +d.energy;
      });

      billboard_feature.forEach(d => {
        d.energy = +d.energy;
      });

      let x = d3.scaleLinear().range([0, histo_width]);

      x.domain([
        Math.min(
          d3.min(top50_feature, d => d.energy),
          d3.min(billboard_feature, d => d.energy)
        ),
        Math.max(
          d3.max(top50_feature, d => d.energy),
          d3.max(billboard_feature, d => d.energy)
        )
      ]);

      energy_svg
        .append("g")
        .attr("transform", "translate(0," + histo_height + ")")
        .call(d3.axisBottom(x));

      let histogram = d3
        .histogram()
        .value(function(d) {
          return d.energy;
        }) // I need to give the vector of value
        .domain(x.domain()) // then the domain of the graphic
        .thresholds(x.ticks(20)); // then the numbers of bins
      // And apply this function to data to get the bins

      let bins1 = histogram(billboard_feature);
      let bins2 = histogram(top50_feature);

      let y_max_domain =
        d3.max(bins1, function(d) {
          return d.length;
        }) > 100
          ? 100
          : d3.max(bins1, function(d) {
              return d.length;
            });

      let y = d3.scaleLinear().range([histo_height, 0]);
      y.domain([0, y_max_domain]); // d3.hist has to be called before the Y axis obviously

      energy_svg.append("g").call(d3.axisLeft(y));

      // // append the bar rectangles to the svg element

      energy_svg
        .selectAll(".energy_bin2")
        .data(bins2)
        .enter()
        .append("rect")
        .attr("class", "energy_bin2")
        .attr("x", 1)
        .attr("transform", function(d) {
          return "translate(" + x(d.x0) + "," + y(d.length) + ")";
        })
        .attr("width", function(d) {
          return x(d.x1) - x(d.x0) - 1;
        })
        .attr("height", function(d) {
          return histo_height - y(d.length);
        })
        .style("fill", "green")
        .style("opacity", 0.6);

      energy_svg
        .selectAll(".energy_bin1")
        .data(bins1)
        .enter()
        .append("rect")
        .attr("class", "energy_bin1")
        .attr("x", 1)
        .attr("transform", function(d) {
          return "translate(" + x(d.x0) + "," + y(d.length) + ")";
        })
        .attr("width", function(d) {
          return x(d.x1) - x(d.x0) - 1;
        })
        .attr("height", function(d) {
          return histo_height - y(d.length);
        })
        .style("fill", "blue")
        .style("opacity", histo_opacity)
        .on("mouseover", function(d) {
          d3.select(this).style("fill", "red");

          let isClick = d3.select(this).attr("isClick");
          if (isClick == "true") return;

          for (let track of d) {
            giveHighlight(track["track"]);
          }
        })
        .on("mouseleave", function(d) {
          let isClick = d3.select(this).attr("isClick");
          if (isClick == "true") return;

          d3.select(this).style("fill", "blue");
          for (let track of d) {
            removeHighlight(track["track"]);
          }
        })
        .attr("isClick", false)
        .on("click", function(d) {
          let isClick = d3.select(this).attr("isClick");

          if (isClick == "false") {
            d3.select(this).attr("isClick", "true");
            d3.select(this).style("fill", "red");
            isOneHistoClicked = true;

            if (filteredMusicCollection.has("energy")) {
              tempList = filteredMusicCollection.get("energy");
            } else {
              tempList = [];
            }

            for (let track of d) {
              let trackName = track["track"].split("_");
              trackName = trackName.join(" ");
              trackName = capitalize(trackName);

              tempList.push(trackName);
              giveHighlight(track["track"]);
            }

            filteredMusicCollection.set("energy", tempList);
            filterMusic_billboard(filteredMusicCollection);
          } else {
            d3.select(this).attr("isClick", "false");
            d3.select(this).style("fill", "blue");

            let trackList = filteredMusicCollection.get("energy");
            // console.log(trackList);
            let temp = [];

            for (let track of d) {
              let trackName = track["track"].split("_");
              trackName = trackName.join(" ");
              trackName = capitalize(trackName);

              if (trackList.includes(trackName)) {
                trackList = trackList.filter(function(e) {
                  return e !== trackName;
                });
              }

              removeHighlight(track["track"]);
            }
            if (trackList.length == 0) {
              filteredMusicCollection.delete("energy");
            } else {
              filteredMusicCollection.set("energy", trackList);
            }
            //
            filterMusic_billboard(filteredMusicCollection);
          }
        });
    },
    error: function(err) {
      alert("error: music energy");
    }
  });
}

// ////************************ music_acousticness   ************************//////
function drawMusicAcousticnessHistogram(startDate = "1965", endDate = "2016") {
  let acous_svg = d3
    .select("#music_acousticness")
    .append("svg")
    .attr("width", histo_width + histo_margin.left + histo_margin.right)
    .attr("height", histo_height + histo_margin.top + histo_margin.bottom)
    .append("g")
    .attr(
      "transform",
      "translate(" + histo_margin.left + "," + histo_margin.top + ")"
    );

  acous_svg
    .append("text")
    .attr(
      "transform",
      "translate(" + (histo_width / 2 - histo_margin.left) + ",0)"
    )
    .text("Acousticness");
  $.ajax({
    url: "/getFeatureData",
    type: "GET",
    data: {
      feature: "acousticness",
      startDate: startDate,
      endDate: endDate
      // "acousticness" indicate the acousticness
    },
    success: function(data) {
      data = JSON.parse(data)[0];

      top50_feature = data["top50"];
      billboard_feature = data["billboard"];

      top50_feature.forEach(d => {
        d.acousticness = +d.acousticness;
      });

      billboard_feature.forEach(d => {
        d.acousticness = +d.acousticness;
      });

      let x = d3.scaleLinear().range([0, histo_width]);

      x.domain([
        Math.min(
          d3.min(top50_feature, d => d.acousticness),
          d3.min(billboard_feature, d => d.acousticness)
        ),
        Math.max(
          d3.max(top50_feature, d => d.acousticness),
          d3.max(billboard_feature, d => d.acousticness)
        )
      ]);

      acous_svg
        .append("g")
        .attr("transform", "translate(0," + histo_height + ")")
        .call(d3.axisBottom(x));

      let histogram = d3
        .histogram()
        .value(function(d) {
          return d.acousticness;
        }) // I need to give the vector of value
        .domain(x.domain()) // then the domain of the graphic
        .thresholds(x.ticks(20)); // then the numbers of bins
      // And apply this function to data to get the bins

      let bins5 = histogram(billboard_feature);
      let bins6 = histogram(top50_feature);

      let y_max_domain =
        d3.max(bins5, function(d) {
          return d.length;
        }) > 100
          ? 100
          : d3.max(bins5, function(d) {
              return d.length;
            });

      let y = d3.scaleLinear().range([histo_height, 0]);
      y.domain([0, y_max_domain]); // d3.hist has to be called before the Y axis obviously

      acous_svg.append("g").call(d3.axisLeft(y));

      // // append the bar rectangles to the svg element

      acous_svg
        .selectAll(".acousticness_bin6")
        .data(bins6)
        .enter()
        .append("rect")
        .attr("class", "acousticness_bin6")
        .attr("x", 1)
        .attr("transform", function(d) {
          return "translate(" + x(d.x0) + "," + y(d.length) + ")";
        })
        .attr("width", function(d) {
          return x(d.x1) - x(d.x0) - 1;
        })
        .attr("height", function(d) {
          return histo_height - y(d.length);
        })
        .style("fill", "green")
        .style("opacity", 0.6);

      acous_svg
        .selectAll(".acousticness_bin5")
        .data(bins5)
        .enter()
        .append("rect")
        .attr("class", "acousticness_bin5")
        .attr("x", 1)
        .attr("transform", function(d) {
          return "translate(" + x(d.x0) + "," + y(d.length) + ")";
        })
        .attr("width", function(d) {
          return x(d.x1) - x(d.x0) - 1;
        })
        .attr("height", function(d) {
          return histo_height - y(d.length);
        })
        .style("fill", "blue")
        .style("opacity", histo_opacity)
        .on("mouseover", function(d) {
          d3.select(this).style("fill", "red");

          let isClick = d3.select(this).attr("isClick");
          if (isClick == "true") return;

          for (let track of d) {
            giveHighlight(track["track"]);
          }
        })
        .on("mouseleave", function(d) {
          let isClick = d3.select(this).attr("isClick");
          if (isClick == "true") return;

          d3.select(this).style("fill", "blue");
          for (let track of d) {
            removeHighlight(track["track"]);
          }
        })
        .attr("isClick", false)
        .on("click", function(d) {
          let isClick = d3.select(this).attr("isClick");

          if (isClick == "false") {
            d3.select(this).attr("isClick", "true");
            d3.select(this).style("fill", "red");
            isOneHistoClicked = true;

            if (filteredMusicCollection.has("acousticness")) {
              tempList = filteredMusicCollection.get("acousticness");
            } else {
              tempList = [];
            }

            for (let track of d) {
              let trackName = track["track"].split("_");
              trackName = trackName.join(" ");
              trackName = capitalize(trackName);

              tempList.push(trackName);
              giveHighlight(track["track"]);
            }

            filteredMusicCollection.set("acousticness", tempList);
            filterMusic_billboard(filteredMusicCollection);
          } else {
            d3.select(this).attr("isClick", "false");
            d3.select(this).style("fill", "blue");

            let trackList = filteredMusicCollection.get("acousticness");
            let temp = [];

            for (let track of d) {
              let trackName = track["track"].split("_");
              trackName = trackName.join(" ");
              trackName = capitalize(trackName);
              //   console.log(trackName);
              //   console.log(trackList);
              //   console.log(trackList.includes(trackName));

              if (trackList.includes(trackName)) {
                trackList = trackList.filter(function(e) {
                  return e !== trackName;
                });
              }

              removeHighlight(track["track"]);
            }
            if (trackList.length == 0) {
              filteredMusicCollection.delete("acousticness");
            } else {
              filteredMusicCollection.set("acousticness", trackList);
            }
            //
            filterMusic_billboard(filteredMusicCollection);
          }
        });
    },
    error: function(err) {
      alert("error: music acousticness");
    }
  });
}

// ///************************    music_speechiness    ************************//////
function drawMusicSpeechinessHistogram(startDate = "1965", endDate = "2016") {
  let speechi_svg = d3
    .select("#music_speechiness")
    .append("svg")
    .attr("width", histo_width + histo_margin.left + histo_margin.right)
    .attr("height", histo_height + histo_margin.top + histo_margin.bottom)
    .append("g")
    .attr(
      "transform",
      "translate(" + histo_margin.left + "," + histo_margin.top + ")"
    );

  speechi_svg
    .append("text")
    .attr(
      "transform",
      "translate(" + (histo_width / 2 - histo_margin.left) + ",0)"
    )
    .text("Speechiness");

  $.ajax({
    url: "/getFeatureData",
    type: "GET",
    data: {
      feature: "speechiness",
      startDate: startDate,
      endDate: endDate
      // "speechiness" indicate the speechiness
    },
    success: function(data) {
      data = JSON.parse(data)[0];

      top50_feature = data["top50"];
      billboard_feature = data["billboard"];

      top50_feature.forEach(d => {
        d.speechiness = +d.speechiness;
      });

      billboard_feature.forEach(d => {
        d.speechiness = +d.speechiness;
      });

      let x = d3.scaleLinear().range([0, histo_width]);

      x.domain([
        Math.min(
          d3.min(top50_feature, d => d.speechiness),
          d3.min(billboard_feature, d => d.speechiness)
        ),
        Math.max(
          d3.max(top50_feature, d => d.speechiness),
          d3.max(billboard_feature, d => d.speechiness)
        )
      ]);

      speechi_svg
        .append("g")
        .attr("transform", "translate(0," + histo_height + ")")
        .call(d3.axisBottom(x));

      let histogram = d3
        .histogram()
        .value(function(d) {
          return d.speechiness;
        }) // I need to give the vector of value
        .domain(x.domain()) // then the domain of the graphic
        .thresholds(x.ticks(20)); // then the numbers of bins
      // And apply this function to data to get the bins

      let bins9 = histogram(billboard_feature);
      let bins10 = histogram(top50_feature);

      let y_max_domain =
        d3.max(bins9, function(d) {
          return d.length;
        }) > 100
          ? 100
          : d3.max(bins9, function(d) {
              return d.length;
            });

      let y = d3.scaleLinear().range([histo_height, 0]);
      y.domain([0, y_max_domain]); // d3.hist has to be called before the Y axis obviously

      speechi_svg.append("g").call(d3.axisLeft(y));

      // // append the bar rectangles to the svg element

      speechi_svg
        .selectAll(".speechiness_bin10")
        .data(bins10)
        .enter()
        .append("rect")
        .attr("class", "speechiness_bin10")
        .attr("x", 1)
        .attr("transform", function(d) {
          return "translate(" + x(d.x0) + "," + y(d.length) + ")";
        })
        .attr("width", function(d) {
          return x(d.x1) - x(d.x0) - 1;
        })
        .attr("height", function(d) {
          return histo_height - y(d.length);
        })
        .style("fill", "green")
        .style("opacity", 0.6);

      speechi_svg
        .selectAll(".speechiness_bin9")
        .data(bins9)
        .enter()
        .append("rect")
        .attr("class", "speechiness_bin9")
        .attr("x", 1)
        .attr("transform", function(d) {
          return "translate(" + x(d.x0) + "," + y(d.length) + ")";
        })
        .attr("width", function(d) {
          return x(d.x1) - x(d.x0) - 1;
        })
        .attr("height", function(d) {
          return histo_height - y(d.length);
        })
        .style("fill", "blue")
        .style("opacity", histo_opacity)
        .on("mouseover", function(d) {
          d3.select(this).style("fill", "red");
          let isClick = d3.select(this).attr("isClick");

          if (isClick == "true") return;
          for (let track of d) {
            giveHighlight(track["track"]);
          }
        })
        .on("mouseleave", function(d) {
          let isClick = d3.select(this).attr("isClick");
          if (isClick == "true") return;

          d3.select(this).style("fill", "blue");
          for (let track of d) {
            removeHighlight(track["track"]);
          }
        })
        .attr("isClick", false)
        .on("click", function(d) {
          let isClick = d3.select(this).attr("isClick");

          if (isClick == "false") {
            d3.select(this).attr("isClick", "true");
            d3.select(this).style("fill", "red");
            isOneHistoClicked = true;

            if (filteredMusicCollection.has("speechiness")) {
              tempList = filteredMusicCollection.get("speechiness");
            } else {
              tempList = [];
            }

            for (let track of d) {
              let trackName = track["track"].split("_");
              trackName = trackName.join(" ");
              trackName = capitalize(trackName);

              tempList.push(trackName);
              giveHighlight(track["track"]);
            }
            filteredMusicCollection.set("speechiness", tempList);
            filterMusic_billboard(filteredMusicCollection);
          } else {
            d3.select(this).attr("isClick", "false");
            d3.select(this).style("fill", "blue");

            let trackList = filteredMusicCollection.get("speechiness");
            let temp = [];

            for (let track of d) {
              let trackName = track["track"].split("_");
              trackName = trackName.join(" ");
              trackName = capitalize(trackName);
              //   console.log(trackName);
              //   console.log(trackList);
              //   console.log(trackList.includes(trackName));

              if (trackList.includes(trackName)) {
                trackList = trackList.filter(function(e) {
                  return e !== trackName;
                });
              }

              removeHighlight(track["track"]);
            }
            if (trackList.length == 0) {
              filteredMusicCollection.delete("speechiness");
            } else {
              filteredMusicCollection.set("speechiness", trackList);
            }
            //
            filterMusic_billboard(filteredMusicCollection);
          }
        });
    },
    error: function(err) {
      alert("error: music speechiness");
    }
  });
}
// //////************************   music_loudness   ************************///////
function drawMusicLoudnessHistogram(startDate = "1965", endDate = "2016") {
  let loud_svg = d3
    .select("#music_loudness")
    .append("svg")
    .attr("width", histo_width + histo_margin.left + histo_margin.right)
    .attr("height", histo_height + histo_margin.top + histo_margin.bottom)
    .append("g")
    .attr(
      "transform",
      "translate(" + histo_margin.left + "," + histo_margin.top + ")"
    );
  loud_svg
    .append("text")
    .attr(
      "transform",
      "translate(" + (histo_width / 2 - histo_margin.left) + ",0)"
    )
    .text("Loudness");

  $.ajax({
    url: "getFeatureData",
    type: "GET",
    data: {
      feature: "loudness",
      startDate: startDate,
      endDate: endDate
      // / "loudness" indicate the loudness
    },
    success: function(data) {
      data = JSON.parse(data)[0];

      top50_feature = data["top50"];
      billboard_feature = data["billboard"];

      top50_feature.forEach(d => {
        d.loudness = +d.loudness;
      });

      billboard_feature.forEach(d => {
        d.loudness = +d.loudness;
      });

      let x = d3.scaleLinear().range([0, histo_width]);

      x.domain([
        Math.min(
          d3.min(top50_feature, d => d.loudness),
          d3.min(billboard_feature, d => d.loudness)
        ),
        Math.max(
          d3.max(top50_feature, d => d.loudness),
          d3.max(billboard_feature, d => d.loudness)
        )
      ]);

      loud_svg
        .append("g")
        .attr("transform", "translate(0," + histo_height + ")")
        .call(d3.axisBottom(x));

      let histogram = d3
        .histogram()
        .value(function(d) {
          return d.loudness;
        }) // I need to give the vector of value
        .domain(x.domain()) // then the domain of the graphic
        .thresholds(x.ticks(20)); // then the numbers of bins
      // And apply this function to data to get the bins

      let bins11 = histogram(billboard_feature);
      let bins12 = histogram(top50_feature);

      let y_max_domain =
        d3.max(bins11, function(d) {
          return d.length;
        }) > 100
          ? 100
          : d3.max(bins11, function(d) {
              return d.length;
            });

      let y = d3.scaleLinear().range([histo_height, 0]);
      y.domain([0, y_max_domain]); // d3.hist has to be called before the Y axis obviously

      loud_svg.append("g").call(d3.axisLeft(y));

      // // append the bar rectangles to the svg element

      loud_svg
        .selectAll(".loudness_bin12")
        .data(bins12)
        .enter()
        .append("rect")
        .attr("class", "loudness_bin12")
        .attr("x", 1)
        .attr("transform", function(d) {
          return "translate(" + x(d.x0) + "," + y(d.length) + ")";
        })
        .attr("width", function(d) {
          return x(d.x1) - x(d.x0) - 1;
        })
        .attr("height", function(d) {
          return histo_height - y(d.length);
        })
        .style("fill", "green")
        .style("opacity", 0.6);

      loud_svg
        .selectAll(".loudness_bin11")
        .data(bins11)
        .enter()
        .append("rect")
        .attr("class", "loudness_bin11")
        .attr("x", 1)
        .attr("transform", function(d) {
          return "translate(" + x(d.x0) + "," + y(d.length) + ")";
        })
        .attr("width", function(d) {
          return x(d.x1) - x(d.x0) - 1;
        })
        .attr("height", function(d) {
          return histo_height - y(d.length);
        })
        .style("fill", "blue")
        .style("opacity", histo_opacity)
        .on("mouseover", function(d) {
          d3.select(this).style("fill", "red");

          let isClick = d3.select(this).attr("isClick");
          if (isClick == "true") return;

          for (let track of d) {
            giveHighlight(track["track"]);
          }
        })
        .on("mouseleave", function(d) {
          let isClick = d3.select(this).attr("isClick");
          if (isClick == "true") return;

          d3.select(this).style("fill", "blue");
          for (let track of d) {
            removeHighlight(track["track"]);
          }
        })
        .attr("isClick", false)
        .on("click", function(d) {
          let isClick = d3.select(this).attr("isClick");

          if (isClick == "false") {
            d3.select(this).attr("isClick", "true");
            d3.select(this).style("fill", "red");
            isOneHistoClicked = true;

            if (filteredMusicCollection.has("loudness")) {
              tempList = filteredMusicCollection.get("loudness");
            } else {
              tempList = [];
            }

            for (let track of d) {
              let trackName = track["track"].split("_");
              trackName = trackName.join(" ");
              trackName = capitalize(trackName);

              tempList.push(trackName);
              giveHighlight(track["track"]);
            }

            filteredMusicCollection.set("loudness", tempList);
            filterMusic_billboard(filteredMusicCollection);
          } else {
            d3.select(this).attr("isClick", "false");
            d3.select(this).style("fill", "blue");

            let trackList = filteredMusicCollection.get("loudness");
            let temp = [];

            for (let track of d) {
              let trackName = track["track"].split("_");
              trackName = trackName.join(" ");
              trackName = capitalize(trackName);
              //   console.log(trackName);
              //   console.log(trackList);
              //   console.log(trackList.includes(trackName));

              if (trackList.includes(trackName)) {
                trackList = trackList.filter(function(e) {
                  return e !== trackName;
                });
              }

              removeHighlight(track["track"]);
            }

            if (trackList.length == 0) {
              filteredMusicCollection.delete("loudness");
            } else {
              filteredMusicCollection.set("loudness", trackList);
            }
            //
            filterMusic_billboard(filteredMusicCollection);
          }
        });
    },
    error: function(err) {
      alert("error: music loudness");
    }
  });
}
// ////************************   music_instrumentalness   ************************//////
// function drawMusicInstrumentalnessHistogram(
//   startDate = "1965",
//   endDate = "2016"
// ) {
//   let instu_svg = d3
//     .select("#music_instrumentalness")
//     .append("svg")
//     .attr("width", histo_width + histo_margin.left + histo_margin.right)
//     .attr("height", histo_height + histo_margin.top + histo_margin.bottom)
//     .append("g")
//     .attr(
//       "transform",
//       "translate(" + histo_margin.left + "," + histo_margin.top + ")"
//     );

//   $.ajax({
//     url: "/getFeatureData",
//     type: "GET",
//     data: {
//       feature: "instrumentalness",
//       startDate: startDate,
//       endDate: endDate
//       // "instrumentalness" indicate the instrumentalness
//     },
//     success: function(data) {
//       data = JSON.parse(data)[0];

//       top50_feature = data["top50"];
//       billboard_feature = data["billboard"];

//       top50_feature.forEach(d => {
//         d.instrumentalness = +d.instrumentalness;
//       });

//       billboard_feature.forEach(d => {
//         d.instrumentalness = +d.instrumentalness;
//       });

//       let x = d3.scaleLinear().range([0, histo_width]);

//       x.domain([
//         Math.min(
//           d3.min(top50_feature, d => d.instrumentalness),
//           d3.min(billboard_feature, d => d.instrumentalness)
//         ),
//         Math.max(
//           d3.max(top50_feature, d => d.instrumentalness),
//           d3.max(billboard_feature, d => d.instrumentalness)
//         )
//       ]);

//       instu_svg
//         .append("g")
//         .attr("transform", "translate(0," + histo_height + ")")
//         .call(d3.axisBottom(x));

//       let histogram = d3
//         .histogram()
//         .value(function(d) {
//           return d.instrumentalness;
//         }) // I need to give the vector of value
//         .domain(x.domain()) // then the domain of the graphic
//         .thresholds(x.ticks(20)); // then the numbers of bins
//       // And apply this function to data to get the bins

//       let bins13 = histogram(billboard_feature);
//       let bins14 = histogram(top50_feature);

//       let y_max_domain =
//         d3.max(bins13, function(d) {
//           return d.length;
//         }) > 100
//           ? 100
//           : d3.max(bins13, function(d) {
//               return d.length;
//             });

//       let y = d3.scaleLinear().range([histo_height, 0]);
//       y.domain([0, y_max_domain]); // d3.hist has to be called before the Y axis obviously

//       instu_svg.append("g").call(d3.axisLeft(y));

//       // // append the bar rectangles to the svg element

//       instu_svg
//         .selectAll(".instrumentalness_bin14")
//         .data(bins14)
//         .enter()
//         .append("rect")
//         .attr("class", "instrumentalness_bin14")
//         .attr("x", 1)
//         .attr("transform", function(d) {
//           return "translate(" + x(d.x0) + "," + y(d.length) + ")";
//         })
//         .attr("width", function(d) {
//           return x(d.x1) - x(d.x0) - 1;
//         })
//         .attr("height", function(d) {
//           return histo_height - y(d.length);
//         })
//         .style("fill", "green")
//         .style("opacity", 0.6);

//       instu_svg
//         .selectAll(".instrumentalness_bin13")
//         .data(bins13)
//         .enter()
//         .append("rect")
//         .attr("class", "instrumentalness_bin13")
//         .attr("x", 1)
//         .attr("transform", function(d) {
//           return "translate(" + x(d.x0) + "," + y(d.length) + ")";
//         })
//         .attr("width", function(d) {
//           return x(d.x1) - x(d.x0) - 1;
//         })
//         .attr("height", function(d) {
//           return histo_height - y(d.length);
//         })
//         .style("fill", "blue")
//         .style("opacity", histo_opacity)
//         .on("mouseover", function(d) {
//           d3.select(this).style("fill", "red");
//           let isClick = d3.select(this).attr("isClick");
//           if (isClick == "true") return;
//           for (let track of d) {
//             giveHighlight(track["track"]);
//           }
//         })
//         .on("mouseleave", function(d) {
//           let isClick = d3.select(this).attr("isClick");
//           if (isClick == "true") return;

//           d3.select(this).style("fill", "blue");
//           for (let track of d) {
//             removeHighlight(track["track"]);
//           }
//         })
//         .attr("isClick", false)
//         .on("click", function(d) {
//           let isClick = d3.select(this).attr("isClick");

//           if (isClick == "false") {
//             d3.select(this).attr("isClick", "true");
//             d3.select(this).style("fill", "red");
//             for (let track of d) {
//               giveHighlight(track["track"]);
//             }
//           } else {
//             d3.select(this).attr("isClick", "false");
//             d3.select(this).style("fill", "blue");
//             for (let track of d) {
//               removeHighlight(track["track"]);
//             }
//           }
//         });
//     },
//     error: function(err) {
//       alert("error: music instrumentalness");
//     }
//   });
// }

// /////************************ music_liveness  ************************//////
function drawMusicLivenessHistogram(startDate = "1965", endDate = "2016") {
  let live_svg = d3
    .select("#music_liveness")
    .append("svg")
    .attr("width", histo_width + histo_margin.left + histo_margin.right)
    .attr("height", histo_height + histo_margin.top + histo_margin.bottom)
    .append("g")
    .attr(
      "transform",
      "translate(" + histo_margin.left + "," + histo_margin.top + ")"
    );

  live_svg
    .append("text")
    .attr(
      "transform",
      "translate(" + (histo_width / 2 - histo_margin.left) + ",0)"
    )
    .text("Liveness");
  $.ajax({
    url: "/getFeatureData",
    type: "GET",
    data: {
      feature: "liveness",
      startDate: startDate,
      endDate: endDate
      // "liveness" indicate the liveness
    },
    success: function(data) {
      data = JSON.parse(data)[0];

      top50_feature = data["top50"];
      billboard_feature = data["billboard"];

      top50_feature.forEach(d => {
        d.liveness = +d.liveness;
      });

      billboard_feature.forEach(d => {
        d.liveness = +d.liveness;
      });

      let x = d3.scaleLinear().range([0, histo_width]);

      x.domain([
        Math.min(
          d3.min(top50_feature, d => d.liveness),
          d3.min(billboard_feature, d => d.liveness)
        ),
        Math.max(
          d3.max(top50_feature, d => d.liveness),
          d3.max(billboard_feature, d => d.liveness)
        )
      ]);

      live_svg
        .append("g")
        .attr("transform", "translate(0," + histo_height + ")")
        .call(d3.axisBottom(x));

      let histogram = d3
        .histogram()
        .value(function(d) {
          return d.liveness;
        }) // I need to give the vector of value
        .domain(x.domain()) // then the domain of the graphic
        .thresholds(x.ticks(20)); // then the numbers of bins
      // And apply this function to data to get the bins

      let bins15 = histogram(billboard_feature);
      let bins16 = histogram(top50_feature);

      let y_max_domain =
        d3.max(bins15, function(d) {
          return d.length;
        }) > 100
          ? 100
          : d3.max(bins15, function(d) {
              return d.length;
            });

      let y = d3.scaleLinear().range([histo_height, 0]);
      y.domain([0, y_max_domain]); // d3.hist has to be called before the Y axis obviously

      live_svg.append("g").call(d3.axisLeft(y));

      // // append the bar rectangles to the svg element

      live_svg
        .selectAll(".liveness_bin16")
        .data(bins16)
        .enter()
        .append("rect")
        .attr("class", "liveness_bin16")
        .attr("x", 1)
        .attr("transform", function(d) {
          return "translate(" + x(d.x0) + "," + y(d.length) + ")";
        })
        .attr("width", function(d) {
          return x(d.x1) - x(d.x0) - 1;
        })
        .attr("height", function(d) {
          return histo_height - y(d.length);
        })
        .style("fill", "green")
        .style("opacity", 0.6);

      live_svg
        .selectAll(".liveness_bin15")
        .data(bins15)
        .enter()
        .append("rect")
        .attr("class", "liveness_bin15")
        .attr("x", 1)
        .attr("transform", function(d) {
          return "translate(" + x(d.x0) + "," + y(d.length) + ")";
        })
        .attr("width", function(d) {
          return x(d.x1) - x(d.x0) - 1;
        })
        .attr("height", function(d) {
          return histo_height - y(d.length);
        })
        .style("fill", "blue")
        .style("opacity", histo_opacity)
        .on("mouseover", function(d) {
          d3.select(this).style("fill", "red");

          let isClick = d3.select(this).attr("isClick");
          if (isClick == "true") return;

          for (let track of d) {
            giveHighlight(track["track"]);
          }
        })
        .on("mouseleave", function(d) {
          let isClick = d3.select(this).attr("isClick");
          if (isClick == "true") return;

          d3.select(this).style("fill", "blue");
          for (let track of d) {
            removeHighlight(track["track"]);
          }
        })
        .attr("isClick", false)
        .on("click", function(d) {
          let isClick = d3.select(this).attr("isClick");

          if (isClick == "false") {
            d3.select(this).attr("isClick", "true");
            d3.select(this).style("fill", "red");
            isOneHistoClicked = true;

            if (filteredMusicCollection.has("liveness")) {
              tempList = filteredMusicCollection.get("liveness");
            } else {
              tempList = [];
            }

            for (let track of d) {
              let trackName = track["track"].split("_");
              trackName = trackName.join(" ");
              trackName = capitalize(trackName);

              tempList.push(trackName);
              giveHighlight(track["track"]);
            }

            filteredMusicCollection.set("liveness", tempList);
            filterMusic_billboard(filteredMusicCollection);
          } else {
            d3.select(this).attr("isClick", "false");
            d3.select(this).style("fill", "blue");

            let trackList = filteredMusicCollection.get("liveness");
            let temp = [];

            for (let track of d) {
              let trackName = track["track"].split("_");
              trackName = trackName.join(" ");
              trackName = capitalize(trackName);
              //   console.log(trackName);
              //   console.log(trackList);
              //   console.log(trackList.includes(trackName));

              if (trackList.includes(trackName)) {
                trackList = trackList.filter(function(e) {
                  return e !== trackName;
                });
              }

              removeHighlight(track["track"]);
            }

            if (trackList.length == 0) {
              filteredMusicCollection.delete("liveness");
            } else {
              filteredMusicCollection.set("liveness", trackList);
            }
            //
            filterMusic_billboard(filteredMusicCollection);
          }
        });
    },
    error: function(err) {
      alert("error: music liveness");
    }
  });
}
// ////************************   music_valence   ************************//////
function drawMusicValenceHistogram(startDate = "1965", endDate = "2016") {
  let mvale_svg = d3
    .select("#music_valence")
    .append("svg")
    .attr("width", histo_width + histo_margin.left + histo_margin.right)
    .attr("height", histo_height + histo_margin.top + histo_margin.bottom)
    .append("g")
    .attr(
      "transform",
      "translate(" + histo_margin.left + "," + histo_margin.top + ")"
    );

  mvale_svg
    .append("text")
    .attr(
      "transform",
      "translate(" + (histo_width / 2 - histo_margin.left) + ",0)"
    )
    .text("Valence");

  $.ajax({
    url: "/getFeatureData",
    type: "GET",
    data: {
      feature: "valence",
      startDate: startDate,
      endDate: endDate
      // "valence" indicate the valence
    },
    success: function(data) {
      data = JSON.parse(data)[0];

      top50_feature = data["top50"];
      billboard_feature = data["billboard"];

      top50_feature.forEach(d => {
        d.valence = +d.valence;
      });

      billboard_feature.forEach(d => {
        d.valence = +d.valence;
      });

      let x = d3.scaleLinear().range([0, histo_width]);

      x.domain([
        Math.min(
          d3.min(top50_feature, d => d.valence),
          d3.min(billboard_feature, d => d.valence)
        ),
        Math.max(
          d3.max(top50_feature, d => d.valence),
          d3.max(billboard_feature, d => d.valence)
        )
      ]);

      mvale_svg
        .append("g")
        .attr("transform", "translate(0," + histo_height + ")")
        .call(d3.axisBottom(x));

      let histogram = d3
        .histogram()
        .value(function(d) {
          return d.valence;
        }) // I need to give the vector of value
        .domain(x.domain()) // then the domain of the graphic
        .thresholds(x.ticks(20)); // then the numbers of bins
      // And apply this function to data to get the bins

      let bins17 = histogram(billboard_feature);
      let bins18 = histogram(top50_feature);

      let y_max_domain =
        d3.max(bins17, function(d) {
          return d.length;
        }) > 100
          ? 100
          : d3.max(bins17, function(d) {
              return d.length;
            });

      let y = d3.scaleLinear().range([histo_height, 0]);
      y.domain([0, y_max_domain]); // d3.hist has to be called before the Y axis obviously

      mvale_svg.append("g").call(d3.axisLeft(y));

      // // append the bar rectangles to the svg element

      mvale_svg
        .selectAll(".valence_bin18")
        .data(bins18)
        .enter()
        .append("rect")
        .attr("class", "valence_bin18")
        .attr("x", 1)
        .attr("transform", function(d) {
          return "translate(" + x(d.x0) + "," + y(d.length) + ")";
        })
        .attr("width", function(d) {
          return x(d.x1) - x(d.x0) - 1;
        })
        .attr("height", function(d) {
          return histo_height - y(d.length);
        })
        .style("fill", "green")
        .style("opacity", 0.6);

      mvale_svg
        .selectAll(".valence_bin17")
        .data(bins17)
        .enter()
        .append("rect")
        .attr("class", "valence_bin17")
        .attr("x", 1)
        .attr("transform", function(d) {
          return "translate(" + x(d.x0) + "," + y(d.length) + ")";
        })
        .attr("width", function(d) {
          return x(d.x1) - x(d.x0) - 1;
        })
        .attr("height", function(d) {
          return histo_height - y(d.length);
        })
        .style("fill", "blue")
        .style("opacity", histo_opacity)
        .on("mouseover", function(d) {
          d3.select(this).style("fill", "red");

          let isClick = d3.select(this).attr("isClick");
          if (isClick == "true") return;

          for (let track of d) {
            giveHighlight(track["track"]);
          }
        })
        .on("mouseleave", function(d) {
          let isClick = d3.select(this).attr("isClick");
          if (isClick == "true") return;

          d3.select(this).style("fill", "blue");
          for (let track of d) {
            removeHighlight(track["track"]);
          }
        })
        .attr("isClick", false)
        .on("click", function(d) {
          let isClick = d3.select(this).attr("isClick");

          if (isClick == "false") {
            d3.select(this).attr("isClick", "true");
            d3.select(this).style("fill", "red");
            isOneHistoClicked = true;

            if (filteredMusicCollection.has("valence")) {
              tempList = filteredMusicCollection.get("valence");
            } else {
              tempList = [];
            }

            for (let track of d) {
              let trackName = track["track"].split("_");
              trackName = trackName.join(" ");
              trackName = capitalize(trackName);

              tempList.push(trackName);
              giveHighlight(track["track"]);
            }

            filteredMusicCollection.set("valence", tempList);
            filterMusic_billboard(filteredMusicCollection);
          } else {
            d3.select(this).attr("isClick", "false");
            d3.select(this).style("fill", "blue");

            let trackList = filteredMusicCollection.get("valence");
            let temp = [];

            for (let track of d) {
              let trackName = track["track"].split("_");
              trackName = trackName.join(" ");
              trackName = capitalize(trackName);
              //   console.log(trackName);
              //   console.log(trackList);
              //   console.log(trackList.includes(trackName));

              if (trackList.includes(trackName)) {
                trackList = trackList.filter(function(e) {
                  return e !== trackName;
                });
              }

              removeHighlight(track["track"]);
            }

            if (trackList.length == 0) {
              filteredMusicCollection.delete("valence");
            } else {
              filteredMusicCollection.set("valence", trackList);
            }
            //
            filterMusic_billboard(filteredMusicCollection);
          }
        });
    },
    error: function(err) {
      alert("error: music valence");
    }
  });
}

// //////************************  tempo   ************************///////
function drawMusicTempoHistogram(startDate = "1965", endDate = "2016") {
  let tempo_svg = d3
    .select("#music_tempo")
    .append("svg")
    .attr("width", histo_width + histo_margin.left + histo_margin.right)
    .attr("height", histo_height + histo_margin.top + histo_margin.bottom)
    .append("g")
    .attr(
      "transform",
      "translate(" + histo_margin.left + "," + histo_margin.top + ")"
    );

  tempo_svg
    .append("text")
    .attr(
      "transform",
      "translate(" + (histo_width / 2 - histo_margin.left) + ",0)"
    )
    .text("Tempo");

  $.ajax({
    url: "/getFeatureData",
    type: "GET",
    data: {
      feature: "tempo",
      startDate: startDate,
      endDate: endDate
      // "tempo" indicate the tempo
    },
    success: function(data) {
      data = JSON.parse(data)[0];

      top50_feature = data["top50"];
      billboard_feature = data["billboard"];

      top50_feature.forEach(d => {
        d.tempo = +d.tempo;
      });

      billboard_feature.forEach(d => {
        d.tempo = +d.tempo;
      });

      let x = d3.scaleLinear().range([0, histo_width]);

      x.domain([
        Math.min(
          d3.min(top50_feature, d => d.tempo),
          d3.min(billboard_feature, d => d.tempo)
        ),
        Math.max(
          d3.max(top50_feature, d => d.tempo),
          d3.max(billboard_feature, d => d.tempo)
        )
      ]);

      tempo_svg
        .append("g")
        .attr("transform", "translate(0," + histo_height + ")")
        .call(d3.axisBottom(x));

      let histogram = d3
        .histogram()
        .value(function(d) {
          return d.tempo;
        }) // I need to give the vector of value
        .domain(x.domain()) // then the domain of the graphic
        .thresholds(x.ticks(20)); // then the numbers of bins
      // And apply this function to data to get the bins

      let bins3 = histogram(billboard_feature);
      let bins4 = histogram(top50_feature);

      let y_max_domain =
        d3.max(bins3, function(d) {
          return d.length;
        }) > 100
          ? 100
          : d3.max(bins3, function(d) {
              return d.length;
            });

      let y = d3.scaleLinear().range([histo_height, 0]);
      y.domain([0, y_max_domain]); // d3.hist has to be called before the Y axis obviously

      tempo_svg.append("g").call(d3.axisLeft(y));

      // // append the bar rectangles to the svg element

      tempo_svg
        .selectAll(".tempo_bin2")
        .data(bins4)
        .enter()
        .append("rect")
        .attr("class", "tempo_bin2")
        .attr("x", 1)
        .attr("transform", function(d) {
          return "translate(" + x(d.x0) + "," + y(d.length) + ")";
        })
        .attr("width", function(d) {
          return x(d.x1) - x(d.x0) - 1;
        })
        .attr("height", function(d) {
          return histo_height - y(d.length);
        })
        .style("fill", "green")
        .style("opacity", 0.6);

      tempo_svg
        .selectAll(".tempo_bin1")
        .data(bins3)
        .enter()
        .append("rect")
        .attr("class", "tempo_bin1")
        .attr("x", 1)
        .attr("transform", function(d) {
          return "translate(" + x(d.x0) + "," + y(d.length) + ")";
        })
        .attr("width", function(d) {
          return x(d.x1) - x(d.x0) - 1;
        })
        .attr("height", function(d) {
          return histo_height - y(d.length);
        })
        .style("fill", "blue")
        .style("opacity", histo_opacity)
        .on("mouseover", function(d) {
          d3.select(this).style("fill", "red");

          let isClick = d3.select(this).attr("isClick");
          if (isClick == "true") return;

          for (let track of d) {
            giveHighlight(track["track"]);
          }
        })
        .on("mouseleave", function(d) {
          let isClick = d3.select(this).attr("isClick");
          if (isClick == "true") return;

          d3.select(this).style("fill", "blue");
          for (let track of d) {
            removeHighlight(track["track"]);
          }
        })
        .attr("isClick", false)
        .on("click", function(d) {
          let isClick = d3.select(this).attr("isClick");

          if (isClick == "false") {
            d3.select(this).attr("isClick", "true");
            d3.select(this).style("fill", "red");
            isOneHistoClicked = true;

            if (filteredMusicCollection.has("tempo")) {
              tempList = filteredMusicCollection.get("tempo");
            } else {
              tempList = [];
            }

            for (let track of d) {
              let trackName = track["track"].split("_");
              trackName = trackName.join(" ");
              trackName = capitalize(trackName);

              tempList.push(trackName);
              giveHighlight(track["track"]);
            }

            filteredMusicCollection.set("tempo", tempList);
            filterMusic_billboard(filteredMusicCollection);
          } else {
            d3.select(this).attr("isClick", "false");
            d3.select(this).style("fill", "blue");

            let trackList = filteredMusicCollection.get("tempo");
            let temp = [];

            for (let track of d) {
              let trackName = track["track"].split("_");
              trackName = trackName.join(" ");
              trackName = capitalize(trackName);
              //   console.log(trackName);
              //   console.log(trackList);
              //   console.log(trackList.includes(trackName));

              if (trackList.includes(trackName)) {
                trackList = trackList.filter(function(e) {
                  return e !== trackName;
                });
              }

              removeHighlight(track["track"]);
            }
            if (trackList.length == 0) {
              filteredMusicCollection.delete("tempo");
            } else {
              filteredMusicCollection.set("tempo", trackList);
            }
            //
            filterMusic_billboard(filteredMusicCollection);
          }
        });
    },
    error: function(err) {
      alert("error: music tempo");
    }
  });
}

// ////***************   music_duration_ms    ************************/////
function drawMusicDurationHistogram(startDate = "1965", endDate = "2016") {
  let dur_svg = d3
    .select("#music_duration_ms")
    .append("svg")
    .attr("width", histo_width + histo_margin.left + histo_margin.right)
    .attr("height", histo_height + histo_margin.top + histo_margin.bottom)
    .append("g")
    .attr(
      "transform",
      "translate(" + histo_margin.left + "," + histo_margin.top + ")"
    );

  dur_svg
    .append("text")
    .attr(
      "transform",
      "translate(" + (histo_width / 2 - histo_margin.left) + ",0)"
    )
    .text("Duration");

  $.ajax({
    url: "/getFeatureData",
    type: "GET",
    data: {
      feature: "duration_ms",
      startDate: startDate,
      endDate: endDate
      // "duration_ms" indicate the duration_ms
    },
    success: function(data) {
      data = JSON.parse(data)[0];

      top50_feature = data["top50"];
      billboard_feature = data["billboard"];

      top50_feature.forEach(d => {
        d.duration_ms = +d.duration_ms;
      });

      billboard_feature.forEach(d => {
        d.duration_ms = +d.duration_ms;
      });

      let x = d3.scaleLinear().range([0, histo_width]);

      x.domain([
        Math.min(
          d3.min(top50_feature, d => d.duration_ms),
          d3.min(billboard_feature, d => d.duration_ms)
        ),
        Math.max(
          d3.max(top50_feature, d => d.duration_ms),
          d3.max(billboard_feature, d => d.duration_ms)
        )
      ]);

      dur_svg
        .append("g")
        .attr("transform", "translate(0," + histo_height + ")")
        .call(d3.axisBottom(x));

      let histogram = d3
        .histogram()
        .value(function(d) {
          return d.duration_ms;
        }) // I need to give the vector of value
        .domain(x.domain()) // then the domain of the graphic
        .thresholds(x.ticks(20)); // then the numbers of bins
      // And apply this function to data to get the bins

      let bins19 = histogram(billboard_feature);
      let bins20 = histogram(top50_feature);

      let y_max_domain =
        d3.max(bins19, function(d) {
          return d.length;
        }) > 60
          ? 60
          : d3.max(bins19, function(d) {
              return d.length;
            });

      let y = d3.scaleLinear().range([histo_height, 0]);
      y.domain([0, y_max_domain]); // d3.hist has to be called before the Y axis obviously

      dur_svg.append("g").call(d3.axisLeft(y));
      // // append the bar rectangles to the svg element

      dur_svg
        .selectAll(".duration_bin20")
        .data(bins20)
        .enter()
        .append("rect")
        .attr("class", "duration_bin20")
        .attr("x", 1)
        .attr("transform", function(d) {
          return "translate(" + x(d.x0) + "," + y(d.length) + ")";
        })
        .attr("width", function(d) {
          return x(d.x1) - x(d.x0) - 1;
        })
        .attr("height", function(d) {
          return histo_height - y(d.length);
        })
        .style("fill", "green")
        .style("opacity", 0.6);

      dur_svg
        .selectAll(".duration_bin19")
        .data(bins19)
        .enter()
        .append("rect")
        .attr("class", "duration_bin19")
        .attr("x", 1)
        .attr("transform", function(d) {
          return "translate(" + x(d.x0) + "," + y(d.length) + ")";
        })
        .attr("width", function(d) {
          return x(d.x1) - x(d.x0) - 1;
        })
        .attr("height", function(d) {
          return histo_height - y(d.length);
        })
        .style("fill", "blue")
        .style("opacity", histo_opacity)
        .on("mouseover", function(d) {
          d3.select(this).style("fill", "red");

          let isClick = d3.select(this).attr("isClick");
          if (isClick == "true") return;

          for (let track of d) {
            giveHighlight(track["track"]);
          }
        })
        .on("mouseleave", function(d) {
          let isClick = d3.select(this).attr("isClick");
          if (isClick == "true") return;

          d3.select(this).style("fill", "blue");
          for (let track of d) {
            removeHighlight(track["track"]);
          }
        })
        .attr("isClick", false)
        .on("click", function(d) {
          let isClick = d3.select(this).attr("isClick");

          if (isClick == "false") {
            d3.select(this).attr("isClick", "true");
            d3.select(this).style("fill", "red");
            isOneHistoClicked = true;

            if (filteredMusicCollection.has("duration_ms")) {
              tempList = filteredMusicCollection.get("duration_ms");
            } else {
              tempList = [];
            }

            for (let track of d) {
              let trackName = track["track"].split("_");
              trackName = trackName.join(" ");
              trackName = capitalize(trackName);

              tempList.push(trackName);
              giveHighlight(track["track"]);
            }

            filteredMusicCollection.set("duration_ms", tempList);
            filterMusic_billboard(filteredMusicCollection);
          } else {
            d3.select(this).attr("isClick", "false");
            d3.select(this).style("fill", "blue");

            let trackList = filteredMusicCollection.get("duration_ms");
            let temp = [];

            for (let track of d) {
              let trackName = track["track"].split("_");
              trackName = trackName.join(" ");
              trackName = capitalize(trackName);
              //   console.log(trackName);
              //   console.log(trackList);
              //   console.log(trackList.includes(trackName));

              if (trackList.includes(trackName)) {
                trackList = trackList.filter(function(e) {
                  return e !== trackName;
                });
              }

              removeHighlight(track["track"]);
            }

            if (trackList.length == 0) {
              filteredMusicCollection.delete("duration_ms");
            } else {
              filteredMusicCollection.set("duration_ms", trackList);
            }
            //
            filterMusic_billboard(filteredMusicCollection);
          }
        });
    },
    error: function(err) {
      alert("error: music duration");
    }
  });
}
