<template>
  <div class="p-1 my-5 md:my-0 col-12">
    <!-- Contenedor principal “Resumen” -->
    <div class="sticky-summary col-12 p-3 m-0">
      <h5><b>Resumen</b></h5>

      <div v-if="route.fullPath.includes('pay') || route.fullPath.includes('gracias')">
        <b> fecha de entrega:</b>
        {{ store.delivery_horaentrega }}
      </div>

      <div v-if="route.fullPath.includes('pay') || route.fullPath.includes('gracias')">
        <b> Lugar de entrega:</b>
        {{ siteStore.location?.site?.site_address }}
        sede
        {{ siteStore.location?.site?.site_name }}
      </div>

      <h5><b>Productos</b></h5>

      <!-- Lista de productos -->
      <div
        v-for="product in store.cart"
        :key="product.productogeneral_id"
      >
        <div class="mb-0 pb-0 product-line">
          <div class="col-6 py-2 mb-0 m-0">
            <h6 class="m-0">
              <span class="span-minwidth">
                ( {{ product.pedido_cantidad.toFixed(1) }} {{ product.unit_measure }} )
              </span>
              <span style="font-weight: 400;">
                {{ product.pedido_nombre_producto }}
                ( {{ (product.pedido_cantidad / product.presentacion).toFixed(0) }}
                {{ product.presentation_unit_measure }}s )
              </span>
            </h6>

            <h6
              class="m-0 ml-3"
              style="margin-left: 1rem;"
              v-for="i in product.lista_productocombo"
              :key="i.producto_id"
            >
              ( {{ product.pedido_cantidad }} )
              <b style="margin-right: .5rem;">{{ parseInt(i.pedido_cantidad) }}</b>
              <span class="font-weight-400">{{ i.pedido_nombre }}</span>
            </h6>
          </div>

          <div class="col-6 my-0 text-right py-2">
            <h6 class="text-end">
              {{ formatoPesosColombianos(calcularPrecioProducto(product)) }}
            </h6>
          </div>
        </div>

        <!-- Modificadores/adiciones -->
        <div
          class="addition-item"
          v-for="item in product.modificadorseleccionList"
          :key="item"
        >
          <div class="addition-item-inner">
            <span class="text adicion">
              <span>
                <b>- ( {{ product.pedido_cantidad }} ) {{ item.modificadorseleccion_cantidad }}</b>
              </span>
              {{ item.modificadorseleccion_nombre }}
            </span>
            <span v-if="item.pedido_precio > 0" class="pl-2 text-sm">
              <b>
                {{
                  formatoPesosColombianos(
                    item.pedido_precio * item.modificadorseleccion_cantidad * product.pedido_cantidad
                  )
                }}
              </b>
            </span>
          </div>
        </div>

        <div class="py-3 my-3" style="width: 100%; border-top: .2rem dashed; margin: .5rem 0;"></div>
      </div>

      <!-- Subtotales y totales -->
      <div class="grid summary-grid">
        <div class="col-6 my-0 py-0">
          <span><b>Subtotal</b></span>
        </div>
        <div class="col-6 my-0 text-right py-0 text-end">
          <span><b>{{ formatoPesosColombianos(store.cartTotal) }}</b></span>
        </div>

        <div class="col-6 my-0 py-0">
          <span>
            <b>
              Domicilio
              <span style="color: var(--p-primary-color)">
                <span
                  style="min-width: max-content;"
                  v-if="deliveries[siteStore.location.site?.city_id] > 0"
                >
                  ($ {{ deliveries[siteStore.location.site?.city_id] }} por kilo)
                </span>
                <span v-else>
                  No aplica
                </span>
              </span>
            </b>
          </span>
        </div>
        <div class="col-6 my-0 text-right py-0 text-end">
          <span><b>{{ formatoPesosColombianos(totalProductos) }}</b></span>
        </div>

        <div class="col-6 my-0 py-0">
          <span><b>Total</b></span>
        </div>
        <div class="col-6 my-0 text-right py-0 text-end">
          <span>
            <b>{{ formatoPesosColombianos(store.cartTotal + totalProductos) }}</b>
          </span>
        </div>
      </div>

      <!-- Botones de navegación y acciones -->
      <!-- Botón “Volver al menú” -->
      <router-link to="/" v-if="route.path.includes('cart')">
        <Button
          outlined
          icon="pi pi-shopping-cart"
          label="Volver al menu"
          class="mt-4 button-common button-transparent button-fullwidth button-bold"
          severity="danger"
        />
      </router-link>

      <!-- Botón “Volver al carrito” -->
      <router-link to="/cart" v-else-if="route.path != '/reservas'">
        <Button
          outlined
          icon="pi pi-arrow-left"
          label="Volver al carrito"
          class="mt-4 button-common button-transparent button-fullwidth button-bold"
          severity="danger"
        />
      </router-link>

      <!-- Botón “Pedir” (ejemplo de reservas) -->
      <router-link
        to="/pay"
        v-if="route.path.includes('cart') && (siteStore.status?.status !== 'closed' && route.path == '/reservas')"
      >
        <Button
          iconPos="right"
          icon="pi pi-arrow-right"
          label="Pedir"
          class="mt-2 button-common button-black button-fullwidth button-bold button-no-border button-no-outline"
          severity="help"
        />
      </router-link>

      <!-- Botón “Finalizar pedido” (ir a /pay) -->
      <router-link to="/pay" v-else-if="route.path == '/cart'">
        <Button
          iconPos="right"
          icon="pi pi-arrow-right"
          label="Finalizar pedido"
          class="mt-2 button-common button-black button-fullwidth button-bold button-no-border button-no-outline"
          severity="help"
        />
      </router-link>

      <!-- BOTÓN QUE USA LA PASARELA DE EPAYCO -->
      <Button
        :disabled="reportes.loading.visible"
        v-else-if="route.path == '/pay' && !reportes.loading.visible"
        @click="payWithEpayco"
        iconPos="right"
        icon="pi pi-arrow-right"
        label="Pagar con Epayco"
        class="mt-2 button-common button-black button-fullwidth button-bold button-no-border button-no-outline"
        severity="help"
      />
    </div>
  </div>
