<script>
    import { suscribeToAuth } from '../services/auth.js';
    import { getCloudServices } from '../services/cloud-plans';
    import { suscribeToCloudPlanService } from '../services/cloud-plan-suscription';
    import Loader from "../components/Loader.vue";
    import MainButton from '../components/MainButton.vue';
    import { notificationSymbol } from "../symbols/symbol";
    export default {
        name : 'Pricing',
        components : { Loader, MainButton },
        inject: {
            notification: { from: notificationSymbol }
        },
        data() {
            return {
                user_id: null,
                cloudPlansLoading : true,
                cloudPlans: [],
                cloudPlanData: null,
                showModal : false,
                showModalRedirect : false,
                suscribeToCloudPlanServiceLoading: false,
            }
        },
        methods: {
            async handleSuscribeToCloudPlan() {
                this.suscribeToCloudPlanServiceLoading = true

                await suscribeToCloudPlanService({
                    plan_id: this.cloudPlanData.uid,
                    user_id: this.user_id
                })
                .then((data) => {
                    if(data.message == "Suscripción existente") {
                        this.notification.message = "Error, usted ya cuenta con una suscripcion a Umbrella Cloud";
                        this.notification.type = 'error';
                        this.$router.push(`/usuario/${this.user_id}`)
                    } else if(data.message == "Suscripción contratada"){
                        this.notification.message = 'Suscripción contratada con éxito';
                        this.notification.type = 'success';
                        this.$router.push(`/usuario/${this.user_id}`)
                    }
                }).catch(() => {
                    this.notification.message = 'Ocurrio un error inesperado. Inténtalo de nuevo'
                    this.notification.type = 'error'
                    this.$router.push('/pricing')
                })

                this.suscribeToCloudPlanServiceLoading = false
                this.showModal = false
            },
            openModal(index) {
                this.cloudPlanData = {...this.cloudPlans[index]}
                this.showModal = true;
            }, 
            closeModal() {
                this.cloudPlanData = []
                this.showModal = false;
            },
            openModalGoToLogIn() {
                this.showModalRedirect = true;
            },
            closeModalGoToLogIn() {
                this.showModalRedirect = false;
            }
        },
        mounted() {
            this.cloudPlansLoading = true,

            suscribeToAuth(async user => {
                this.user_id = user.id
            })

            getCloudServices(cloudPlans => {
                this.cloudPlans = cloudPlans;
                this.cloudPlansLoading = false;
            });
        }
    }
</script>

