<script>
    export default {
        name: 'ActionButton',
    }
</script>

<template>
    <button class="flex justify-center items-center w-[42px] rounded-md p-2 text-white font-semibold transition">
        <slot />
    </button>
</template>