</template>

<script setup>
import { formatoPesosColombianos } from '@/service/utils/formatoPesos';
import { usecartStore } from '@/store/shoping_cart';
import { useSitesStore } from '@/store/site';
import { useRoute } from 'vue-router';
import { onMounted, ref, watch, computed } from 'vue';
import { useUserStore } from '@/store/user';
import { Button } from 'primevue';
import { Tag } from 'primevue';
import { useReportesStore } from '@/store/ventas';

const reportes = useReportesStore();
const route = useRoute();
const store = usecartStore();
const siteStore = useSitesStore();
const user = useUserStore();

const sending = ref(false);

// Costos de envío (ejemplo)
const deliveries = {
  "8": 350,  // Bogotá
  "9": 500,  // Medellín
  "10": 0,   // Cali
  "11": 0,   // Palmira
  "13": 0,   // Jamundí
  "15": 0,   // New Jersey - EE.UU
  "14": 0    // Yumbo
};

// Cálculo de domicilio en función de kilos multiplicado por la tarifa
const totalProductos = computed(() => {
  if (siteStore.location.site.city_id == 10) {
    return 0; // Ejemplo: Cali no cobra domicilio
  }
  return store.cart.reduce((acc, item) => {
    return (
      acc +
      deliveries[`${siteStore.location.site?.city_id}`] *
      item.pedido_cantidad *
      item.kilos_delivery
    );
  }, 0);
});

// Función para calcular el precio unitario según cantidad
const calcularPrecioProducto = (product) => {
  const cantidad = product.pedido_cantidad;
  if (cantidad >= 1000) {
    return product.distribuidor * cantidad;
  } else if (cantidad >= 500) {
    return product.mayor * cantidad;
  } else {
    return product.pedido_precio * cantidad;
  }
};

/**
 * No cargamos el script de ePayco dinámicamente,
 * porque ya está incluido en 'index.html'.
 * Solo validamos que esté disponible.
 */

const payWithEpayco = () => {
  // Verificamos que el objeto ePayco esté disponible en window
  if (!window.ePayco) {
    console.error("Epayco script no se ha cargado o no está disponible");
    return;
  }

  // Configuramos el Checkout
  const handler = window.ePayco.checkout.configure({
    key: '19f27e6b07849610b188d4f6997541a2',  // Reemplaza con tu Public Key real
    test: true,                              // true = pruebas, false = producción
    response_type: 'redirect',
    onClosed: function () {
      console.log("Modal de Epayco cerrado");
    }
  });

  // Calcular total a pagar
  const totalAPagar = store.cartTotal + totalProductos.value;

  // Abrimos el modal con los datos necesarios
  handler.open({
    name: "Tu pedido",
    description: "Compra en nuestro restaurante",
    amount: totalAPagar,
    currency: "cop",
    invoice: "ORDER-" + Date.now(), // ID único (puedes ajustar a tu lógica)
    tax_base: "0",
    tax: "0",
    country: "co",
    lang: "es",
    external: "false",
    confirmation: "https", // Ajusta con tu backend
    response: "https://distrimonster.com/gracias"      // URL de respuesta final
  });
};



</script>

<style scoped>
/* --- Clases nuevas para reemplazar estilos en línea --- */

/* Contenedor “sticky” del resumen */
.sticky-summary {
  position: sticky;
  padding: 1rem;
  max-height: min-content;
  background-color: white;
  box-shadow: 0 1rem 1rem #00000020;
  top: 5rem;
  border-radius: 0.5rem;
  z-index: 1000;
}

/* Línea de cada producto (display: flex; justify-content: space-between) */
.product-line {
  display: flex;
  justify-content: space-between;
  gap: 3rem;
}

/* Span con min-width */
.span-minwidth {
  min-width: 3rem;
  width: 100%;
}

/* Forzar texto a “end” */
.text-end {
  text-align: end;
}

/* Contenedor de adiciones */
.addition-item {
  display: flex;
  margin-left: 1rem;
  gap: 1rem;
  align-items: center;
}

/* Contenedor interno de ítem adicional */
.addition-item-inner {
  display: flex;
  width: 100%;
  gap: 1rem;
  justify-content: space-between;
}

/* Grid para los subtotales y totales */
.summary-grid {
  display: grid;
  align-items: center;
  grid-template-columns: repeat(2, 1fr);
}

.font-weight-400 {
  font-weight: 400;
}

/* Botones y clases genéricas */
.button-common {
  outline: none;
  margin: .5rem 0;
}

.button-no-outline {
  outline: none;
}

.button-no-border {
  border: none;
}

.button-fullwidth {
  width: 100%;
}

.button-bold {
  font-weight: bold;
}

.button-transparent {
  background-color: rgba(0, 0, 0, 0);
}

.button-black {
  background-color: black;
}

/* Tag de aviso de “Restaurante cerrado” */
.tag-fullheight {
  width: 100%;
  height: 2.5rem;
}

.p-shadow {
  box-shadow: 0 0.3rem 5px rgba(0, 0, 0, 0.15);
}

/* Ajustes de fuente (opcional) */
button {
  text-transform: uppercase;
}

* {
  text-transform: uppercase;
  font-size: 0.9rem;
}

*::first-letter {
  text-transform: uppercase;
}

* {
  text-transform: capitalize;
}
</style>
