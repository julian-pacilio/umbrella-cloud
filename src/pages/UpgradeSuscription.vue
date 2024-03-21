<script>
    import Loader from '../components/Loader.vue';
    import MainButton from '../components/MainButton.vue';
    import { upgradeCloudPlanService } from "../services/cloud-plan-suscription"
    import { getCloudServices } from "../services/cloud-plans"
    import { getUserProfileById } from '../services/user';
    import { notificationSymbol } from "../symbols/symbol";
    export default {
        name: 'UpgradeSuscription',
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
                cloudPlans: [],
                cloudPlanData: null,
                upgradeSuscriptionLoading: true,
                userHasSuscription: false,
                showModal: false,
            };
        },
        methods: {
             async upgradeSuscription() {
                this.upgradeSuscriptionLoading = true;
                this.showModal = false;
                
                let data = {
                    user_id : this.user.id,
                    plan_id: this.cloudPlanData.uid,
                }

                await upgradeCloudPlanService(data)
                .then((data) => {
                    if(data.message == "Suscripción existente") {
                        this.notification.message = "Error, usted ya cuenta con una suscripcion a este servicio Umbrella Cloud";
                        this.notification.type = 'error';
                        this.$router.push(`/upgrade-suscription/${this.$route.params.id}`)
                        setTimeout(() => {
                            this.upgradeSuscriptionLoading = false
                        }, "1000");
                    } else if(data.message == "Suscripción actualizada"){
                        this.notification.message = 'Suscripción actualizada con éxito';
                        this.notification.type = 'success';
                        this.$router.push(`/usuario/${this.user.id}`)
                        this.upgradeSuscriptionLoading = false
                    }
                }).catch(() => {
                    this.showModal = false;
                    this.notification.message = 'Ocurrio un error inesperado. Inténtalo de nuevo'
                    this.notification.type = 'error'
                    this.$router.push(`/upgrade-suscription/${this.$route.params.id}`)
                    setTimeout(() => {
                        this.upgradeSuscriptionLoading = false
                    }, "1000");
                })
            },
            openModal(index) {
                this.cloudPlanData = {...this.cloudPlans[index]}
                this.showModal = true;
            },
            closeModal() {
                this.showModal = false;
            }, 
        },
        async mounted() {
            this.upgradeSuscriptionLoading = true;
            this.user = await getUserProfileById(this.$route.params.id);
            if(this.user.plan_id != null) {
                this.userHasSuscription = true;
            }
            await getCloudServices(cloudPlans => {
                this.cloudPlans = cloudPlans;
                this.cloudPlansLoading = false;
            });
            this.upgradeSuscriptionLoading = false;
        },
    }
</script>

<template>
    <Loader v-if="upgradeSuscriptionLoading"/>
    <template v-else>
        <template v-if="userHasSuscription">
            <h1 class="text-slate-600 font-bold text-4xl mx-2 pt-14 text-center">Actualizar suscripción</h1>
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
                        <div class="flex items-center justify-center mt-6 px-6">
                            <MainButton type="button" @click="openModal(index)" class="uppercase">Ver Detalles</MainButton>
                        </div> 
                </article>
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
        <div class="bg-slate-800 bg-opacity-50 flex justify-center items-center absolute top-0 right-0 bottom-0 left-0">
            <div class=" bg-white px-16 py-14 rounded-md sm:w-[400px] md:w-[600px]">
                <h1 class="text-2xl mb-4 font-bold text-slate-500 text-center">Actualizar Servicio</h1>
                <p class="my-4 text-center">Estas a un solo paso de obtener tu Umbrella Cloud</p>
                <h2 class="text-2xl text-center font-bold mt-3 p-2 text-slate-600">{{ cloudPlanData.name }}</h2>
                    <div class="m-3 text-center">
                        <p class="mb-3 text-orange-600 font-bold text-2xl">{{ cloudPlanData.price }} USD<span class="text-slate-600 text-2xl">/mes</span></p>
                        <p class="pt-3 mb-2 text-slate-600">{{ cloudPlanData.users }}</p>
                        <p class="mb-2 text-slate-600">{{ cloudPlanData.storage }} GB</p>
                    </div>
                    <div class="p-2.5 m-3">
                        <h3 class="font-bold">Beneficios Distintivos</h3>
                        <ul class="text-slate-600 list-image-[url(img/marca-de-verificacion.png)] list-inside">
                            <li v-for="benefit in cloudPlanData.benefits" :key="benefit.id" class="mt-4 space-y-4">{{ benefit }}</li>
                        </ul>
                    </div>
                <p class="my-4 font-bold text-center">* El precio final se encuentra sujeto a impuestos y cargos *</p>
                <form @submit.prevent="upgradeSuscription" class="mt-8">
                    <div class="flex justify-end w-full gap-2">
                        <button type="button" class="bg-red-500 hover:bg-red-400 active:bg-red-600 px-7 py-2 rounded-md text-md text-white font-semibold w-full" @click="closeModal">Volver</button>
                        <MainButton type="submit" class="px-7 py-2 rounded-md text-md text-white font-semibold" :loading="upgradeSuscriptionLoading">Confirmar</MainButton>
                    </div>
                </form>
            </div>
        </div>
    </template>
</template>
