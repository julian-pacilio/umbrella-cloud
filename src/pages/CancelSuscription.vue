<script>
    import Loader from '../components/Loader.vue';
    import MainButton from '../components/MainButton.vue';
    import { getCloudPlanServiceDetails, unsuscribeFromCloudPlanService } from "../services/cloud-plan-suscription"
    import { getUserProfileById } from '../services/user';
    import { notificationSymbol } from "../symbols/symbol";
    export default {
        name: 'CancelSuscription',
        components: { Loader, MainButton },
        inject: {
            notification: { from: notificationSymbol }
        },
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
                cloudPlan: null,
                cancelSuscriptionLoading: true,
                userHasSuscription : false,
                showModal : false,
            };
        },
        methods: {
             async cancelSuscription() {
                this.cancelSuscriptionLoading = true;

                let data = {
                    user_id : this.user.id
                }

                await unsuscribeFromCloudPlanService(data)
                .then(() => {
                    this.notification.message = 'Suscripción cancelada con éxito';
                    this.notification.type = 'success';
                    this.$router.push(`/usuario/${this.user.id}`)
                    this.cancelSuscriptionLoading = false
                }).catch(() => {
                    this.notification.message = 'Ocurrio un error inesperado. Inténtalo de nuevo'
                    this.notification.type = 'error'
                    this.$router.push(`/cancel-suscription/${this.$route.params.id}`)
                    setTimeout(() => {
                        this.cancelSuscriptionLoading = false
                    }, "1000");
                })

                this.showModal = false;
            },
            openModal() {
                this.showModal = true;
            },
            closeModal() {
                this.showModal = false;
            }, 
        },
        async mounted() {
            this.cancelSuscriptionLoading = true;
            this.user = await getUserProfileById(this.$route.params.id);
            this.cloudPlan = await getCloudPlanServiceDetails(this.user.plan_id);
            if(this.user.plan_id != null) {
                this.userHasSuscription = true;
            }
            this.cancelSuscriptionLoading = false;
        },
    }
</script>

<template>
    <Loader v-if="cancelSuscriptionLoading"/>
    <template v-else>
        <template v-if="userHasSuscription">
            <div class="flex items-center justify-center flex-col relative">
                <div class="max-w-3xl w-full px-6">
                    <h1 class="text-slate-600 font-bold text-4xl pt-14 text-left">Cancelar Suscripción</h1>
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
                            <MainButton @click="openModal()" size="small" class="mt-10">Confirmar</MainButton>
                        </div>
                        <div>
                            <router-link class="w-full block rounded p-1.5 mt-8 text-white font-semibold bg-red-500 hover:bg-red-400 active:bg-red-600 transition disabled:bg-slate-200 text-center" :to="`/usuario/${this.user.id}`">Cancelar</router-link>
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
    <template v-if="showModal">
            <div class="bg-slate-800 bg-opacity-50 flex justify-center items-center absolute top-0 right-0 bottom-0 left-0 h-[1fr]">
                <div class=" bg-white p-14 rounded-md">
                    <h1 class="text-2xl mb-4 font-bold text-slate-500 text-center">Confirmar Cancelación</h1>
                    <p class="mb-4 ">¿Estas seguro que deseas cancelar tu suscripción al "<b>{{ cloudPlan.name }}</b>"?</p>
                    <p class="mb-8 ">Recuerda que la acción que estas a punto de cometer es irreversible</p>
                    <form @submit.prevent="cancelSuscription">
                        <div class="flex w-full gap-10 justify-center">
                            <button type="button" class="bg-red-500 hover:bg-red-400 active:bg-red-600 px-7 py-2 rounded-md text-md text-white font-semibold w-full" @click="closeModal()">Cancelar</button>
                            <MainButton type="submit" class="px-7 py-2 rounded-md text-md text-white font-semibold" :loading="cancelSuscriptionLoading">Confirmar</MainButton>
                        </div>
                    </form>
                </div>
            </div>
    </template>
</template>