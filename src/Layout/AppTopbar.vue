<template>
  <div
    style="display: flex;justify-content: end;background-color: var(--p-primary-color); padding: 0rem 1rem ;gap: 0rem; width: 100%;">
    <a :href="i.href" v-for="i in socialLinks">
      <Button size="small" class="social-btn" style="color: white;" text> <i style="color: white;font-weight: bold;"
          :class="i.icon">
        </i>
      </Button>
    </a>
  </div>



  <div class="container" :class="barraClase">

    <div class="section-logo section">
      <div class="section-logo--buttons">
        <img style="cursor: pointer;height: 3rem;" @click="router.push('/')"
          :class="route.fullPath == '/menu' ? 'logo2' : 'logo'" :src="`${URI}/read-photo-product/iX6UiE6e`" alt="Logo" />
      </div>


   <i class="pi pi-map-marker" @click="siteStore.visibles.currentSite = true"></i>
  <div class="site-info" @click="siteStore.visibles.currentSite = true">

        <div class="site-info-status">
          <!-- <span class="city-name">{{ siteStore.location?.city?.city_name }}</span> -->
          <!-- <Tag v-if="siteStore.status?.status == 'open'" class="status-tag">Abierto</Tag>
          <Tag v-else-if="siteStore.status?.status" class="closed-tag">Cerrado</Tag> -->
          <Tag  class="closed-tag"> Cambiar sede</Tag>
        </div>
        <div class="site-info-name" v-if="siteStore.location?.site?.site_id" style="width: 100%;overflow: hidden;">
          <h5 class="city-name" style="width: 100%; overflow: hidden; max-width: 120rem;">  {{ siteStore.location?.site.site_name?.split(' ').slice(0,2).join(' ') }}</h5>
        </div>
      </div>
    </div>

    <!-- Información para dispositivos móviles -->
    <!-- <div class="site-info-movil">
      <div class="site-info-status">
        <i class="pi pi-map-marker"></i>
        <span class="city-name">Cali</span>
        <Tag class="status-tag">Abierto</Tag>
      </div>
      <div class="site-info-name">
        <span class="city-name"> Sede - Chapinero</span>
      </div>
    </div> -->

    <!-- Menú de Navegación Principal -->
    <div class="section-menu section">
      <RouterLink v-for="button in buttons" :to="button.to" :key="button.name">
        <Button v-random-hover-color="{ opacity: .3 }" class="button-nav"
          :class="isButtonActive(button) ? 'active' : ''" :label="button.name"></Button>
      </RouterLink>
    </div>

    <!-- Icono del Carrito de Compras -->
    <div class="section-men secion">
      <!-- <RouterLink to="/cart">
        <Button text>
          <i class="pi pi-shopping-cart"></i>
        </Button>
      </RouterLink> -->

      <Button id="bars" text @click="toggleMobileMenu">
        <b style="pointer-events: none;"><i class="pi pi-bars"></i></b>
      </Button>
    </div>


    <div v-if="mobileMenuVisible" id="mobileMenuVisible" style=" transition: all ease 0s;" class="mobile-menu">
      <RouterLink v-for="button in buttons" :to="button.to" :key="button.name">
        <Button v-random-hover-color="{ opacity: .9 }" :icon="button.icon"
          style="color: white;width: 100%;justify-content: start; margin: .5rem 0;" class="button-nav"
          :class="isButtonActive(button) ? 'active' : ''" :label="button.name" @click="toggleMobileMenu"></Button>
      </RouterLink>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Button, Tag } from 'primevue';
import router from '@/router';
import { useSitesStore } from '@/store/site';
import { fetchService } from '@/service/utils/fetchService';
import { URI } from '@/service/conection';



import { usecartStore } from '@/store/shoping_cart';

const cart = usecartStore()

const siteStore = useSitesStore()


const route = useRoute();

