console.log("This is swarmplot");

// example code
//:  get all the data from backend
$.ajax({
  url: "/getAllFeatures",
  type: "GET",
  data: {
    state: "billboard"
  },
  success: function(data) {
    // console.log(data);

    data = JSON.parse(data);

    for (trackInfo of data) {
      console.log(trackInfo);

      console.log(trackInfo["track"]);
      break;
    }
  },
  error: function() {
    alert("error");
  }
});
