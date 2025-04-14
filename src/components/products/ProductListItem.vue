<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { useRouter } from 'vue-router';
import axios from 'axios'

const router = useRouter();

const isDeleting = ref(false);

defineProps({
    product: Object,
})

const emit = defineEmits(['productDeleted'])

async function deleteProduct(id) {
    try {
        isDeleting.value = true;
        await axios.delete(`http://localhost/products/${id}`)
        emit('productDeleted')
    } catch (error) {

    }
}

function editProduct(id) {
    router.push(`/editproduct/${id}`)
};
</script>

<template>
    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xxl-3 p-2">
        <div :class="['card product-card h-100', isDeleting ? 'opacity-50 pointer-events-none' : '']">
            <!-- <div class="card product-card h-100"> -->
            <!-- <div v-if="isDeleting" class="text-center mt-5">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div> -->

            <div class="card-body">
                <slot></slot>
                <img :src="product.image" :alt="product.title" :title="product.title" />
                <div class="float-start">
                    <p>{{ product.name }}</p>
                    <p>
                        <small>{{ product.category.name }}</small>
                    </p>
                </div>
                <span class="price float-end">{{ product.price }}</span>
            </div>
            <div class="card-footer">
                <button class="btn btn-warning" @click="editProduct(product.id)">
                    Edit</button>&nbsp;&nbsp;
                <button class="btn btn-danger" @click="deleteProduct(product.id)">
                    Delete

                    <div v-if="isDeleting" class="spinner-border" role="status">

                    </div>

                </button>
            </div>
        </div>
    </div>
</template>

<style></style>