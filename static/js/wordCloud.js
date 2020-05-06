// set the dimensions and margins of the graph
let wordCloud_margin = { top: 30, right: 0, bottom: 10, left: 10 },
  wordCloud_width = 300 - wordCloud_margin.left - wordCloud_margin.right,
  wordCloud_height = 200 - wordCloud_margin.top - wordCloud_margin.bottom;

let top50Keywords = [];

$.ajax({
  url: "/getKeywords",
  type: "GET",
  async: false,
  data: {
    state: "top50"
    // "dancebility" indicate the danceability
  },
  success: function(data) {
    data = JSON.parse(data);
    myWords = data[0]["keywords"];

    let wordCloud_svg = d3
      .select("#wordCloud-top50")
      .append("svg")
      .attr(
        "width",
        wordCloud_width + wordCloud_margin.left + wordCloud_margin.right
      )
      .attr(
        "height",
        wordCloud_height + wordCloud_margin.top + wordCloud_margin.bottom
      )
      .append("g")
      .attr(
        "transform",
        "translate(" + wordCloud_margin.left + "," + wordCloud_margin.top + ")"
      );

    let layout = d3.layout
      .cloud()
      .size([wordCloud_width, wordCloud_height])
      .words(
        myWords.map(function(d) {
          return { text: d };
        })
      )
      .padding(3)
      .rotate(function() {
        return ~~(Math.random() * 2) * 90;
      })
      .fontSize(15)
      .on("end", draw);

    layout.start();

    function draw(words) {
      wordCloud_svg
        .append("g")
        .attr(
          "transform",
          "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")"
        )
        .selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("fill", "black")
        .attr("id", d => "keyword-" + d.text)
        .style("font-size", function(d) {
          return d.size + "px";
        })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) {
          top50Keywords.push(d.text);
          return d.text;
        });
    }
  },
  error: function(err) {
    console.log(err);
  }
});

// console.log(top50Keywords);

drawWordCloud();

function drawWordCloud(startDate = "1965", endDate = "2016") {
  for (keyword of top50Keywords) {
    d3.select("#keyword-" + keyword)
      .style("fill", "black")
      .style("font-size", function() {
        return "15px";
      });
  }

  $.ajax({
    url: "/getKeywords",
    type: "GET",
    data: {
      state: "billboard",
      startDate: startDate,
      endDate: endDate
      // "dancebility" indicate the danceability
    },
    success: function(data) {
      data = JSON.parse(data);

      myWords = data[0]["keywords"];

      let wordCloud_svg = d3
        .select("#wordCloud-billboard")
        .append("svg")
        .attr(
          "width",
          wordCloud_width + wordCloud_margin.left + wordCloud_margin.right
        )
        .attr(
          "height",
          wordCloud_height + wordCloud_margin.top + wordCloud_margin.bottom
        )
        .append("g")
        .attr(
          "transform",
          "translate(" +
            wordCloud_margin.left +
            "," +
            wordCloud_margin.top +
            ")"
        );

      let layout = d3.layout
        .cloud()
        .size([wordCloud_width, wordCloud_height])
        .words(
          myWords.map(function(d) {
            return { text: d };
          })
        )
        .padding(3)
        .rotate(function() {
          return ~~(Math.random() * 2) * 90;
        })
        .fontSize(15)
        .on("end", draw);

      layout.start();

      function draw(words) {
        wordCloud_svg
          .append("g")
          .attr(
            "transform",
            "translate(" +
              layout.size()[0] / 2 +
              "," +
              layout.size()[1] / 2 +
              ")"
          )
          .selectAll("text")
          .data(words)
          .enter()
          .append("text")
          //   .attr("class")
          .style("font-size", function(d) {
            if (top50Keywords.includes(d.text)) {
              return "18px";
            }
            return d.size + "px";
          })
          .attr("text-anchor", "middle")
          .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          })
          .text(function(d) {
            if (top50Keywords.includes(d.text)) {
              d3.select("#keyword-" + d.text)
                .style("fill", "#ff6961")
                .style("font-size", function() {
                  //   return "15px";
                  return (
                    +d3
                      .select("#keyword-" + keyword)
                      .style("font-size")
                      .replace("px", "") +
                    3 +
                    "px"
                  );
                });
            }
            return d.text;
          })
          .style("fill", function(d) {
            if (top50Keywords.includes(d.text)) {
              return "#ff6961";
            }
            return "black";
          })
          .on("click", function(d) {
            console.log(d.text);
          });
      }
    },
    error: function(err) {
      console.log(err);
    }
  });
}
