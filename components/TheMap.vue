<template>
  <div>
    <div class="w-full sm:w-10/12 mx-auto" id="us-map">
    </div> 
    <div class="sm:w-10/12 mx-auto text-xs py-4 sm:py-0 sm:text-base">
      <div class="text-gray-400">roll progress ({{ progress }}%)</div>
      <div id="progress-bar"></div>
    </div>
  </div>
   
</template>

<script setup>

/* 

TO IMPROVE:
- active section on progress 
- chaining promises

TO ADD:
- color/symbol code for different sections
- Map of mexico

*/ 

import * as d3 from 'd3';
import * as topojson from "topojson-client";

import 'intersection-observer'; 
import scrollama from "scrollama";

const projectionRoad = d3.geoAlbersUsa().scale(1280).translate([480, 300]);
const pathRoad = d3.geoPath(projectionRoad);

function drawMap() {
  const width = 960;
  const height = 600;
  const us = d3.json("/map/us-min.json",function(d) {
    return d;
  })
  const road = d3.json("/map/itinerary.json", function(d) {
    return d;
  })

  // draw map
  us.then((data) => {
    
    const states = topojson.feature(data, data.objects.states).features.filter(d => d.id !== "02" && d.id !== "15" ); // removing Hawaï / Alaska 
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

    // draw roads and points
    road.then((data) => {

      data.objects["poly"] = { type: "GeometryCollection", geometries: [] };
      data.objects["points"] = { type: "GeometryCollection", geometries: [] };

      // merge poly and points from itinerary.json
      for (let [key, value] of Object.entries(data.objects)) {
        if (key.split('-')[1] == 'points') {
          value.geometries.forEach(e => data.objects["points"].geometries.push(e));
        }
        else if (key.split('-')[1] == 'poly') {
          const idx = key.split('-')[0] - 1;
          value.geometries.forEach(e => {
            e.properties.book = idx;
            data.objects["poly"].geometries.push(e);
          });
        }
      }

      let road = topojson.feature(data, data.objects["poly"]).features;
      let points = topojson.feature(data, data.objects["points"]).features;

      // removing every double point caused by GoogleMyMaps limits to 10 points per road
      points = points.filter(d => d.properties.styleUrl != '#icon-ci-10-nodesc');

      // marker for arrow annotation
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
      
      // creating roads
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
        .attr("data-book-idx", (d,i) => d.properties.book)
        .attr("fill", "transparent")
        .attr("stroke-width", 0)
        .attr("stroke", "#fff")
        .attr("stroke-linecap", "round")

    const g = svg.append('g');

    function circle(selection) {
      selection.append("circle")
        .attr("class", "points-road")
        .attr("data-idx", (d,i) => i )
        .attr("display", "none")
        .attr("fill", "#fff")
        .attr("stroke", "#ccc")
        .attr("stroke-width", 2)
        .attr("r", 5)
        .attr("transform", (d,i) => `translate(${projectionRoad(d.geometry.coordinates)})`)
        
    };

    function annotation(selection) {
      selection.append("path")
        .attr("fill", "none")
        .attr("class", "points-road")
        .attr("display", "none")
        .attr("data-annotation", (d,i) => i )
        .attr("stroke", "black")
        .attr("d", "M 0 0 C 8 0 11 0 12 12")
        .attr("stroke-width", 2)
        .attr("opacity", d => projectionRoad(d.geometry.coordinates) != null ? 1 : 0)
        .attr("marker-start", function(d) {
          if (projectionRoad(d.geometry.coordinates) != null) {
            return projectionRoad(d.geometry.coordinates)[0] >= width/2 ? "url(#head)" : "";
          }
        })
        .attr("marker-end", function(d) {
          if (projectionRoad(d.geometry.coordinates) != null) {
            return projectionRoad(d.geometry.coordinates)[0] < width/2 ? "url(#head)" : "";
          }
        })
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("transform", function(d,i) {
          if (projectionRoad(d.geometry.coordinates) != null) {
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
          }
        })
    };

    // creating points and annotations
    g.selectAll("g")
      .data(points)
      .join("g")
      .call(circle)
      .call(annotation)

    })
  })
}

