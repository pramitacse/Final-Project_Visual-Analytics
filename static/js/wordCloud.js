let myWords = [
  "Hello",
  "Everybody",
  "How",
  "Are",
  "You",
  "Today",
  "It",
  "Is",
  "A",
  "Lovely",
  "Day",
  "I",
  "Love",
  "Coding",
  "In",
  "My",
  "Van",
  "Mate"
];

// set the dimensions and margins of the graph
let wordCloud_margin = { top: 10, right: 0, bottom: 10, left: 10 },
  wordCloud_width = 300 - wordCloud_margin.left - wordCloud_margin.right,
  wordCloud_height = 300 - wordCloud_margin.top - wordCloud_margin.bottom;

// append the svg object to the body of the page
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
    "translate(" + wordCloud_margin.left + "," + wordCloud_margin.top + ")"
  );

// Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
let layout = d3.layout
  .cloud()
  .size([wordCloud_width, wordCloud_height])
  .words(
    myWords.map(function(d) {
      return { text: d };
    })
  )
  .padding(10)
  .fontSize(30)
  .on("end", draw);

layout.start();

// This function takes the output of 'layout' above and draw the words
// Better not to touch it. To change parameters, play with the 'layout' letiable above
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
    .style("font-size", function(d) {
      return d.size + "px";
    })
    .attr("text-anchor", "middle")
    .attr("transform", function(d) {
      return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
    })
    .text(function(d) {
      return d.text;
    });
}
