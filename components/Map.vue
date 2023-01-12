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

  const us = d3.json("/map/states-albers-10m.json",function(d) {
    return d;
  })

  const wal = d3.csv("/map/places.csv", function(d) {
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

    wal.then((data) => {

      const projection = d3.geoAlbersUsa().scale(1280).translate([480, 300]);
      
      const g = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "black");

      g.selectAll("circle")
        .data(data)
        .join("circle")
          .attr("data-idx", d => d.idx)
          .attr("opacity", 0)
          .attr("fill", "red")
          .attr("stroke", "#000")
          .attr("stroke-width", 2)
          .attr("r", 5)
          .attr("transform", d => `translate(${projection(d)})`);

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