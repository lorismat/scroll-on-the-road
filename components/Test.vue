<template>
  <div>
    test red {{ t }}

    <!--you don't need the "data-step" attr, but can be useful for storing instructions for JS -->
    <div class="step min-h-screen" data-step="a">
      a
    </div>
    <div class="step min-h-screen" data-step="b">
      b
    </div>
    <div class="step min-h-screen" data-step="c">
      c
    </div>

  </div>
</template>

<script setup>
import * as d3 from 'd3';
import anime from 'animejs';
import scrollama from "scrollama"; // or...

const t = "hey";

function test() {

  /*

  console.log(d3.selectAll("div"));

  anime({
    targets: 'div',
    translateX: 250,
    rotate: '1turn',
    backgroundColor: '#FFF',
    duration: 800
  });

  */

  // instantiate the scrollama
  const scroller = scrollama();

  // setup the instance, pass callback functions
  scroller
    .setup({
      step: ".step",
      debug: true, 
      offset: 0.3
    })
    .onStepEnter((res) => {
      console.log("enter", res);
    })
    .onStepExit((res) => {
      console.log("exit", res);
    });

}

onMounted(() => {
  test();
})

</script>

<style scoped>
div {
  color:red;
}
</style>