<template>
    <template v-if="!cloudPlansLoading">
        <h1 class="text-slate-600 font-bold text-4xl mx-2 pt-14 text-center">Planes Disponibles</h1>   
        <div class="w-full 2xl:w-3/4 flex items-center justify-center px-8 md:px-32 lg:px-16 2xl:px-0 mx-auto my-14">
            <div class="w-full grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                <article class="bg-white shadow-2xl rounded-lg py-4 grid grid-rows-layout_pricing" v-for="(cloudPlan, index) in cloudPlans" :key="cloudPlan.id">
                    <h2 class="text-center text-2xl font-bold mt-3 p-2 text-slate-600">{{ cloudPlan.name }}</h2>
                    <div class="p-2.5 rounded m-3">
                        <p class="text-center mb-3 text-orange-600 font-bold text-4xl">USD<br> {{ cloudPlan.price }}<span class="text-slate-600 text-2xl">/mes</span>
                        </p>
                        <p class="pt-3 mb-2 text-center text-slate-600">{{ cloudPlan.users }}</p>
                        <p class="mb-2 text-center text-slate-600">{{ cloudPlan.storage }} GB</p>
                    </div>
                    <div class="p-2.5 m-3">
                        <h3 class="font-bold">Beneficios Distintivos</h3>
                        <ul class="text-slate-600 list-image-[url(img/marca-de-verificacion.png)] list-inside">
                            <li v-for="benefit in cloudPlan.benefits" :key="benefit.id" class="mt-4 space-y-4">{{ benefit }}</li>
                        </ul>
                    </div>
                    <div v-if="this.user_id != null" class="flex items-center justify-center mt-6 px-6">
                        <MainButton type="button" @click="openModal(index)" class="uppercase">Contratar</MainButton>
                    </div>
                    <div v-else class="flex items-center justify-center mt-6 px-6">
                        <MainButton type="button" @click="openModalGoToLogIn()" class="uppercase">Contratar</MainButton>
                    </div>    
                </article>
            </div>
        </div>
    </template>
    <template v-else>
        <Loader/>
    </template> 

    <template v-if="showModalRedirect">
        <div class="bg-slate-800 bg-opacity-50 flex justify-center items-center absolute top-0 right-0 bottom-0 left-0">
            <div class=" bg-white px-16 py-14 rounded-md sm:w-[400px] md:w-[600px]">
                <h1 class="text-2xl mb-4 font-bold text-slate-500 text-center">Debes estar Autenticado</h1>
                    <div class="mb-8">
                        <p class="text-center mb-4">Para poder contratar un servicio debes Iniciar Sesion</p>
                        <p class="text-center">Si no te encuentras resgistrado, registrate haciendo
                            <router-link to="/registrarse" class="text-blue-600 text-underline hover:opacity-75"> 
                                 Clic Aqui
                            </router-link>
                        </p>
                    </div>
                    <div class="flex justify-end w-full gap-2">
                        <button type="button" class="bg-red-500 hover:bg-red-400 active:bg-red-600 px-7 py-2 rounded-md text-md text-white font-semibold w-full" @click="closeModalGoToLogIn">Volver</button>
                        <router-link class="w-full block text-center bg-orange-500 hover:bg-orange-400 active:bg-orange-600 px-7 py-2 rounded-md text-md text-white font-semibold" to="/iniciar-sesion">
                            Iniciar Sesion
                        </router-link>   
                    </div>
                </div>
            </div>
    </template>
    <template v-if="showModal">
        <div class="bg-slate-800 bg-opacity-50 flex justify-center items-center absolute top-0 right-0 bottom-0 left-0">
            <div class=" bg-white px-16 py-14 rounded-md sm:w-[400px] md:w-[600px]">
                <h1 class="text-2xl mb-4 font-bold text-slate-500 text-center">Contratar Servicio</h1>
                <p class="my-4 text-center">Estas a un solo paso de obtener tu Umbrella Cloud <b>{{ cloudPlanData.name }}</b></p>
                <h2 class="text-center text-2xl font-bold mt-3 p-2 text-slate-600">{{ cloudPlanData.name }}</h2>
                    <div class="m-3 text-center">
                        <p class="mb-3 text-orange-600 font-bold text-4xl">USD<br> {{ cloudPlanData.price }}<span class="text-slate-600 text-2xl">/mes</span></p>
                        <p class="pt-3 mb-2 text-slate-600">{{ cloudPlanData.users }}</p>
                        <p class="mb-2 text-slate-600">{{ cloudPlanData.storage }} GB</p>
                    </div>
                    <div class="m-3 text-center">
                        <h3 class="font-bold text-slate-600">Beneficios Distintivos</h3>
                        <ul class="text-slate-600 list-image-[url(img/marca-de-verificacion.png)] list-inside">
                            <li v-for="benefit in cloudPlanData.benefits" :key="benefit.id" class="mt-4 space-y-4">{{ benefit }}</li>
                        </ul>
                    </div>
                <p class="my-4 font-bold text-center">* El precio final se encuentra sujeto a impuestos y cargos *</p>
                <form @submit.prevent="handleSuscribeToCloudPlan" class="mt-8">
                    <div class="flex justify-end w-full gap-2">
                        <button type="button" class="bg-red-500 hover:bg-red-400 active:bg-red-600 px-7 py-2 rounded-md text-md text-white font-semibold w-full" @click="closeModal">Volver</button>
                        <MainButton type="submit" class="px-7 py-2 rounded-md text-md text-white font-semibold" :loading="suscribeToCloudPlanServiceLoading">Ir al Checkout</MainButton>
                    </div>
                </form>
            </div>
        </div>
    </template>
</template> 