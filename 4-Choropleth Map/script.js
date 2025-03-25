let educationURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
let countyURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"

let countyData;
let educationData;


let canvas = d3.select("#canvas")
let tooltip = d3.select("#tooltip")




let drawMap = () => {
    canvas.selectAll("path")
        .data(countyData)
        .enter()
        .append("path")
        .attr("d", d3.geoPath())
        .attr("class", "county")
        .attr("fill", (item) => {
            let id = item.id
            let county = educationData.find((county) => {
                return county.fips === id
            })
            let percentage = county.bachelorsOrHigher
            if (percentage <= 15) {
                return "#d9d9d9"
            } else if (percentage <= 30) {
                return "#b3b3b3"
            } else if (percentage <= 45) {
                return "#8c8c8c"
            } else if (percentage <= 60) {
                return "#666666"
            } else if (percentage <= 75) {
                return "#404040"
            } else {
                return "#0a0a0a"
            }
        })
        .attr("data-fips", (item) => {
            return item.id
        })
        .attr("data-education", (item) => {
            let id = item.id
            let county = educationData.find((county) => {
                return county.fips === id
            })
            return county.bachelorsOrHigher
        })
        .on("mouseover", (item) => {
            tooltip.transition()
                .style("visibility", "visible")
            let id = item.id
            let county = educationData.find((item) => {
                return item.fips === id
            })
            tooltip.text(county.area_name + ", " + county.state + ": " + county.bachelorsOrHigher + "%")
            tooltip.attr("data-education", county.bachelorsOrHigher)
        })
        .on("mouseout", (item) => {
            tooltip.transition()
                .style("visibility", "hidden")
        })

}

d3.json(countyURL).then((data, error) => {
    if (error) {
        console.log(error)
    } else {
        countyData = topojson.feature(data, data.objects.counties).features
        console.log(countyData);
        d3.json(educationURL).then((data, error) => {
            if (error) {
                console.log(error)
            } else {
                educationData = data;
                console.log(educationData);
                drawMap()
            }
        }) 
    }
})
