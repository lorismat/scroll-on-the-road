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

    // console.log("states pre", data);
    const states = topojson.feature(data, data.objects.states).features.filter(d => d.id !== "02" && d.id !== "15" );
    const path = d3.geoPath();

    // console.log("states clean", topojson.feature(data, data.objects.states).features);

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
    console.log("ready for path");

    road.then((data) => {

      const road = topojson.feature(data, data.objects["Part1-2"]).features;
      const points = topojson.feature(data, data.objects["Part1-1"]).features;

      console.log(points);

      const projection = d3.geoAlbersUsa().scale(1280).translate([480, 300]);
      const path = d3.geoPath(projection);

      svg
        .append('g')
        .selectAll('rect')
        .data(road)
        .enter()
        .append('path')
        .attr('d', path)
        .attr("fill", "transparent")
        .attr("stroke-width", 3)
        .attr("stroke", "blue");

      const g = svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "black");

      g.selectAll("circle")
        .data(points)
        .join("circle")
          .attr("data-idx", (d,i) => i)
          .attr("opacity", 0)
          .attr("fill", "green")
          .attr("stroke", "#000")
          .attr("stroke-width", 2)
          .attr("r", 5)
          .attr("transform", d => console.log(d) || `translate(${projection(d.geometry.coordinates)})`);

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
    console.log("enter", res.index);

    const el = document.querySelector(`[data-idx="${res.index}"]`);
    console.log(el);

    el.setAttribute("opacity", 1);

    // { element, index, direction }
  })
  .onStepExit((res) => {
    console.log("exit", res);
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