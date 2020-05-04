const capitalize = s => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

$.ajax({
  url: "/getMusic",
  type: "GET",
  data: {
    state: "top50"
  },
  success: function(data) {
    data = JSON.parse(data);

    // console.log(data);
    for (let item of data) {
      let year = item["releaseDate"].split("-")[0];

      let track = item["track"].split("_");
      track = track.join(" ");
      track = capitalize(track);

      let artist = item["artist"].split("_");
      artist = artist.join(" ");
      artist = capitalize(artist);
      let table_row = d3.select("#table-content-top50").append("tr");

      table_row.append("td").text(year);
      table_row.append("td").text(track);
      table_row.append("td").text(artist);
    }
  },
  error: function(err) {
    console.log(err);
  }
});

$.ajax({
  url: "/getMusic",
  type: "GET",
  data: {
    state: "billboard"
  },
  success: function(data) {
    data = JSON.parse(data);

    // console.log(data);
    for (let item of data) {
      let year = item["releaseDate"].split("-")[0];

      let track = item["track"].split("_");
      track = track.join(" ");
      track = capitalize(track);

      let artist = item["artist"].split("_");
      artist = artist.join(" ");
      artist = capitalize(artist);

      let table_row = d3.select("#table-content-billboard").append("tr");

      table_row.append("td").text(year);
      table_row.append("td").text(track);
      table_row.append("td").text(artist);
    }
  },
  error: function(err) {
    console.log(err);
  }
});
