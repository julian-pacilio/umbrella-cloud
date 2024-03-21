<script>
    export default {
        name: 'BaseInput',
        props: ['modelValue'],
        emits: ['update:modelValue'],
    }
</script>

<template>
    <input class="w-full border border-orange-500 rounded p-2 disabled:bg-gray-200"
           :value="modelValue"
           @input="$emit('update:modelValue', $event.target.value)"
    >
</template>