<script>
    import { getAllCloudServices } from '../services/cloud-plans';
    import Loader from "../components/Loader.vue";
    import { notificationSymbol } from "../symbols/symbol";
    export default {
        name: 'ManageServices',
        components : { Loader },
        inject: {
            notification: { from: notificationSymbol }
        },
        data() {
            return {
                cloudPlansLoading : true,
                cloudPlans: [],
            }
        },
        methods: {
            clearNotification(){
                this.notification.message = null;
                this.notification.type = null;
            },
        },
        mounted() {
            this.cloudPlansLoading = true,
            getAllCloudServices(cloudPlans => {
                this.cloudPlans = cloudPlans;
                this.cloudPlansLoading = false;
            });
            setTimeout(() => {
                this.clearNotification()
            }, '3000');
        }
    }
</script>

<template>
    <template v-if="!cloudPlansLoading">
        <h1 class="text-slate-600 font-bold text-4xl pt-14 text-center">Administrar Servicios</h1>
        <div class="flex items-center justify-center flex-col">
            <div class="max-w-4xl w-full p-6 mx-3 my-14 lg:grid lg:grid-cols-2 lg:gap-8">
                <article class="flex flex-col gap-5 s:flex-row s:flex-wrap shadow-lg mx-auto max-w-[470px] border-l-8 border border-orange-500 rounded p-5 mb-8 lg:mb-0" v-for="cloudPlan in cloudPlans" :key="cloudPlan.id"> 
                    <div class="s:grid s:grid-cols-3 flex flex-col gap-5 justify-items-end">
                        <div class="col-span-1 flex flex-col justify-between gap-5">
                            <p class="text-xl text-orange-500 font-bold">
                                ID : {{ cloudPlan.id }}
                            </p>
                            <h2 class="text-2xl font-semibold text-gray-800">
                                {{ cloudPlan.name}}
                            </h2>
                        </div>
                        <div class="col-span-2">
                            <ul class="font-normal text-gray-700 antialiased">
                                <li>
                                    <span class="mr-2 inline-block font-semibold text-lg text-slate-600">Estado: </span>{{ cloudPlan.online }}
                                </li>
                                <li>
                                    <span class="mr-2 inline-block font-semibold text-lg text-slate-600">Precio: </span>{{ cloudPlan.price }} USD
                                </li>
                                <li>
                                    <span class="mr-2 inline-block font-semibold text-lg text-slate-600">Usuarios: </span>{{ cloudPlan.users }}
                                </li>
                                <li>
                                    <span class="mr-2 inline-block font-semibold text-lg text-slate-600">Almacenamiento: </span>{{ cloudPlan.storage }} GB
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="gap-5 flex w-full">
                        <div class="w-full">
                            <router-link :to="`/edit-service/${cloudPlan.uid}`" class="uppercase w-full block rounded py-1.5 px-3 text-center align-middle text-white font-semibold bg-cyan-500  hover:bg-cyan-400 active:bg-cyan-600 transition disabled:bg-slate-200">Editar</router-link>
                        </div>
                        <div class="w-full">
                            <router-link :to="`/delete-service/${cloudPlan.uid}`" class="uppercase w-full block rounded py-1.5 px-3 text-center align-middle text-white font-semibold bg-red-500  hover:bg-red-400 active:bg-red-600 transition disabled:bg-slate-200">Eliminar</router-link>  
                        </div>
                    </div>
                </article>
            </div>
        </div>
    </template>
    <template v-else>
        <Loader/>
    </template> 
</template>