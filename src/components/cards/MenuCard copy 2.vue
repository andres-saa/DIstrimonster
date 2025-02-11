<template>

    <div class="container45" @click="open(props.product)">
        <h3 class="titulo-top" style="text-transform: uppercase;padding: 1rem;">{{
            props.product.productogeneral_descripcion }}</h3>

        <div class="content">


            <img ref="productImage" class="imagen-producto lazy"
                :data-src="`${URI}/get-image?image_url=${props.product.productogeneral_urlimagen}`"
                src="https://media.tenor.com/IfbOs_yh89AAAAAM/loading-buffering.gif" alt="Descripción del producto" />


            <div class="texto" style="display: flex;flex-direction: column;justify-content: space-between;">

                <h3 class="titulo-middle" style="text-transform: uppercase;">{{
                    props.product.productogeneral_descripcion
                }}</h3>
                <span>
                    {{ truncatedDescription }}

                </span>

                <h2 style="text-align: end;"> {{
                    formatoPesosColombianos(
                        props.product.productogeneral_precio ||
                        props.product.lista_presentacion[0].producto_precio
                    )
                }}</h2>
            </div>

        </div>
    </div>
</template>

<script setup>
import { formatoPesosColombianos } from '@/service/utils/formatoPesos';
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { usecartStore } from '@/store/shoping_cart';
import { Button } from 'primevue';
import { useRoute } from 'vue-router';
import router from '@/router';
import { URI } from '@/service/conection';
const route = useRoute()

// Acceso al store del carrito
const store = usecartStore();

// Referencia a la imagen del producto
const productImage = ref(null);

// Función para añadir el producto al carrito
const addToCart = (productToAdd) => {
    store.addProductToCart(productToAdd);
};

// Función para abrir la vista del producto
const open = (product) => {
    router.push({
        path: route.path, // Mantiene la misma ruta
        query: {
            ...route.query,    // Preserva los parámetros de consulta existentes
            producto: store.getProductId(product)      // Agrega o actualiza el parámetro 'producto'
        }
    })
    store.setCurrentProduct(product);
    store.setVisible('currentProduct', true);
};

// Definición de las props que recibe el componente
const props = defineProps({
    product: {
        type: Object,
        default: {},
    },
    index: {
        type: Number,
        default: 12,
    },
});

// Computed property para truncar la descripción
const truncatedDescription = computed(() => {
    const description = props.product?.productogeneral_descripcionweb || '';
    return description.length > 100
        ? description.substring(0, 100) + '...'
        : description || '...';
});

// Referencia al observador
let observer = null;

// Función para cargar la imagen cuando entra en el viewport
const loadImage = (img) => {
    const src = img.dataset.src;
    if (src) {
        img.src = src;
        img.classList.remove('lazy');
        img.classList.add('cargado'); // Añade clase para animación
    }
};

onMounted(() => {
    if ('IntersectionObserver' in window) {
        // Inicializa el observador
        observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadImage(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '0px 0px 50px 0px', // Opcional: carga un poco antes de que entre al viewport
            threshold: 0.01
        });

        // Observa la imagen del producto
        if (productImage.value) {
            observer.observe(productImage.value);
        }
    } else {
        // Fallback: carga la imagen de inmediato si no se soporta IntersectionObserver
        if (productImage.value) {
            loadImage(productImage.value);
        }
    }
});

onBeforeUnmount(() => {
    if (observer && productImage.value) {
        observer.unobserve(productImage.value);
    }
});
</script>

<style scoped>
.container45 {

    box-shadow: 0 1rem 1rem #00000030;
    background-color: white;
    border-radius: .5rem;
    overflow: hidden;
    transition: all ease .2s;
}

.content {
    display: grid;
    grid-template-columns: 1fr 2fr;
}

img {
    aspect-ratio: 1 / 1;
    width: 100%;
}

.texto {
    padding: 0 1rem;
}


.text-top {}


.container45:hover {
    transform: translateY(-0.5rem);
    box-shadow: 0 1.5rem 1rem rgba(160, 160, 160, 0.4);
}


@media (width < 700px) {
    span {
        font-size: .8rem;
    }

    .titulo-top {
        display: inline;

    }

    .titulo-middle {
        display: none;
    }

    h3 {
        font-size: 1rem;
    }

    h2 {
        font-size: 1.4rem;
    }
}
</style>
