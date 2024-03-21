<script>
import Loader from '../components/Loader.vue';
import { getAllUsers } from '../services/user';
import { getAllCloudServices } from '../services/cloud-plans';
import { IconUserCircle } from '@tabler/icons-vue';
    export default {
    name: 'ManageUsers',
    components: { Loader, IconUserCircle },
    data() {
        return {
            userLoading: true,
            usersData: [],
            cloudPlans: [],
        };
    },
    methods: {
        getCloudPlanData(plan_id) {
            let cloudPlanName
            this.cloudPlans.forEach(cloudPlan => {
                if (plan_id === cloudPlan.uid) {
                    cloudPlanName = cloudPlan.name
                }
            })
            return cloudPlanName
        },
    },
    async mounted() {
        this.userLoading = true;
        await getAllUsers(usersData => {
            this.usersData = usersData;
        });
        await getAllCloudServices(cloudPlans => {
            this.cloudPlans = cloudPlans;
        });
        this.userLoading = false;
    },
}
</script>

<template>
    <Loader v-if="userLoading"/>
    <template v-else>
        <div class="flex items-center justify-center flex-col relative">
            <div class="max-w-3xl w-full px-6 mb-14">
                <h1 class="text-slate-600 font-bold text-4xl pt-14 text-left mb-4">Administrar Usuarios</h1>
                <p class="mb-4 text-slate-600 text-xl">Cantidad de usuarios registrados: {{ usersData.length }}</p>
                <section class="my-10">
                    <ul class="grid sm:grid-cols-2 xl:grid-cols-3">
                        <li v-for="userData, index in usersData" :key="index" class="mb-5 py-5 flex flex-col justify-center items-center gap-4">
                            <picture v-if="userData.photoURL != null">
                                <img :src="userData.photoURL" alt="avatar-picture" class="rounded-lg w-[125px] h-[125px] shadow-lg object-cover">
                            </picture>
                            <div v-else class="w-[125px] h-[125px]">
                                <IconUserCircle size="100%" stroke-width="1.5" stroke="#f97316" class=" drop-shadow-lg"/>
                            </div>
                            <div class="text-center">
                                <h3 class="font-bold text-xl">{{ userData.name }} {{ userData.surname }}</h3>
                                <p>{{ userData.email }}</p>
                                <p v-if="userData.plan_id != null" class="font-semibold">{{ getCloudPlanData(userData.plan_id) }}</p>
                                <p v-else class="font-semibold">Sin Suscripción</p>
                            </div>
                            <div>
                                <router-link class="py-2 hover:opacity-75 block rounded p-1.5 text-white font-semibold bg-orange-500  hover:bg-orange-400 active:bg-orange-600 transition" :to="`${userData.chat}`">
                                    Ver Chat
                                </router-link>
                            </div>
                        </li>
                    </ul>
                </section>
            </div>
        </div>
    </template>
</template>
