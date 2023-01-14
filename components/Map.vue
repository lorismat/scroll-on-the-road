<template>
  <div class="sticky top-0 w-10/12 border-2 border-black mx-auto" id="us-map">
  </div>  
</template>

<script setup>
import * as d3 from 'd3';
import * as topojson from "topojson-client";

import 'intersection-observer'; 
import scrollama from "scrollama"; // or...

// map
function drawMap() {

  const width = 975;
  const height = 610;

  const us = d3.json("/map/states-albers-10m-min.json",function(d) {
    return d;
  })

  const road = d3.json("/map/Part1-min.json", function(d) {
    return d;
  })

  us.then((data) => {

    const states = topojson.feature(data, data.objects.states).features.filter(d => d.id !== "02" && d.id !== "15" );
    const path = d3.geoPath();

    const svg = d3.select("#us-map")
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`);
        
    svg
      .append('g')
      .selectAll('rect')
      .data(states)
      .enter()
      .append('path')
      .attr('d', path)
      .attr("fill", "transparent")
      .attr("stroke", "#000");

    return svg
      
  }).then((svg) => {

    road.then((data) => {

      const road = topojson.feature(data, data.objects["Part1-2"]).features;
      let points = topojson.feature(data, data.objects["Part1-1"]).features;

      points = points.filter(d => d.properties.styleUrl != '#icon-ci-10-nodesc')

      const projection = d3.geoAlbersUsa().scale(1280).translate([480, 300]);
      const path = d3.geoPath(projection);

      

      svg
        .append('g')
        .selectAll('rect')
        .data(road)
        .enter()
        .append('path')
        .attr("stroke-dasharray", path.measure)
        .attr("stroke-dashoffset", path.measure)
        .attr('d', path)
        .attr("id", (d,i) => `path-idx-${i}`)
        .attr("fill", "transparent")
        .attr("opacity", 1)
        .attr("stroke-width", 3)
        .attr("stroke", "blue")
      

      const g = svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "black");

      g.selectAll("circle")
        .data(points)
        .join("circle")
        .attr("data-idx", (d,i) => i )
        .attr("opacity", 0)
        .attr("fill", "green")
        .attr("stroke", "#000")
        .attr("stroke-width", 2)
        .attr("r", 5)
        .attr("transform", (d,i) => `translate(${projection(d.geometry.coordinates)})`);

    })
  })


}

onMounted(() => {
  drawMap();
})

// scrolling
// instantiate the scrollama
const scroller = scrollama();

function scrollActions() {
  // setup the instance, pass callback functions
  scroller
  .setup({
    step: ".step",
  })
  .onStepEnter((res) => {

    // transition
    const t = d3.transition()
              .delay(0)
              .duration(3000)
              .ease(d3.easeLinear);

    // point
    const pt = document.querySelector(`[data-idx="${res.index}"]`);
    res.direction == "down" ? pt.setAttribute("opacity", 1) : pt.setAttribute("opacity", 0);

    // road
    if (res.index % 9 == 0) {
      const rd = d3.select(`#path-idx-${Math.floor(res.index / 9)}`);
      rd.transition(t).attr("stroke-dashoffset", 0);
      // const rd = document.querySelector(`[data-path-idx="${Math.floor(res.index / 9)}"]`);
      // res.direction == "down" ? rd.setAttribute("opacity", 1) : rd.setAttribute("opacity", 0);
      // res.direction == "down" ? rd.node().setAttribute("opacity", 1) : rd.setAttribute("opacity", 0);

      // --> .transition(t).attr("stroke-dashoffset", 0)
    } 
    

    // { element, index, direction }
  })
  .onStepExit((res) => {

    // res.direction == "up" ? el.setAttribute("opacity", 0) : '';

    // { element, index, direction }
  });
}

onMounted(() => {
  // to modify with lifecycle hooks
  setTimeout(() => {
    scrollActions();
  }, 2000)
  
})

</script>

<style scoped>
</style>