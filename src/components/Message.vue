<template>
    <div class="message-container">
        <div :class="[props.type,'message-content']">
            <p :class="[props.type, 'message']">{{ props.message }}</p>
        </div>
    </div>
</template>
<script setup>
import { defineProps } from 'vue';
const props = defineProps({
    type: {
        type: String,
        default: 'info'
    },
    message: {
        type: String,
        default: ''
    }
});
</script>
<style scoped>

.message-content {
    border-width:2.5px;
    border-style: solid;
    padding: auto;
    border-radius: 0.25rem;
}
.message {
    text-align: center;
    color:#ffffff;
    margin: 5px;
    font-weight:bold;
}
div.error {
    border-color: rgb(220, 53, 69);
    background-color: #ffffff;
}
div.info {
    border-color: background-color rgb(108, 99, 255);
    background-color: #ffffff;
}
div.success {
    border-color: rgb(40, 167, 69);
    background-color: #ffffff;
}
p.success{
    color: rgb(40, 167, 69);
}
p.error {
    color: rgb(220, 53, 69);
}
p.info {
    color: rgb(108, 99, 255);
}

</style>