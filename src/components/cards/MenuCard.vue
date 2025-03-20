<template>
    <div class="container67 shadow-3 col-12 p-0 product-card" @click="open(props.product)">
        <h3 style="grid-area: a;">
                <b>{{ props.product.productogeneral_descripcion }}</b>
        </h3>

        <div style="grid-area: b;" class="imagen">
            <!-- Imagen con lazy loading personalizado -->
            <img ref="productImage" class="imagen-producto lazy"
                :data-src="`${URI}/get-image?image_url=${props.product.productogeneral_urlimagen}`"
                src="https://media.tenor.com/IfbOs_yh89AAAAAM/loading-buffering.gif" alt="Descripción del producto" />
        </div>

        <div style="grid-area: c;" class="texto">





            <!-- Contenedor interno que agrupa la descripción y el precio -->
            <div class="texto-content">
                <!-- Fila de arriba (vacía en este ejemplo, la puedes eliminar si no la usas) -->

                <!-- Descripción -->
                <span class="max-width-100" style="margin-bottom: 1rem;">
                    {{ truncatedDescription }}
                </span>



            </div>


                    <div class="flex-center-gap">
                      <span>Detal:</span>
                        <h3 class="text-2xl p-0 m-0 precio">


                            <b>
                                {{
                                    formatoPesosColombianos(
                                        props.product.productogeneral_precio  / props.product.kilos ||
                                        props.product.lista_presentacion[0].producto_precio / props.product.kilos
                                    )
                                }}
                            </b> <span class="text-l" style="font-size: .8rem;">/ Kg</span> 



                        </h3>
                    </div>



                    <div class="flex-center-gap">
                      <span>Mayor:</span>
                        <h3 class="text-2xl p-0 m-0 precio">


                            <b>
                                {{
                                    formatoPesosColombianos(
                                        props.product.mayor / props.product.kilos

                                    )
                                }}
                            </b>
                            
                            <span class="text-l" style="font-size: .8rem;">/ Kg</span> 


                        </h3>
                    </div>



                    <div class="flex-center-gap">
                      <span>Distribuidor:</span>
                        <h3 class="text-2xl p-0 m-0 precio">


                            <b>
                                {{
                                    formatoPesosColombianos(
                                        props.product.distribuidor / props.product.kilos

                                    )
                                }}
                            </b>


                            <span class="text-l" style="font-size: .8rem;">/ Kg</span> 
                        </h3>
                    </div>



        </div>


        <Tag style="position: absolute;bottom: 0;width: 5rem; border-radius: 0 .5rem 0 0 ;">{{ props.product.kilos }} Kg</Tag>


    </div>



</template>

<script setup>
import { formatoPesosColombianos } from '@/service/utils/formatoPesos';
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { usecartStore } from '@/store/shoping_cart';
import { Button } from 'primevue';
import { useRoute } from 'vue-router';
import {Tag} from 'primevue';
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
/* --- Clases nuevas para los estilos que antes estaban en línea --- */

/* Contenedor principal */
.product-card {
    border-radius: 0.5rem;
    width: 100%;
    height: 100%;
    position: relative;
    /* El resto de estilos los hereda de .container67 */
}

/* Contenedor “imagen” (estilos unificados) */
.imagen {
    display: flex;


    align-items: center;
}

/* Imagen principal */
.imagen-producto {
    width: 100%;
    aspect-ratio: 1 / 1;
    background-color: #fff;
    object-fit: cover;

    /* o 'contain' según tu preferencia */
    border-radius: 0.5rem;
    transition: opacity 0.5s ease-in-out, filter 0.3s ease-out;
    opacity: 0;
    filter: blur(10px);
}

.imagen-producto.cargado {
    opacity: 1;
    filter: blur(0);
}

/* Contenedor “texto” */
.texto {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

/* Contenedor interior para flex y separación */
.texto-content {
    display: flex;
    gap: 1rem;
    height: 100%;
    flex-direction: column;
    justify-content: space-between;
}

/* Fila con “display: flex; justify-content: space-between; align-items: center;” */
.flex-row-center-space-between {
    display: flex;
    justify-content: end;
    align-items: center;
}

/* Limita el ancho al 100% */
.max-width-100 {
    max-width: 100%;
}

/* Para alinear elementos con gap y centrarlos en fila */
.flex-center-gap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
}

/* Botón de corazón */
.heart-button {
    color: red;
}

/* Botón flotante (absolute) para añadir al carrito */
.add-to-cart-button {
    position: absolute;
    aspect-ratio: 1 / 1;
    right: -1rem;
    top: -1rem;
}

/* --- Estilos existentes y/o adicionales --- */

.container67 {
    display: grid;
    gap: 1rem;
    /* Spacing between grid items */

    overflow: hidden;
    height: 100%;
    max-width: 40rem;
    width: 100%;
    margin: 0;
    padding: 1rem;
    box-shadow: 0 1rem 1rem rgba(160, 160, 160, 0.3);
    border-radius: 0.5rem;
    /* Curvatura específica */
    background-color: #fff;
    transition: all ease 0.3s;
    cursor: pointer;
    grid-template-areas:
            "a a a"
            "b c c";
            grid-template-columns: 1fr 1fr;

}

.character {
    display: none;
}

.container67:hover {
    transform: translateY(-0.5rem);
    box-shadow: 0 1.5rem 1rem rgba(160, 160, 160, 0.4);

}

/* Ajustes responsivos */
@media (max-width: 900px) {

    span,
    h3 {
        font-size: 12.5px;
    }

    h2 {
        font-size: 20px;
    }

 
}






/* Animación e imágenes */
.rating {
    width: 1rem;
}

.p-shadow {
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.25);
}

/* Transiciones para fade */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

/* Efecto cuando la imagen se ha cargado */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-100px);
    }

    to {
        opacity: 1;
    }
}

.cargado {
    opacity: 1;
    animation: fadeIn 0.1s ease-out forwards;
}
</style>
