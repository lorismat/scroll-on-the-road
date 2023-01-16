<template>
  <div class="flex sticky top-0 sm:w-10/12 mx-auto min-h-screen" id="us-map">
  </div>  
</template>

<script setup>
import * as d3 from 'd3';
import * as topojson from "topojson-client";

import 'intersection-observer'; 
import scrollama from "scrollama";

// global variables
const projectionRoad = d3.geoAlbersUsa().scale(1280).translate([480, 300]);
const pathRoad = d3.geoPath(projectionRoad);

// map utils


// map
function drawMap() {

  const width = 960;
  const height = 600;

  const us = d3.json("/map/10m-min.json",function(d) {
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

      svg
        .append('g')
        .selectAll('rect')
        .data(road)
        .enter()
        .append('path')
        .attr("stroke-dasharray", pathRoad.measure)
        .attr("stroke-dashoffset", pathRoad.measure)
        .attr('d', pathRoad)
        .attr("class", "paths-road")
        .attr("id", (d,i) => `path-idx-${i}`)
        .attr("fill", "transparent")
        //.attr("opacity", 0)
        .attr("stroke-width", 3)
        .attr("stroke", "blue")
      

      const g = svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "black");

      g.selectAll("circle")
        .data(points)
        .join("circle")
        .attr("class", "points-road")
        .attr("data-idx", (d,i) => i )
        .attr("opacity", 0)
        .attr("fill", "green")
        .attr("stroke", "#000")
        .attr("stroke-width", 2)
        .attr("r", 5)
        .attr("transform", (d,i) => `translate(${projectionRoad(d.geometry.coordinates)})`);

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
    progress: true,
    threshold: 1
  })
  
  .onStepProgress((res) => {
    const type = res.element.dataset.type;
    const step = res.element.dataset.step;
    const p = res.progress;

    if ( type == "r" ) {
      const rd = d3.select(`#path-idx-${step}`);
      const distance = rd.attr("stroke-dasharray");
      rd.attr("opacity", 1).attr("stroke-dashoffset", (1-p) * distance );
    } 
    
  })
  .onStepEnter((res) => {

    // full cleaning, to improve
    if (res.index == 0 ) {
      d3.selectAll(".points-road").attr("opacity", 0);
      d3.selectAll(".paths-road").attr("opacity", 0);
    }

    const dir = res.direction;
    const type = res.element.dataset.type;
    const step = res.element.dataset.step;

    // point 
    if ( type == "p" && dir == "down") {
      const pt = document.querySelector(`[data-idx="${step}"]`);
      pt.setAttribute("opacity", 1);
    } else if (type == "p" && dir == "up") {
      const pt = document.querySelector(`[data-idx="${step}"]`);
      pt.setAttribute("opacity", 0);
    }

    /*
    console.log(d3.select("#us-map").node());
    // remove sticky map at the last one
    if (document.querySelector(`[data-idx="${Number(step) + 1}"]`) == null) {
      console.log(d3.select("#us-map"));
    } 
    */
    

  })
  .onStepExit((res) => {
  })
}

watch(() => useState('trigger-scrollama'), (newValue, oldValue) => {
  scrollActions();
})

</script>

<style scoped>
</style>