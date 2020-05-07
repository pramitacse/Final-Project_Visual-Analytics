// let originalMusicList_billboard = "";
let isInit = true;
let originalMusicList_billboard = [];
let isOneHistoClicked = false;
// let filteredMusicList_billboard = "";

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

      let table_row = d3
        .select("#table-content-top50")
        .append("tr")
        .on("click", function() {
          window.open(
            "https://www.youtube.com/results?search_query=" +
              item["track"].replace("_", " "),
            "_blank"
          );
          // https://www.youtube.com/results?search_query=i%27m+englishman+in+new+york
        })
        .on("mouseover", function() {
          //   d3.select("#circ-" + item["track"])
          //     .style("stroke", "#56C6D8")
          //     .style("stroke-width", 3)
          //     // .transition()
          //     // .duration(300)
          //     .attr("r", d => {
          //       let tempR = +d3.select("#circ-" + item["track"]).attr("r");

          //       // console.log(tempR);
          //       if (tempR >= 17) {
          //         return tempR + 2;
          //       }

          //       //   d3.select(this)
          //       //     .style("fill", "url(#" + item["track"] + "-icon)")
          //       //     .style("fill-opacity", "1");

          //       return 17;
          //     });

          // give a highlight on histogram
          // 1. valence
          d3.selectAll(".valence_bin18").each(function(d2) {
            if (item.valence >= d2.x0 && item.valence < d2.x1) {
              d3.select(this).style("fill", "red");
            }
          });

          // 2. tempo
          d3.selectAll(".tempo_bin2").each(function(d2) {
            if (item.tempo >= d2.x0 && item.tempo < d2.x1) {
              d3.select(this).style("fill", "red");
            }
          });

          // 3. duration
          d3.selectAll(".duration_bin20").each(function(d2) {
            if (item.duration_ms >= d2.x0 && item.duration_ms < d2.x1) {
              d3.select(this).style("fill", "red");
            }
          });
          //4. dancability
          d3.selectAll(".dancebility_bin8").each(function(d2) {
            if (item.dancebility >= d2.x0 && item.dancebility < d2.x1) {
              d3.select(this).style("fill", "red");
            }
          });
          //5. energy
          d3.selectAll(".energy_bin2").each(function(d2) {
            if (item.energy >= d2.x0 && item.energy < d2.x1) {
              d3.select(this).style("fill", "red");
            }
          });
          //6. acousticness
          d3.selectAll(".acousticness_bin6").each(function(d2) {
            if (item.acousticness >= d2.x0 && item.acousticness < d2.x1) {
              d3.select(this).style("fill", "red");
            }
          });
          //7. speechness
          d3.selectAll(".speechiness_bin10").each(function(d2) {
            if (item.speechiness >= d2.x0 && item.speechiness < d2.x1) {
              d3.select(this).style("fill", "red");
            }
          });
          //8. loudness
          d3.selectAll(".loudness_bin12").each(function(d2) {
            if (item.loudness >= d2.x0 && item.loudness < d2.x1) {
              d3.select(this).style("fill", "red");
            }
          });
          //9. liveness
          d3.selectAll(".liveness_bin16").each(function(d2) {
            if (item.liveness >= d2.x0 && item.liveness < d2.x1) {
              d3.select(this).style("fill", "red");
            }
          });
        })
        .on("mouseout", function() {
          //   let shouldUpdate = false;

          // remove a highlight on histogram
          // 1. valence
          d3.selectAll(".valence_bin18").each(function(d2) {
            if (item.valence >= d2.x0 && item.valence < d2.x1) {
              d3.select(this).style("fill", "green");
            }
          });

          // 2. tempo
          d3.selectAll(".tempo_bin2").each(function(d2) {
            if (item.tempo >= d2.x0 && item.tempo < d2.x1) {
              d3.select(this).style("fill", "green");
            }
          });

          // 3. duration
          d3.selectAll(".duration_bin20").each(function(d2) {
            if (item.duration_ms >= d2.x0 && item.duration_ms < d2.x1) {
              d3.select(this).style("fill", "green");
            }
          });
          //4. dancability
          d3.selectAll(".dancebility_bin8").each(function(d2) {
            if (item.dancebility >= d2.x0 && item.dancebility < d2.x1) {
              d3.select(this).style("fill", "green");
            }
          });

          //5. energy
          d3.selectAll(".energy_bin2").each(function(d2) {
            if (item.energy >= d2.x0 && item.energy < d2.x1) {
              d3.select(this).style("fill", "green");
            }
          });
          //6. acousticness
          d3.selectAll(".acousticness_bin6").each(function(d2) {
            if (item.acousticness >= d2.x0 && item.acousticness < d2.x1) {
              d3.select(this).style("fill", "green");
            }
          });
          //7. speechness
          d3.selectAll(".speechiness_bin10").each(function(d2) {
            if (item.speechiness >= d2.x0 && item.speechiness < d2.x1) {
              d3.select(this).style("fill", "green");
            }
          });
          //8. loudness
          d3.selectAll(".loudness_bin12").each(function(d2) {
            if (item.loudness >= d2.x0 && item.loudness < d2.x1) {
              d3.select(this).style("fill", "green");
            }
          });
          //9. liveness
          d3.selectAll(".liveness_bin16").each(function(d2) {
            if (item.liveness >= d2.x0 && item.liveness < d2.x1) {
              d3.select(this).style("fill", "green");
            }
          });

          //   console.log(shouldUpdate);

          //   d3.select("#circ-" + item["track"])
          //     // .transition()
          //     // .duration(300)
          //     .attr("r", d => {
          //       //   console.log(d.track);

          //       let currR = +d3.select("#circ-" + d.track).attr("r");
          //       let tempR = 10 / Math.log(d.rank + 1);

          //       if (currR >= 19) {
          //         return currR - 2;
          //       }

          //       if (tempR <= 3) {
          //         d3.select(this)
          //           .style("fill", "")
          //           .style("fill-opacity", "0.5");
          //       }
          //       return tempR;
          //     });

          //   if (shouldUpdate)
          //     d3.select("#circ-" + item["track"])
          //       .style("stroke", "black")
          //       .style("stroke-width", 1);
        });

      table_row.append("td").text(year);
      table_row.append("td").text(track);
      table_row.append("td").text(artist);
    }
  },
  error: function(err) {
    console.log(err);
  }
});

