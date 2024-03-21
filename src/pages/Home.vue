<script>
    import { IconDatabase, IconCloudCheck, IconAccessPoint, IconMessages, IconCash } from '@tabler/icons-vue';
    import { notificationSymbol } from '../symbols/symbol.js';
    export default {
        name : 'Home',
        components : { IconDatabase, IconCloudCheck, IconAccessPoint, IconMessages, IconCash },
        inject: {
            notification: { from: notificationSymbol }
        },
        methods: {
            clearNotification(){
                this.notification.message = null;
                this.notification.type = null;
            }
        },
        mounted(){
            setTimeout(() => {
                this.clearNotification()
            }, '3000');
        }
    }
</script>

<template>
    <section class="flex flex-wrap content-center items-center justify-center lg:justify-between">
        <div class="mb-7 sm:w-full lg:w-5/12">
            <h1 class="text-orange-400 text-6xl text-center font-bold mb-7 mt-7">Umbrella Cloud</h1>
            <p class="text-4xl italic text-center text-slate-600">Tu Socio en la Nube</p>
        </div>
        <picture class="sm:w-full lg:w-6/12">
            <img src="img/banner.jpg" alt="Umbrella Cloud Banner">
        </picture>
    </section>
    <div class="mt-32 text-center mx-3">
        <p class="italic text-orange-500 text-3xl mb-5">En Umbrella Cloud, comprendemos la importancia de la nube en el mundo digital actual.</p>
        <p class="text-slate-600">Te ofrecemos soluciones de almacenamiento y servicios en la nube de primera calidad para potenciar tu negocio y simplificar tu vida.</p>
        <p class="text-slate-600">Nuestra misión es proteger tus datos, impulsar tu productividad y ofrecer un refugio seguro para tu información crítica.</p>
    </div>
    <div class="mt-24 mx-10">
        <h2 class="mb-10 text-2xl text-center font-bold text-slate-600">¿Por qué deben elegirnos?</h2>
        <div class="grid w-full grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            <article class="flex flex-col items-center gap-3 px-8 py-10 bg-white rounded-3xl shadow-main">
                <IconDatabase :size="64" stroke-width="1.8" stroke="#f97316"/>
                <h3 class="text-2xl font-extrabold text-slate-700">Almacenamiento</h3>
                <p class="text-base leading-7 text-center text-slate-600">Almacenamiento en la nube seguro y escalable.</p>
            </article>

            <article class="flex flex-col items-center gap-3 px-8 py-10 bg-white rounded-3xl shadow-main">
                <IconCloudCheck :size="64" stroke-width="1.8" stroke="#f97316"/>
                <h3 class="text-2xl font-extrabold text-slate-700">Seguridad</h3>
                <p class="text-base leading-7 text-center text-slate-600">Copias de seguridad automáticas y recuperación de datos.</p>
            </article>

            <article class="flex flex-col items-center gap-3 px-8 py-10 bg-white rounded-3xl shadow-main">
                <IconAccessPoint :size="64" stroke-width="1.8" stroke="#f97316"/>
                <h3 class="text-2xl font-extrabold text-slate-700">Acceso total</h3>
                <p class="text-base leading-7 text-center text-slate-600">Acceso a tus archivos desde cualquier lugar y en cualquier dispositivo.</p>
            </article>

            <article class="flex flex-col items-center gap-3 px-8 py-10 bg-white rounded-3xl shadow-main">
                <IconMessages :size="64" stroke-width="1.8" stroke="#f97316"/>
                <h3 class="text-2xl font-extrabold text-slate-700">Soporte 24/7</h3>
                <p class="text-base leading-7 text-center text-slate-600">Servicios personalizados para empresas de todos los tamaños.</p>
            </article>

            <article class="flex flex-col items-center gap-3 px-8 py-10 bg-white rounded-3xl shadow-main">
                <IconCash :size="64" stroke-width="1.8" stroke="#f97316"/>
                <h3 class="text-2xl font-extrabold text-slate-700">Facturación</h3>
                <p class="text-base leading-7 text-center text-slate-600">Precios competitivos y transparencia en la facturación.</p>
            </article>
        </div>
    </div>
    <div class="mt-24 mb-24 mx-3 flex justify-center">
        <div class="max-w-md mx-3 lg:mx-auto overflow-hidden md:max-w-5xl py-7 mb-10">
            <div class="md:flex items-center">
                <div class="md:shrink-0">
                    <img class="h-72 w-full md:h-full md:w-96" src="/img/img-cta.svg" alt="Imagen ilustrativa de Contactese">
                </div>
                <div class="lg:p-8">
                    <p class="text-slate-600 text-3xl text-center italic">¡Descubre cómo podemos ayudarte a llevar tu negocio al siguiente nivel!</p>
                    <div class="mt-5 text-center uppercase tracking-wide text-orange-500 font-bold text-3xl">Contáctanos hoy mismo.</div>
                </div>
            </div>
        </div>
    </div>
</template>