const widthProgressBar = 960;
const progress = ref(0);

function progressBar() {
  const height = 2;
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
const scroller = scrollama();
const scrollerWhole = scrollama();

function scrollActions() {

  // scroller for progress bar
  scrollerWhole
    .setup({
      step: ".whole-scroll",
      progress: true,
      threshold: 10
    })
    
    .onStepProgress((res) => {
      d3.select("#progress-bar-rect").attr("width", res.progress*widthProgressBar);

      progress.value = Math.round(res.progress * 100);

      // active section
      function fetchIndx(x) {
        if (x < 0.366) {
          return 0
        } else if (x < 0.639) {
          return 1
        } else if (x < 0.83) {
          return 2
        } else {
          return 3
        }
      };

      d3.selectAll(".section-link").attr("class", "section-link");
      d3.selectAll(".paths-road")
        .attr("stroke-width", 2)
        .attr("stroke", "#ccc")
        ;

      d3.select(`#section-link-${fetchIndx(res.progress)}`)
        .attr("class", `section-link border-b-2 border-black`);

      d3.selectAll(`[data-book-idx="${fetchIndx(res.progress)}"]`)
        .attr("stroke-width", 4)
        .attr("stroke", "#111")
        ;

    })

  // scroller for slides
  scroller
    .setup({
      step: ".step",
      progress: true,
      threshold: 1,
      offset: 0.6
    })
    
    // progress for roads
    .onStepProgress((res) => {
      // identify section / road / point
      const type = res.element.dataset.type;
      const step = res.element.dataset.step;
      const p = res.progress;
      const len = document.querySelectorAll(".paths-road").length;

      if ( type == "r" ) {
        for (let i = 0; i<len; i++) {
          const rd = d3.select(`#path-idx-${i}`);
          const distance = rd.attr("stroke-dasharray");

          // remove annotations
          d3.selectAll(`[data-idx]`).attr("display", "none");
          d3.selectAll(`[data-annotation]`).attr("display", "none");

          if (i < step) {
            rd.attr("stroke-dashoffset", 0 )
              // .attr("stroke", "#000")
              // .attr("stroke-width", 2)
              ;
          } else if (i == step) {
            rd.attr("stroke-dashoffset", (1-p) * distance )
              // .attr("stroke", "#000")
              // .attr("stroke-width", 3)
              ;
          } else {
            rd.attr("stroke-dashoffset", distance )
              // .attr("stroke", "#bbb")
              // .attr("stroke-width", 2)
              ;
          } 
        }        
      } 
      
    })

    // enter for points
    .onStepEnter((res) => {
      const dir = res.direction;
      const type = res.element.dataset.type;
      const step = res.element.dataset.step;

      // point 
      if ( type == "p" && dir == "down") {
        d3.selectAll(`[data-idx]`)
          .attr("display", (d,i) => i == step ? "visible": "none")
          .attr("stroke", (d,i) => i < step ? "#ccc" : "#000");

        // annotations
        d3.selectAll(`[data-annotation]`).attr("display", "none");
        d3.select(`[data-annotation="${step}"]`).attr("display", "visible");

      } else if (type == "p" && dir == "up") {
        d3.selectAll(`[data-idx]`)
          .attr("display", (d,i) => i+1 == step ? "visible": "none")
          .attr("stroke", (d,i) => i+1 < step ? "#ccc" : "#000");

        // annotations
        d3.selectAll(`[data-annotation]`).attr("display", "none");
        d3.select(`[data-annotation="${step-1}"]`).attr("display", "visible");
      }
    })
}

watch(() => useState('trigger-scrollama'), () => {
  scrollActions();
})

</script>