// Call the billboard list
getMusicList_billboard();

function resetBillboardList() {
  d3.select("#table-content-billboard").html("");

  for (let item of originalMusicList_billboard) {
    let year = item["year"];

    let track = item["track"].split("_");
    track = track.join(" ");
    track = capitalize(track);

    let artist = item["artist"];

    let tableBillboard = d3
      .select("#table-content-billboard")
      .append("tr")
      .on("mouseover", function() {
        d3.select("#circ-" + item["track"])
          .style("stroke", "#56C6D8")
          .style("stroke-width", 3)
          //   .transition()
          //   .duration(300)
          .attr("r", d => {
            let tempR = +d3.select("#circ-" + item["track"]).attr("r");

            // console.log(tempR);
            if (tempR >= 17) {
              return tempR + 2;
            }

            // d3.select(this)
            //   .style("fill", "url(#" + d.track + "-icon)")
            //   .style("fill-opacity", "1");

            return 17;
          });

        // give a highlight on histogram
        // 1. valence
        d3.selectAll(".valence_bin17").each(function(d2) {
          if (item.valence >= d2.x0 && item.valence < d2.x1) {
            d3.select(this).style("fill", "red");
          }
        });
        // 2. tempo
        d3.selectAll(".tempo_bin1").each(function(d2) {
          if (item.tempo >= d2.x0 && item.tempo < d2.x1) {
            d3.select(this).style("fill", "red");
          }
        });

        // 3. duration
        d3.selectAll(".duration_bin19").each(function(d2) {
          if (item.duration_ms >= d2.x0 && item.duration_ms < d2.x1) {
            d3.select(this).style("fill", "red");
          }
        });
        //4. dancability
        d3.selectAll(".dancebility_bin7").each(function(d2) {
          if (item.dancebility >= d2.x0 && item.dancebility < d2.x1) {
            d3.select(this).style("fill", "red");
          }
        });
        //5. energy
        d3.selectAll(".energy_bin1").each(function(d2) {
          if (item.energy >= d2.x0 && item.energy < d2.x1) {
            d3.select(this).style("fill", "red");
          }
        });
        //6. acousticness
        d3.selectAll(".acousticness_bin5").each(function(d2) {
          if (item.acousticness >= d2.x0 && item.acousticness < d2.x1) {
            d3.select(this).style("fill", "red");
          }
        });
        //7. speechness
        d3.selectAll(".speechiness_bin9").each(function(d2) {
          if (item.speechiness >= d2.x0 && item.speechiness < d2.x1) {
            d3.select(this).style("fill", "red");
          }
        });
        //8. loudness
        d3.selectAll(".loudness_bin11").each(function(d2) {
          if (item.loudness >= d2.x0 && item.loudness < d2.x1) {
            d3.select(this).style("fill", "red");
          }
        });
        //9. liveness
        d3.selectAll(".liveness_bin15").each(function(d2) {
          if (item.liveness >= d2.x0 && item.liveness < d2.x1) {
            d3.select(this).style("fill", "red");
          }
        });
      })
      .on("mouseout", function() {
        let shouldUpdate = false;
        let isHistoClick = false;

        // remove a highlight on histogram
        // 1. valence
        d3.selectAll(".valence_bin17").each(function(d2) {
          if (d3.select(this).attr("isClick") == "false") {
            if (item.valence >= d2.x0 && item.valence < d2.x1) {
              d3.select(this).style("fill", "blue");
              shouldUpdate = true;
            }
          } else {
            isHistoClick = true;
          }
        });

        // 2. tempo
        d3.selectAll(".tempo_bin1").each(function(d2) {
          if (d3.select(this).attr("isClick") == "false") {
            if (item.tempo >= d2.x0 && item.tempo < d2.x1) {
              d3.select(this).style("fill", "blue");
              shouldUpdate = true;
            }
          } else {
            isHistoClick = true;
          }
        });

        // 3. duration
        d3.selectAll(".duration_bin19").each(function(d2) {
          if (d3.select(this).attr("isClick") == "false") {
            if (item.duration_ms >= d2.x0 && item.duration_ms < d2.x1) {
              d3.select(this).style("fill", "blue");
              shouldUpdate = true;
            }
          } else {
            isHistoClick = true;
          }
        });
        //4. dancability
        d3.selectAll(".dancebility_bin7").each(function(d2) {
          console.log(d3.select(this).attr("isClick"));
          if (d3.select(this).attr("isClick") == "false") {
            if (item.dancebility >= d2.x0 && item.dancebility < d2.x1) {
              d3.select(this).style("fill", "blue");
              shouldUpdate = true;
            }
          } else {
            isHistoClick = true;
          }
        });

        //5. energy
        d3.selectAll(".energy_bin1").each(function(d2) {
          if (d3.select(this).attr("isClick") == "false") {
            if (item.energy >= d2.x0 && item.energy < d2.x1) {
              d3.select(this).style("fill", "blue");
              shouldUpdate = true;
            }
          } else {
            isHistoClick = true;
          }
        });
        //6. acousticness
        d3.selectAll(".acousticness_bin5").each(function(d2) {
          if (d3.select(this).attr("isClick") == "false") {
            if (item.acousticness >= d2.x0 && item.acousticness < d2.x1) {
              d3.select(this).style("fill", "blue");
              shouldUpdate = true;
            }
          } else {
            isHistoClick = true;
          }
        });
        //7. speechness
        d3.selectAll(".speechiness_bin9").each(function(d2) {
          if (d3.select(this).attr("isClick") == "false") {
            if (item.speechiness >= d2.x0 && item.speechiness < d2.x1) {
              d3.select(this).style("fill", "blue");
              shouldUpdate = true;
            }
          } else {
            isHistoClick = true;
          }
        });
        //8. loudness
        d3.selectAll(".loudness_bin11").each(function(d2) {
          if (d3.select(this).attr("isClick") == "false") {
            if (item.loudness >= d2.x0 && item.loudness < d2.x1) {
              d3.select(this).style("fill", "blue");
              shouldUpdate = true;
            }
          } else {
            isHistoClick = true;
          }
        });
        //9. liveness
        d3.selectAll(".liveness_bin15").each(function(d2) {
          if (d3.select(this).attr("isClick") == "false") {
            if (item.liveness >= d2.x0 && item.liveness < d2.x1) {
              d3.select(this).style("fill", "blue");
              shouldUpdate = true;
            }
          } else {
            isHistoClick = true;
          }
        });

        d3.select("#circ-" + item["track"])
          //   .transition()
          //   .duration(300)
          .attr("r", d => {
            let currR = +d3.select("#circ-" + item["track"]).attr("r");
            let tempR = 10 / Math.log(d.rank + 1);

            if (currR >= 19) {
              return currR - 2;
            }

            return tempR;
          });

        if (!isHistoClick) {
          isOneHistoClicked = false;
        }

        if (shouldUpdate && !isHistoClick)
          d3.select("#circ-" + item["track"])
            .style("stroke", "black")
            .style("stroke-width", 1);
      })
      .on("click", function() {
        window.open(
          "https://www.youtube.com/results?search_query=" +
            item["track"].replace("_", " "),
          "_blank"
        );
        // https://www.youtube.com/results?search_query=i%27m+englishman+in+new+york
      });

    tableBillboard.append("td").text(year);
    tableBillboard.append("td").text(track);
    tableBillboard.append("td").text(artist);
  }
}

