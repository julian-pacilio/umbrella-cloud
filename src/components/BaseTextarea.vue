<script>
    export default {
        name: 'BaseTextarea',
        props: ['modelValue'],
        emits: ['update:modelValue'],
    }
</script>

<template>
    <textarea class="w-full border border-orange-500 rounded p-2 resize-none" 
              :value="modelValue"
              @input="$emit('update:modelValue', $event.target.value)"
    ></textarea>
</template>