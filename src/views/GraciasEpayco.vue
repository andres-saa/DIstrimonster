<template>
  <div
    class="p-2 col-12 my-6"
    style="height: auto; min-height: 90vh; padding: 0.5rem; display: flex; gap: 1rem; justify-content: center; align-items: center;"
  >
    <div
      class="shadow-7 p-4"
      style="border-radius: 0.5rem; max-width: 500px; display: flex; flex-direction: column; gap: 0.5rem; font-size: 1.3rem;"
    >
      <!-- Nombre de usuario (null-check con ?.) -->
      <p
        class="text-4xl text-center mt-5"
        style="font-weight: bold; text-align: center;"
      >
        🤩{{ user.user?.name?.toUpperCase() }}🤩
      </p>

      <p
        class="text-2xl text-center"
        style="font-weight: bold; text-align: center;"
      >
        🔥MUCHAS GRACIAS POR TU COMPRA!🔥
      </p>

      <!-- ID del pedido (null-check con ?.) -->
      <p
        class="text-4xl text-center my-5"
        style="font-weight: bold; text-transform: uppercase; text-align: center;"
      >
        <span class="text-2xl">ID DEL PEDIDO</span>
        <br />
        #{{ store?.last_order || "" }}
      </p>

      <div id="factura" style="width: 100%; text-transform: uppercase;">
        <resumenGracias></resumenGracias>
      </div>

      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <!-- Verifica si el ID del método de pago es 6 -->
        <a
          v-if="user.user?.payment_method_option?.id === 6"
          :href="whatsappUrl"
          target="_blank"
        >
          <Button
            icon="pi pi-whatsapp"
            severity="danger"
            class="wsp"
            style="font-weight: bold; background-color: #00b66c; border: none; width: 100%;"
            label="REALIZAR TRANSFERENCIA"
          ></Button>
        </a>

        <a
          v-else-if="!route.query?.ref_payco"
          :href="whatsappUrl2"
          target="_blank"
        >
          <Button
            icon="pi pi-whatsapp"
            severity="danger"
            class="wsp"
            style="font-weight: bold; background-color: #00b66c; border: none; width: 100%;"
            label="CONFIRMAR PEDIDO"
          ></Button>
        </a>


        <a
          v-else="route.query?.ref_payco"
          :href="whatsappUrl3"
          target="_blank"
        >
          <Button
            icon="pi pi-whatsapp"
            severity="danger"
            class="wsp"
            style="font-weight: bold; background-color: #00b66c; border: none; width: 100%;"
            label="TIENES DUDAS ? ESCRIBENOS"
          ></Button>
        </a>

        <router-link to="/">
          <Button
            icon="pi pi-arrow-left"
            severity="danger"
            outlined
            style="font-weight: bold; border: none; width: 100%;"
            label="VOLVER AL MENU"
          ></Button>
        </router-link>
      </div>





      <div v-if="route.query?.ref_payco">

        <h4>Información de pago</h4>


<div  style="display: grid; grid-template-columns: 1fr 1fr;">

  <div>
     <h5> Ref. Comercio</h5>
  </div>

  <div>
    <h5 style="font-weight: 300;"> {{epayco_data?.x_id_factura}}</h5>
  </div>





  <div>
     <h5> Ref. ePayco</h5>
  </div>

  <div>
    <h5 style="font-weight: 300;"> {{epayco_data?.x_ref_payco}}</h5>
  </div>


  <div>
     <h5> Banco </h5>
  </div>

  <div>
    <h5 style="font-weight: 300;"> {{epayco_data?.x_bank_name}}</h5>
  </div>


  <div>
     <h5> Estado </h5>
  </div>

  <div>
    <h5 style="font-weight: 300;"> {{epayco_data?.x_transaction_state}}</h5>
  </div>


  <div>
     <h5> Autorización </h5>
  </div>

  <div>
    <h5 style="font-weight: 300;"> {{epayco_data?.x_approval_code}}</h5>
  </div>
  <div>
     <h5> Tarjeta </h5>
  </div>

  <div>
    <h5 style="font-weight: 300;"> {{epayco_data?.x_cardnumber}}</h5>
  </div>


  <div>
     <h5> Total </h5>
  </div>

  <div>
    <h5 style="font-weight: 300;"> {{ formatoPesosColombianos(epayco_data?.x_amount)  }}</h5>
  </div>


</div>
      </div>



    </div>






  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeMount, computed, onUnmounted } from "vue";
import { usecartStore } from "@/store/shoping_cart";
import { useUserStore } from "@/store/user";
import { useSitesStore } from "@/store/site";
import { Button } from "primevue";
import resumen from "./resumen.vue";
import resumenGracias from "./ResumenGracias.vue";
import router from "@/router";
import { formatoPesosColombianos } from "@/service/utils/formatoPesos";
import { useReportesStore } from "@/store/ventas";
import { useRoute } from "vue-router";
import { fetchService } from "@/service/utils/fetchService";

// Stores
const store = usecartStore();
const user = useUserStore();
const sitestore = useSitesStore();
const reportes = useReportesStore();
const route = useRoute()
const epayco_data = ref({})


