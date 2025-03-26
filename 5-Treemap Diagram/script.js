kickstarterURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json";
movieURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";
videoGameURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";

let movieData, kickstarterData, videoGameData;

let canvas = d3.select("#canvas");
let tooltip = d3.select("#tooltip");

let drawTreeMap = (data) => {
    let hierarchy = d3.hierarchy(movieData, (node) => {
        return node.children;
    }).sum((node) => {
        return node.value;
    }).sort((node1, node2) => {
        return node2.value - node1.value;
    })

    let createTreeMap = d3.treemap()
                          .size([1000, 600]);

    createTreeMap(hierarchy);

    let movieTiles = hierarchy.leaves();

    let block = canvas.selectAll("g")
                        .data(movieTiles)
                        .enter()
                        .append("g")
                        .attr("transform", (movie) => {
                            return "translate(" + movie.x0 + ", " + movie.y0 + ")";  
                        })

        
    block.append("rect")
            .attr("class", "tile")
            .attr("fill", (movie) => {
                let category = movie.data.category;
                if (category === "Action") {
                    return "#E74C3C";
                } else if (category === "Drama") {
                    return "#3498DB";
                } else if (category === "Adventure") {
                    return "#9B59B6";
                } else if (category === "Family") {
                    return "#F1C40F";
                } else if (category === "Animation") {
                    return "#2ECC71";
                } else if (category === "Comedy") {
                    return "#1ABC9C";
                } else if (category === "Biography") {
                    return "#E67E22";
                }
            })
            .attr("data-name", (movie) => {
                return movie.data.name;
            })
            .attr("data-category", (movie) => {
                return movie.data.category;
            }) 
            .attr("data-value", (movie) => {
                return movie.data.value;
            })
            .attr("width", (movie) => {
                return movie.x1 - movie.x0;
            })
            .attr("height", (movie) => {
                return movie.y1 - movie.y0;
            })
            .on("mouseover", (movie) => {
                tooltip.transition()
                        .style("visibility", "visible");

                let movieName = movie.data.name;
                let category = movie.data.category;
                let value = movie.data.value;

                tooltip.text(movieName + " - " + category + ": $" + value);
                tooltip.attr("data-value", value);
            })
            .on("mousemove", (movie) => {
                tooltip.style("top", (d3.event.pageY - 10) + "px")
                       .style("left", (d3.event.pageX + 10) + "px");
            })
            .on("mouseout", (movie) => {
                tooltip.transition()
                        .style("visibility", "hidden");
            })

    block.append("text")
            .text((movie) => {
                return movie.data.name;
            })
            .attr("x", 5)
            .attr("y", 15)
            .attr("font-size", "10px")
            .attr("fill", "black")       

}

d3.json(movieURL).then((data, error) => {
    if (error) {
        console.log(error);
    } else {
        movieData = data;
        console.log(movieData);
        drawTreeMap(movieData);
    }
});