<template>
  <div class="mx-auto">
    <h1 class="font-serif text-4xl sm:text-2xl md:text-8xl text-center">On The Road</h1>
    <h2 class="font-serif text-lg sm:text-2xl md:text-3xl text-center">An Interactive Map of Jack Kerouac's journey</h2>
    <div class="text-sm sm:text-base p-2 py-6 md:p-12 max-w-lg mx-auto">
      <p id="type-intro" class="font-type">
        <span class="letters opacity-0" v-for="(l, idx) in textString" :id="`letter-${idx}`" >{{ l }}</span>
      </p>
      <div id="signature" class="invisible font-serif py-2 text-right italic">— Jack Kerouac</div>
    </div>
    <div id="scroll-roll" class="sm:p-8 pt-2 pb-2 invisible">
      <Arrow />
    </div>
    
  </div>
</template>

<script setup>
import anime from 'animejs';
import Arrow from '@/assets/svg/arrow.svg';

const trigger = useState('trigger');

const textString = `
And this was really the way 
that my whole road experience began 
and the things that were to come are too fantastic not to tell.`.split('');

const test = false;

onMounted(() => {
  const sig = document.getElementById("signature");
  const scroll = document.getElementById("scroll-roll");

  if (!test) {
    anime({
      targets: '.letters',
      opacity: 1,
      delay: anime.stagger(10 + 20 * Math.random()),
      complete: function() {
        sig.classList.remove("invisible");
        setTimeout(() => {
          scroll.classList.remove("invisible");
          trigger.value = true;
        }, 500);
      }
    });
  } else {
    sig.classList.remove("invisible");
    scroll.classList.remove("invisible");
    trigger.value = true;
  }
})

</script>