onMounted( async() => {

})

const text = ref("");
const text2 = ref("");
const text3 = ref("");

const obtenerHoraFormateadaAMPM = (fecha) => {
  const fechaParseada = new Date(fecha);
  const horas = fechaParseada.getHours();
  const minutos = fechaParseada.getMinutes();
  const ampm = horas >= 12 ? "pm" : "am";
  const hora12 = horas % 12 || 12;
  const horaFormateada = hora12 < 10 ? "0" + hora12 : hora12;
  const minutosFormateados = minutos < 10 ? "0" + minutos : minutos;
  return `${horaFormateada}:${minutosFormateados} ${ampm}`;
};

onMounted(async() => {


  const epayco = route.query?.ref_payco


  if (epayco){
  const response = await fetchService.get(`https://secure.epayco.co/validation/v1/reference/${epayco}`)
  epayco_data.value = response?.data
  }


  reportes?.setLoading(false, "enviando tu pedido");

  const message_products = [];

  // Null-check sobre store.cart
  (store?.cart || []).forEach((element) => {
    message_products.push(
      `*(${element?.pedido_cantidad  || 0} kilos)* de ${
        element?.pedido_nombre_producto || ""
      } ( ${element?.pedido_cantidad  / element?.presentacion} ${element.presentation_unit_measure})`
    );
  });

  text.value = `Hola soy *${
    (user.user?.name?.toUpperCase() || "") +
    " " +
    (user.user?.second_name?.toUpperCase() || "") +
    "  " +
    (user.user?.first_last_name?.toUpperCase() || "") +
    " " +
    (user.user?.second_last_name?.toUpperCase() || "")
  }* 🤗 acabo de hacer el siguiente pedido en la página web *distrimonster.com*

${(message_products || []).join("\n")}

El número de la orden es *#${store?.last_order || ""}*.
la pagina indica que es para recoger en la sede *${
    sitestore.location?.site?.site_name || ""
  }* el  *${store?.delivery_horaentrega || ""}*

*Escribo para Realizar la Transferecia*\n
*Muchas Gracias* 🙏`;

  text2.value = `Hola soy *${
    (user.user?.name?.toUpperCase() || "") +
    " " +
    (user.user?.second_name?.toUpperCase() || "") +
    "  " +
    (user.user?.first_last_name?.toUpperCase() || "") +
    " " +
    (user.user?.second_last_name?.toUpperCase() || "")
  }*

🤗 acabo de hacer el siguiente pedido en la página web *distrimonster.com*

${(message_products || []).join("\n")}

El número de la orden es *#${store?.last_order || ""}*.
la pagina indica que es para recoger en la sede *${
    sitestore.location?.site?.site_name || ""
  }* el  *${store?.delivery_horaentrega || ""}*

*Escribo para Confirmar el pedido*\n
*Muchas Gracias* 🙏`;


text3.value = `Hola soy *${
    (user.user?.name?.toUpperCase() || "") +
    " " +
    (user.user?.second_name?.toUpperCase() || "") +
    "  " +
    (user.user?.first_last_name?.toUpperCase() || "") +
    " " +
    (user.user?.second_last_name?.toUpperCase() || "")
  }*

🤗 acabo de hacer el siguiente pedido en la página web *distrimonster.com*

${(message_products || []).join("\n")}

El número de la orden es *#${store?.last_order || ""}*.
la pagina indica que es para recoger en la sede *${
    sitestore.location?.site?.site_name || ""
  }* el  *${store?.delivery_horaentrega || ""}*

Realice' el pago con la tarjeta *${epayco_data.value?.x_cardnumber}*
Y la referencia del pago es *${epayco_data.value?.x_ref_payco}*

*Muchas Gracias* 🙏`;
});





const whatsappUrl = computed(() => {
  const baseUrl = "https://api.whatsapp.com/send";
  const urlParams = new URLSearchParams({
    phone: "573172988238",
    text: text.value,
  });
  return `${baseUrl}?${urlParams.toString()}`;
});

const whatsappUrl2 = computed(() => {
  const baseUrl = "https://api.whatsapp.com/send";
  const urlParams = new URLSearchParams({
    phone: "573172988238",
    text: text2.value,
  });
  return `${baseUrl}?${urlParams.toString()}`;
});

const whatsappUrl3 = computed(() => {
  const baseUrl = "https://api.whatsapp.com/send";
  const urlParams = new URLSearchParams({
    phone: "573172988238",
    text: text3.value,
  });
  return `${baseUrl}?${urlParams.toString()}`;
});

onUnmounted(() => {
  // Ejemplo de limpiar user.user si se quisiera:
  // user.user = {
  //   name: '',
  //   neigborhood: '',
  //   address: '',
  //   phone_number: '',
  //   payment_method_option: '',
  //   was_reserva: false
  // },

  // Null-check antes de reasignar:
  if (store?.cart) {
    store.cart = [];
  }
});
</script>

<style scoped>
@keyframes parpadeo {
  0% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(1.1);
    transform: scale(1.01);
  }
}

.wsp {
  animation: parpadeo ease infinite 0.5s;
  transition: all ease 0.5s;
}
</style>