onMounted(async () => {
  const site_id = siteStore.location.site?.site_id
  const pe_id = siteStore.location.site?.pe_site_id || 1
  // const status = await fetchService.get(`${URI}/site/${site_id}/status`)
  // if (status) {
  //   siteStore.status = status
  // }
  // cart.menu = await fetchService.get(`${URI}/get-product-integration/6149/${pe_id}/status`)
})

const socialLinks = [
  {
    icon: 'pi pi-facebook',
    href: 'https://www.facebook.com/share/167f3dboiG/?mibextid=wwXIfr'
  },
  {
    icon: 'pi pi-instagram',
    href: 'https://www.instagram.com/distrimonster1/?igsh=YmVudWxwOGVzdTV5&utm_source=qr#'
  },
  {
    icon: 'pi pi-whatsapp',
    href: 'https://api.whatsapp.com/send?phone=573172988238'
  },
  {
    icon: 'pi pi-youtube',
    href: 'https://youtube.com/@distrimonster?si=9mDymzJxpvVqeslj'
  }
];


// Definir los botones de navegación
const buttons = [
  { name: 'Domicilios', to: '/', icon: 'fa-solid fa-bars' },
  { name: 'Sedes', to: '/sedes', icon: 'fa-solid fa-building' },
  { name: 'Precios de la semana', to: '/menu', icon: 'fa-solid fa-list' },
  // { name: 'mi cotizacion', to: '/cotizacion', icon: 'fa-solid fa-list' },

  { name: 'Rastrear Pedido', to: '/rastrear-pedido', icon: 'fa-solid fa-truck' },
  // { name: 'Franquicias', to: '/franquicias', icon: 'fa-solid fa-store' },
  // { name: 'Ayuda/PQR', to: '/pqrs-user', icon: 'fa-solid fa-question-circle' },
  // { name: 'Colaboraciones', to: '/colaboraciones', icon: 'fa-solid fa-music' },
  // { name: 'Sonando', to: '/sonando', icon: 'fa-solid fa-music' },

  // Puedes agregar más botones según sea necesario
];

// Función para determinar si un botón está activo


const isButtonActive = (button) => route.fullPath === button.to;





// Mapeo de rutas a clases de estilo
const estilosPorRuta = {
  '/': 'barra-clara',
  '/sedes': 'barra-clara',
  '/menu': 'barra-carta',
  '/rastrear-pedido': 'barra-clara',
  '/franquicias': 'barra-clara',
  '/pqrs-user': 'barra-clara',
  '/hola': 'barra-clara',
  '/sonando': 'barra-oscura',
  '/pqrs-user': 'barra-oscura',
  '/colaboraciones': 'barra-oscura'


  // Añade más rutas y sus clases correspondientes aquí
};

// Propiedad computada para la clase de la barra
const barraClase = computed(() => estilosPorRuta[route.fullPath] || 'barra-clara');

// Estado para el menú móvil
const mobileMenuVisible = ref(false);

const addEvent = () => [
  document.addEventListener('click', validate)
]

const validate = (e) => {
  // console.log(e.target)
  if (e.target.id != 'mobileMenuVisible' && e.target.id != 'bars') {
    mobileMenuVisible.value = false
  }

  // console.log(e.target.id)
}

onMounted(() => {
  addEvent()
})

// Función para alternar el menú móvil
const toggleMobileMenu = () => {
  mobileMenuVisible.value = !mobileMenuVisible.value;
};
</script>

<style scoped>
.container {
  height: 3.5rem;
  /* overflow: hidden; */
  padding: 0 3rem;
  display: flex;
  position: sticky;
  z-index: 999;
  top: 0;
  justify-content: space-between;
  box-shadow: 0 1rem 1rem #00000040;
  background-color: var(--p-secondary-color);
  align-items: center;
  max-width: 100vw;
}

/* Estilos para la barra clara */
.barra-clara {
  /* background-color: white; */
  color: black;
  /* Texto negro en barra-clara */
}

/* Estilos para la barra oscura */
.barra-oscura {
  background-color: rgba(0, 0, 0, 0.736);
  color: white;
  /* Texto blanco en barra-oscura */
}

