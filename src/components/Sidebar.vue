<template>
  <div ref="categoryBar" style="position: sticky; 
              box-shadow: 0 1rem .5rem #00000020;
              top: 3.5rem; 
              /* padding: .2rem;  */
              z-index: 999; 
              background-color: var(--p-secondary-color);
              overflow-y: auto; 
              max-height: calc(100vh - 3.5rem);">
    <div class="container">
      <div v-for="(section, index) in filteredAndSortedCategories" :key="section.categoria_id"
        :id="'categoryButton-' + section.categoria_id" class="container-button">
        <a @click.prevent="smoothScrollTo(section.categoria_id)">
          <Button class="bar-button" :class="{ selected: cart.currentSection === section.categoria_id }"
            :label="section.categoria_descripcion">
            <img
              :src="`${URI}/get-image?image_url=${cart?.menu?.data?.find(p => p.categoria_id == section.categoria_id)?.productogeneral_urlimagen}`"
              alt="" />
            <h3 style="text-transform: uppercase;font-weight:600;">{{ section.categoria_descripcion }}</h3>
          </Button>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, computed } from 'vue'
import { usecartStore } from '../store/shoping_cart'
import { Button } from 'primevue'
import { URI } from '@/service/conection'

// Store
const cart = usecartStore()

// Orden personalizado de las categorías (IDs)
const codigos = [10, 26, 8, 9, 13, 27, 11, 4, 5]

// Filtra y ordena las categorías con base en 'codigos'
// (aquí debes implementar la lógica real de orden con tu array `codigos` si deseas un orden específico)
const filteredAndSortedCategories = computed(() => {
  return cart?.menu?.listaCategorias
    ?.filter(c => c)
    ?.sort((a, b) => {
      // IMPLEMENTA TU LÓGICA DE ORDEN AQUÍ:
      // Ejemplo: usa el índice de cada id en `codigos` para ordenar
      const indexA = codigos.indexOf(a.categoria_id)
      const indexB = codigos.indexOf(b.categoria_id)
      // Si no está en `codigos`, lo mandas al final
      return (indexA === -1 ? 9999 : indexA) - (indexB === -1 ? 9999 : indexB)
    })
})

/**
 * Desplaza suavemente el contenido principal hasta la sección
 * y actualiza cart.currentSection para que se marque como activa
 */
const smoothScrollTo = (categoryId) => {
  // ----- SCROLL VERTICAL (al contenido) -----
  const element = document.getElementById(categoryId)
  if (element) {
    const offset = 10 * 16
    const elementY = element.getBoundingClientRect().top + window.pageYOffset
    const targetPosition = elementY - offset

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    })
  }

  // Marcar sección como activa
  cart.currentSection = categoryId
}

onBeforeUnmount(() => {
  // limpia observadores si los usas
})

</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  /* padding: 0 1rem; */
  gap: 0.5rem;
  padding: 2rem .5rem 5rem 0.5rem;
}

/* Ajustamos para que el botón ocupe el 100% */
.container-button {
  background-color: rgba(255, 255, 255, 0.685);
  border-radius: .5rem;

  width: 100%;
}

/* El Button se extiende a lo ancho */
.bar-button {
  width: 100%;
  background-color: #00000000;
  color: #000000;
  text-align: left;
  text-transform: capitalize;
  border: none;
  display: flex;
  /* padding: 1rem 1rem; */
  justify-content: start;
  /* opcional, si quieres el texto alineado a la izquierda */
  border-radius: 0;
  text-transform: capitalize;
  /* opcional, sin bordes redondeados */
}

.bar-button:hover {
  background-color: var(--p-primary-color);
  color: #fff;
}

.selected {
  background-color: var(--p-primary-color);
  color: #fff;
}

img {
  height: 2rem;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 50%;
}
</style>
