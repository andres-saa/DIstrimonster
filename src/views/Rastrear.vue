<template>
    <div class="">
        <div class="container">
            <p class="title">Consultar estado de mi pedido</p>
            <div class="input-container">
                <InputText v-model="order_id" class="input-text" placeholder="Número de pedido" />
                <Button label="Buscar" class="search-button" @click="getOrder" />
            </div>

            <p v-if="order?.status" :class="`estado ${order.status?.split(' ').join('-')}`">
                {{ getOrderMessage(order) }}
            </p>

            <p v-else class="estado no-existe">
                Digita el numero de tu pedido ejemplo <strong style="text-transform: uppercase;">DIS-3034</strong>
            </p>
        </div>


    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { InputText } from "primevue";
import { Button } from "primevue";
import { URI } from "@/service/conection";
import { usecartStore } from "@/store/shoping_cart";
import { useReportesStore } from "@/store/ventas";
import MenuSection from "./MenuSection.vue";

const order = ref({});
const order_id = ref();
const store = useReportesStore();
const order_store = usecartStore();

const getOrder = async () => {
    store.setLoading(true, "Buscando orden...");
    try {
        const response = await fetch(`${URI}/order/${order_id.value}`);
        if (!response.ok) throw new Error("Error al obtener la orden");
        order.value = await response.json();
    } catch (error) {
        console.error("Error al obtener la orden:", error);
        order.value = {};
    } finally {
        store.setLoading(false, "Buscando orden...");
    }
};

onMounted(() => {
    order_id.value = order_store.last_order || "";
});
const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const opcionesHora = { hour: '2-digit', minute: '2-digit', hour12: true };

const getOrderMessage = (order) => {

    const fecha = new Date(order.timestamp).toLocaleDateString('es-ES', opcionesFecha);
    const hora = new Date(order.timestamp).toLocaleTimeString('es-ES', opcionesHora);

    switch (order.status) {
        case "enviada":
            return `El pedido fue enviado a su destino el ${fecha} a las ${hora}`;
        case "cancelada":
            return `El pedido fue cancelado el  ${fecha} a las ${hora} \nResponsable: ${order.responsible}\nRazón: ${order.reason}`;
        case "en preparacion":
            return `El pedido está en preparación desde el ${fecha} a las ${hora} y será enviado en breve.`;
        case "generada":
            return `Hemos recibido su pedido el ${fecha} a las ${hora} y empezaremos a prepararlo en breve. Gracias por su espera.`;
        case "transferencia pendiente":
            return `Tu pedido se encuentra pendiente de trasferencia, pronto te contactaremos `;
 
        case "validacion pendiente":
            return `Tu pedido se encuentra en proceso de validacion pronto te contactaremos `;
 
        default:
            return order.status;
    }
};

const obtenerHoraFormateadaAMPM = (fecha) => {
    const date = new Date(fecha);
    const horas = date.getHours();
    const minutos = date.getMinutes();
    const ampm = horas >= 12 ? "pm" : "am";
    const hora12 = horas % 12 || 12;
    return `${hora12.toString().padStart(2, "0")}:${minutos.toString().padStart(2, "0")} ${ampm}`;
};
</script>

<style scoped>
/* Contenedor principal */
.sticky-header {
    /* background-color: white; */
    position: sticky;
    top: 3rem;
    z-index: -1;
}

.container {
    max-width: 1024px;
    margin: 0 auto;
    padding: 1rem;
}

/* Título */
.title {
    font-size: 2rem;
    font-weight: bold;
    text-align: center;
    padding: 1rem 0;
}

/* Contenedor de entrada */
.input-container {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.input-text {
    flex: 1;
    padding: 0.5rem;
    /* border: 1px solid; */
    /* box-shadow: 0 0 10px #00000030; */
    width: 3rem
}

.search-button {
    /* background-color: var(--p-primary-color); */
    font-weight: bold;
    border: none;
    padding: 0.5rem 1.5rem;
    min-width: max-content;
}

/* Mensajes de estado */
.estado {
    font-size: 1.25rem;
    text-transform: lowercase;
    padding: 1rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
}

/* Colores por estado */
.generada {
    background-color: rgba(255, 255, 0, 0.8);
}

.enviada {
    background-color: rgb(153, 255, 0);
}

.en-preparacion {
    background-color: rgb(84, 212, 255);
}

.cancelada {
    background-color: rgba(255, 84, 84, 0.7);
}

.validacion-pendiente {
    background-color: rgba(107, 198, 133, 0.7);
}


.transferencia-pendiente {
    background-color: rgba(250, 147, 255, 0.7);
}


.no-existe {
    background-color: #f9741632;
    text-align: center;
}

/* Capitalización del primer carácter */
.estado::first-letter {
    text-transform: capitalize;
}
</style>