/* Asegura que todos los textos dentro de barra-oscura sean blancos */
.barra-oscura .city-name,
.barra-oscura .requested-by,
.barra-oscura .button-nav,
.barra-oscura i {
  color: white;
}

.barra-sedes .city-name,
.barra-sedes .requested-by,
.barra-sedes .button-nav,
.barra-sedes i {
  color: white;
}

.barra-carta .city-name,
.barra-carta .requested-by,
.barra-carta .button-nav,
.barra-carta i {
  color: white;

}

.social-btn:hover {
  background-color: black;
  border-radius: 0%;
}

.logo2 {
  /* filter: saturate(0) brightness(100); */
  height: 50%;

}

.button-nav {
  min-width: max-content;
}

.barra-sedes {
  background-color: rgba(0, 0, 0, 0.736);
  color: white;
}

.city-name {
  margin-right: 1rem;
}

.barra-carta {
  background-color: var(--p-primary-color);
  color: white;
}

/* Secciones generales */
.section {
  display: flex;
  align-items: center;
}

/* Información para dispositivos móviles */
.site-info-movil {
  align-items: center;
  display: none;
}

.site-info {
  cursor: pointer;
}

/* Menú móvil (visualmente oculto por defecto) */
.mobile-menu {
  position: absolute;
  top: 3.5rem;
  /* z-index: 3000; */
  right: 0;
  /* background-color: rgba(0, 0, 0, 0.7); */
  background-color: var(--p-primary-color);
  width: 100%;
  max-width: 20rem;
  display: flex;
  flex-direction: column;
  /* border-radius: 0 0 0rem 1rem; */
  z-index: 999999999999999;
  padding: 1rem 1rem;
  /* box-shadow: 0rem 1rem 1rem rgba(0, 0, 0, 0.3); */
  /* min-height: 100vh; */
  max-height: min-content;

  /* pointer-events: hover; */
}

/* Responsividad */
@media (max-width: 1300px) {
  .section {
    display: none;
  }

  .container {
    padding: 0 1rem;
    /* position: relative; */
  }

  .site-info-movil {
    display: flex;
  }
}

/* Estilos del logo */
.section-logo {
  height: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo {
  height: 50%;
}

/* Estilos de iconos */
i {
  font-size: x-large;
  color: var(--p-primary-color);
}

/* Botones en la sección del logo */
.section-logo--buttons {
  display: flex;
  align-items: center;
  height: 100%;
  gap: 0.9rem;
}

/* Estilos de las etiquetas de estado */
.status-tag {
  padding: 0 1rem;
  animation: anim_status_tag infinite .5s;
  color: black;
  background-color: rgb(119, 255, 0);

}

.closed-tag {
  padding: 0 .5rem;
  animation: anim_status_tag_closed infinite .5s;
  color: rgb(255, 255, 255);
  background-color: rgb(255, 0, 0);

}

@keyframes anim_status_tag {
  20% {
    background-color: rgb(119, 255, 0);
  }

  50% {
    background-color: yellow;
  }

  80% {
    background-color: rgb(0, 255, 140);
  }
}

@keyframes anim_status_tag_closed {
  20% {
    background-color: rgb(255, 0, 0);
  }

  50% {
    background-color: rgb(255, 0, 0);
  }

  80% {
    background-color: rgb(255, 0, 0);
    transform: scale(1.05);
  }


}

/* Nombre de la ciudad */
.city-name {
  /* Hereda el color del contenedor */
}

/* Estilos de los botones de navegación */
.button-nav {
  border: none;
  border-radius: 0;
  color: black;
  /* Hereda el color del contenedor */
  background-color: transparent;
  height: calc(100% - 0.8rem);
  /* transition: box-shadow 0.3s, color 0.3s; */
}



.active {
  box-shadow: 0 0.5rem var(--p-primary-color);
  /* color: var(--p-primary-color); */
  /* font-weight: bold; */
}

/* Asegura que los botones activos en barra-oscura tengan texto blanco */
.barra-oscura .button-nav.active {
  color: white;
}
</style>
