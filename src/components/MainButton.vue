<script>
    import Loader from './Loader.vue';
    export default {
        name: 'MainButton',
        components: { Loader },
        props: {
            'loading': {
                type: Boolean,
                default: false,
            }
        },
    }
</script>

<template>
    <button 
        class="w-full block rounded p-1.5 text-white font-semibold bg-orange-500  hover:bg-orange-400 active:bg-orange-600 transition disabled:bg-slate-200" 
        type="submit"
        :disabled="loading"
    >
        <template v-if="!loading">
            <slot />
        </template>
        <template v-else>
            <Loader size="small"/>
        </template>
    </button>
</template>