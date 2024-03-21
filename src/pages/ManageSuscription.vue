<script>
    import Loader from '../components/Loader.vue';
    import { getCloudPlanServiceDetails } from "../services/cloud-plan-suscription"
    import { getUserProfileById } from '../services/user';
    export default {
        name: 'ManageSuscription',
        components: { Loader },
        data() { 
            return {
                user: {
                    id: null,
                    email: null,
                    name: null,
                    surname: null,
                    photoURL: null,
                    plan_id: null
                },
                suscriptionLoading: true,
                userHasSuscription : false,
                cloudPlan: null,
            };
        },
        async mounted() {
            this.suscriptionLoading = true;
            this.user = await getUserProfileById(this.$route.params.id);
            this.cloudPlan = await getCloudPlanServiceDetails(this.user.plan_id);
            if(this.user.plan_id != null) {
                this.userHasSuscription = true;
            }
            this.suscriptionLoading = false;
        },
    }
</script>

<template>
    <Loader v-if="suscriptionLoading"/>
    <template v-else>
        <template v-if="userHasSuscription">
            <div class="flex items-center justify-center flex-col relative">
                <div class="max-w-3xl w-full px-6 mb-14">
                    <h1 class="text-slate-600 font-bold text-4xl pt-14 text-left">Mi Plan Actual</h1>
                    <section class="my-10 pb-10">
                        <h2 class="mb-5 text-slate-600 font-bold text-2xl text-left">
                            {{ cloudPlan.name }}
                        </h2>
                        <ul class="mb-8 block font-sans text-base font-normal leading-relaxed text-gray-700 antialiased">
                            <li class="mb-5">
                                <p><span class="mr-2 inline-block font-bold text-lg text-slate-600">Costo Mensual:</span>{{  cloudPlan.price }} USD</p>
                            </li>
                            <li class="mb-5">
                                <p><span class="mr-2 inline-block font-bold text-lg text-slate-600">Almacenamiento Total:</span>{{ cloudPlan.storage }} GB</p>
                            </li>
                            <li class="mb-5">
                                <p><span class="mr-2 inline-block font-bold text-lg text-slate-600">Usuarios permitidos:</span>{{ cloudPlan.users }}</p>
                            </li>
                        </ul>
                        <div class="mb-5">
                            <p class="mr-2 inline-block font-bold text-lg text-slate-600">Beneficios</p>
                        </div>
                        <div class="mb-5 border-b-2 border-t-2 border-gray-300">
                            <ul class="my-8 text-slate-600 list-image-[url(img/marca-de-verificacion.png)] list-inside">
                                <li v-for="(benefit) in this.cloudPlan.benefits" :key="benefit.index" class="mb-5">
                                    {{ benefit }}
                                </li>
                            </ul>
                        </div>
                        <div>
                            <router-link class="w-full block rounded p-1.5 mt-8 text-white font-semibold bg-orange-500 hover:bg-orange-400 active:bg-orange-600 transition disabled:bg-slate-200 text-center"
                            :to="`/usuario/${this.$route.params.id}`">Volver al panel</router-link>
                        </div>
                    </section>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="flex items-center justify-center flex-col relative">
                <div class="max-w-3xl w-full px-6">
                    <h1 class="text-slate-600 font-bold text-4xl pt-14 text-left">No posees suscripciónes activas</h1>
                    <section class="my-10 pb-10">
                        <p class="mb-4">Lo sentimos, pero no posees una suscripción activa para consultar.</p>
                        <p class="mb-8">No te preocupes, aun puedes optar por contratar una de las disponibles.</p>   
                        <router-link to="/pricing" class="text-blue-600 font-medium hover:opacity-75 underline">
                            Haz clic aqui para consultar los planes
                        </router-link>
                    </section>
                </div>
            </div>
        </template>
    </template>
</template>