function filterMusic_billboard(musicCollection) {
  let keyList = Array.from(musicCollection.keys());

  if (keyList.length >= 1) {
    let musicList = [];
    for (let key of keyList) {
      musicList = musicList.concat(musicCollection.get(key));
    }

    resetBillboardList();

    let tr_list = d3
      .select("#table-content-billboard")
      .selectAll("tr")
      .select("td:nth-child(2)")
      .each(function() {
        // console.log(d);
        let track = d3.select(this).text();

        // console.log(track);

        if (!musicList.includes(track)) {
          d3.select(this.parentNode).html("");
        }

        // return;
      });

    //   for (let track of musicCollection.get(key)) {
    //     let tr_list = d3
    //       .select("#table-content-billboard")
    //       .select("tr")
    //       .select("td:nth-child(2)")
    //       .each(function(d) {
    //         // console.log(d);
    //         console.log(d3.select(this).text());
    //         // return;
    //       });
    //   }
    // }
  } else {
    resetBillboardList();
    // d3.select("#table-content-billboard").html(originalMusicList_billboard);
  }
}

function getMusicList_billboard(startDate = "1965", endDate = "2016") {
  $.ajax({
    url: "/getMusic",
    type: "GET",
    data: {
      state: "billboard",
      startDate: startDate,
      endDate: endDate
    },
    success: function(data) {
      let musicList_billboard = [];
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

        let tableBillboard = d3
          .select("#table-content-billboard")
          .append("tr")
          .on("mouseover", function() {
            d3.select("#circ-" + item["track"])
              .style("stroke", "#56C6D8")
              .style("stroke-width", 3)
              .transition()
              .duration(300)
              .attr("r", d => {
                let tempR = +d3.select("#circ-" + item["track"]).attr("r");

                // console.log(tempR);
                if (tempR >= 17) {
                  return tempR + 2;
                }

                // d3.select(this)
                //   .style("fill", "url(#" + d.track + "-icon)")
                //   .style("fill-opacity", "1");

                return 17;
              });

            // give a highlight on histogram
            // 1. valence
            d3.selectAll(".valence_bin17").each(function(d2) {
              if (item.valence >= d2.x0 && item.valence < d2.x1) {
                d3.select(this).style("fill", "red");
              }
            });
            // 2. tempo
            d3.selectAll(".tempo_bin1").each(function(d2) {
              if (item.tempo >= d2.x0 && item.tempo < d2.x1) {
                d3.select(this).style("fill", "red");
              }
            });

            // 3. duration
            d3.selectAll(".duration_bin19").each(function(d2) {
              if (item.duration_ms >= d2.x0 && item.duration_ms < d2.x1) {
                d3.select(this).style("fill", "red");
              }
            });
            //4. dancability
            d3.selectAll(".dancebility_bin7").each(function(d2) {
              if (item.dancebility >= d2.x0 && item.dancebility < d2.x1) {
                d3.select(this).style("fill", "red");
              }
            });
            //5. energy
            d3.selectAll(".energy_bin1").each(function(d2) {
              if (item.energy >= d2.x0 && item.energy < d2.x1) {
                d3.select(this).style("fill", "red");
              }
            });
            //6. acousticness
            d3.selectAll(".acousticness_bin5").each(function(d2) {
              if (item.acousticness >= d2.x0 && item.acousticness < d2.x1) {
                d3.select(this).style("fill", "red");
              }
            });
            //7. speechness
            d3.selectAll(".speechiness_bin9").each(function(d2) {
              if (item.speechiness >= d2.x0 && item.speechiness < d2.x1) {
                d3.select(this).style("fill", "red");
              }
            });
            //8. loudness
            d3.selectAll(".loudness_bin11").each(function(d2) {
              if (item.loudness >= d2.x0 && item.loudness < d2.x1) {
                d3.select(this).style("fill", "red");
              }
            });
            //9. liveness
            d3.selectAll(".liveness_bin15").each(function(d2) {
              if (item.liveness >= d2.x0 && item.liveness < d2.x1) {
                d3.select(this).style("fill", "red");
              }
            });
          })
          .on("mouseout", function() {
            let isHistoClick = false;

            d3.select("#circ-" + item["track"])
              .style("stroke", "black")
              .style("stroke-width", "1")
              .transition()
              .duration(300)
              .attr("r", d => {
                let currR = +d3.select("#circ-" + d.track).attr("r");
                let tempR = 10 / Math.log(d.rank + 1);

                if (currR >= 19) {
                  return currR - 2;
                }

                if (tempR <= 3) {
                  d3.select(this)
                    .style("fill", "")
                    .style("fill-opacity", "0.5");
                }
                return tempR;
              });

            // remove a highlight on histogram
            // 1. valence
            d3.selectAll(".valence_bin17").each(function(d2) {
              if (d3.select(this).attr("isClick") == "false")
                if (item.valence >= d2.x0 && item.valence < d2.x1) {
                  d3.select(this).style("fill", "blue");
                }
            });

            // 2. tempo
            d3.selectAll(".tempo_bin1").each(function(d2) {
              if (d3.select(this).attr("isClick") == "false") {
                if (item.tempo >= d2.x0 && item.tempo < d2.x1) {
                  d3.select(this).style("fill", "blue");
                }
              } else {
                isHistoClick = true;
              }
            });

            // 3. duration
            d3.selectAll(".duration_bin19").each(function(d2) {
              if (d3.select(this).attr("isClick") == "false") {
                if (item.duration_ms >= d2.x0 && item.duration_ms < d2.x1) {
                  d3.select(this).style("fill", "blue");
                }
              } else {
                isHistoClick = true;
              }
            });
            //4. dancability
            d3.selectAll(".dancebility_bin7").each(function(d2) {
              if (d3.select(this).attr("isClick") == "false") {
                if (item.dancebility >= d2.x0 && item.dancebility < d2.x1) {
                  d3.select(this).style("fill", "blue");
                }
              } else {
                isHistoClick = true;
              }
            });

            //5. energy
            d3.selectAll(".energy_bin1").each(function(d2) {
              if (d3.select(this).attr("isClick") == "false") {
                if (item.energy >= d2.x0 && item.energy < d2.x1) {
                  d3.select(this).style("fill", "blue");
                }
              } else {
                isHistoClick = true;
              }
            });
            //6. acousticness
            d3.selectAll(".acousticness_bin5").each(function(d2) {
              if (d3.select(this).attr("isClick") == "false") {
                if (item.acousticness >= d2.x0 && item.acousticness < d2.x1) {
                  d3.select(this).style("fill", "blue");
                }
              } else {
                isHistoClick = true;
              }
            });
            //7. speechness
            d3.selectAll(".speechiness_bin9").each(function(d2) {
              if (d3.select(this).attr("isClick") == "false") {
                if (item.speechiness >= d2.x0 && item.speechiness < d2.x1) {
                  d3.select(this).style("fill", "blue");
                }
              } else {
                isHistoClick = true;
              }
            });
            //8. loudness
            d3.selectAll(".loudness_bin11").each(function(d2) {
              if (d3.select(this).attr("isClick") == "false") {
                if (item.loudness >= d2.x0 && item.loudness < d2.x1) {
                  d3.select(this).style("fill", "blue");
                }
              } else {
                isHistoClick = true;
              }
            });
            //9. liveness
            d3.selectAll(".liveness_bin15").each(function(d2) {
              if (d3.select(this).attr("isClick") == "false") {
                if (item.liveness >= d2.x0 && item.liveness < d2.x1) {
                  d3.select(this).style("fill", "blue");
                }
              } else {
                isHistoClick = true;
              }
            });

            if (!isHistoClick) {
              isOneHistoClicked = false;
            }
          })
          .on("click", function() {
            window.open(
              "https://www.youtube.com/results?search_query=" +
                item["track"].replace("_", " "),
              "_blank"
            );
            // https://www.youtube.com/results?search_query=i%27m+englishman+in+new+york
          });

        tableBillboard.append("td").text(year);
        tableBillboard.append("td").text(track);
        tableBillboard.append("td").text(artist);

        musicList_billboard.push({
          track: item["track"],
          year: year,
          artist: artist,

          valence: item["valence"],
          tempo: item["tempo"],
          duration_ms: item["duration_ms"],

          energy: item["energy"],
          dancebility: item["dancebility"],
          acousticness: item["acousticness"],

          speechiness: item["speechiness"],
          loudness: item["loudness"],
          liveness: item["liveness"]
        });
      }

      //   if (isInit) {
      //     isInit = false;
      originalMusicList_billboard = musicList_billboard;
      //   }
    },
    error: function(err) {
      console.log(err);
    }
  });
}
