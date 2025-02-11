<template>

  <banner-carousel></banner-carousel>
  <RouterView></RouterView>


  <BarraCategorias class="categories"></BarraCategorias>

  <div class="grid">
    <div class="sidebar">
      <Sidebar></Sidebar>
    </div>
    <!-- <MenuSection></MenuSection> -->
    <MenuSectionCotizar></MenuSectionCotizar>

    <Resumen></Resumen>
  </div>


</template>

<script setup>
import BannerCarousel from '@/components/BannerCarousel.vue';
import BarraCategorias from '@/components/BarraCategorias.vue';
import MenuSection from './MenuSection.vue';
import Sidebar from '@/components/Sidebar.vue';
import Resumen from './resumen.vue';
import MenuSectionCotizar from './MenuSectionCotizar.vue';
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: max-content 1fr max-content;
}


@media (width < 1100px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .sidebar {
    display: none;
  }

}
</style>
