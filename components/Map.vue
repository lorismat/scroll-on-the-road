<template>
  <div>
    <div class="w-full sm:w-10/12 mx-auto" id="us-map">
    </div> 
    <div class="sm:w-10/12 mx-auto" id="progress-bar"></div>
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
    const nation = topojson.feature(data, data.objects.nation).features;
    const path = d3.geoPath();

    const svg = d3.select("#us-map")
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`);
        
    svg
      .append('g')
      .selectAll('path')
      .data(states)
      .join('path')
      .attr('d', path)
      .attr("fill", "transparent")
      .attr("stroke-width", 1)
      .attr("opacity", 0.1)
      .attr("stroke", "#000");

    svg
      .append('g')
      .selectAll('path')
      .data(nation)
      .join('path')
      .attr('d', path)
      .attr("fill", "transparent")
      .attr("stroke-width", 1)
      .attr("opacity", 1)
      .attr("stroke", "#000");

    return svg
      
  }).then((svg) => {

    road.then((data) => {

      const road = topojson.feature(data, data.objects["Part1-2"]).features;
      let points = topojson.feature(data, data.objects["Part1-1"]).features;

      points = points.filter(d => d.properties.styleUrl != '#icon-ci-10-nodesc');

      
      // marker for arrow
      const defs = svg.append("defs");
      const marker = defs.append("marker")
        .attr("id", "head")
        .attr("orient", "auto-start-reverse")
        .attr("markerWidth", 3)
        .attr("markerHeight", 4)
        .attr("refX", 0.1)
        .attr("refY", 2);

      marker.append("path")
        .attr("d", "M 0 0 V 4 L 3 2 Z")
        .attr("fill", "black")
      

      svg
        .append('g')
        .selectAll('path')
        .data(road)
        .join("path")
        .attr("stroke-dasharray", pathRoad.measure)
        .attr("stroke-dashoffset", pathRoad.measure)
        .attr('d', pathRoad)
        .attr("class", "paths-road")
        .attr("id", (d,i) => `path-idx-${i}`)
        .attr("fill", "transparent")
        .attr("stroke-width", 2)
        .attr("stroke", "#000")

    const g = svg.append('g');

    function circle(selection) {
      selection.append("circle")
        .attr("class", "points-road")
        .attr("data-idx", (d,i) => i )
        .attr("display", "none")
        .attr("fill", "#fff")
        .attr("stroke", "#000")
        .attr("stroke-width", 2)
        .attr("r", 5)
        .attr("transform", (d,i) => `translate(${projectionRoad(d.geometry.coordinates)})`)
    };

    function annotation(selection) {
      selection.append("path")
        .attr("fill", "none")
        .attr("class", "points-road")
        .attr("display", "none")
        .attr("data-ann", (d,i) => i )
        .attr("stroke", "black")
        .attr("d", "M 0 0 C 8 0 11 0 12 12")
        .attr("stroke-width", 2)
        .attr("marker-start", d => projectionRoad(d.geometry.coordinates)[0] >= width/2 ? "url(#head)" : "")
        .attr("marker-end", d => projectionRoad(d.geometry.coordinates)[0] < width/2 ? "url(#head)" : "")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("transform", function(d,i) {
          let coord = projectionRoad(d.geometry.coordinates);
          let x = coord[0];
          let y = coord[1];
          let tr;
          if (x > width/2) {
            tr = `translate(${x + 15} ${y - 15}) rotate(-45 0 0)`;
          } else {
            tr = `translate(${x - 30} ${y - 15}) rotate(-45 0 0)`;
          }
          return tr
        })
    };

    g.selectAll("g")
      .data(points)
      .join("g")
      .call(circle)
      .call(annotation)

    })
  })
}

const widthProgressBar = 960;

function progressBar() {

  
  const height = 5;

  const svg = d3.select("#progress-bar")
    .append("svg")
    .attr("viewBox", `0 0 ${widthProgressBar} ${height}`);

  svg.append("rect")
    .attr("id", "progress-bar-rect")
    .attr("width", 0)
    .attr("height", height)
    .attr("x", 0)
    .attr("y", 0)
    .attr("fill", "#000")
    .attr("opacity", 0.2)

}

onMounted(() => {
  drawMap();
  progressBar();
})

// scrolling
// instantiate the scrollama
const scroller = scrollama();
const scrollerWhole = scrollama();


function scrollActions() {

  scrollerWhole
    .setup({
      step: ".whole-scroll",
      progress: true,
      threshold: 4
    })
    
    .onStepProgress((res) => {
      d3.select("#progress-bar-rect").attr("width", res.progress*widthProgressBar);
    })


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
        d3.selectAll(`[data-ann]`).attr("display", "none");
        const rd = d3.select(`#path-idx-${step}`);
        const distance = rd.attr("stroke-dasharray");
        rd.attr("opacity", 1).attr("stroke-dashoffset", (1-p) * distance );
      } 
      
    })
    .onStepEnter((res) => {

      // full cleaning, to improve
      if (res.index == 0 ) {
        d3.selectAll(".points-road").attr("display", "none");
        d3.selectAll(".paths-road").attr("opacity", 0);
      }

      const dir = res.direction;
      const type = res.element.dataset.type;
      const step = res.element.dataset.step;

      // point 
      if ( type == "p" && dir == "down") {
        const pt = document.querySelector(`[data-idx="${step}"]`);
        const ann = document.querySelector(`[data-ann="${step}"]`);
        pt.setAttribute("display", "visible");

        // clean all
        d3.selectAll(`[data-ann]`).attr("display", "none");
        ann.setAttribute("display", "visible");

      } else if (type == "p" && dir == "up") {
        const pt = document.querySelector(`[data-idx="${step}"]`);
        const ann = document.querySelector(`[data-ann="${step-1}"]`);
        pt.setAttribute("display", "none");

        // clean all
        d3.selectAll(`[data-ann]`).attr("display", "none");
        ann.setAttribute("display", "visible");
      }


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