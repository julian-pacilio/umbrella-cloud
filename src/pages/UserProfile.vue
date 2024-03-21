<script>
    import Loader from '../components/Loader.vue';
    import { getUserProfileById } from '../services/user';
    import { getCloudPlanServiceDetails } from "../services/cloud-plan-suscription";
    import { IconEdit, IconLock, IconPhoto, IconMessages, IconDatabase, IconArrowBigUpLines, IconSquareX, IconUserCircle } from '@tabler/icons-vue';
    import { notificationSymbol } from '../symbols/symbol.js';
    export default {
        name: 'UserProfile',
        components: { Loader, IconEdit, IconLock, IconPhoto, IconMessages, IconDatabase, IconArrowBigUpLines, IconSquareX, IconUserCircle },
        inject: {
            notification: { from: notificationSymbol }
        },
        data() { 
            return {
                userLoading: true,
                user: {
                    id: null,
                    email: null,
                    name: null,
                    surname: null,
                    photoURL: null,
                    plan_id: null
                },
                plan_data: null,
                adminId : '3feBX0D3E7UA8JHYbTRQuLVZvjI2',
            };
        },
        methods: {
            clearNotification(){
                this.notification.message = null;
                this.notification.type = null;
            }
        },  
        async mounted() {
            this.userLoading = true;
            this.user = await getUserProfileById(this.$route.params.id);
            this.plan_data = await getCloudPlanServiceDetails(this.user.plan_id);
            this.userLoading = false;
            setTimeout(() => {
                this.clearNotification()
            }, '3000');
        },
    }
</script>

<template>
    <Loader v-if="userLoading"/>
    <template v-else>
        <div class="flex items-center justify-center flex-col relative">
            <div class="max-w-3xl w-full px-6 mb-14">
                <h1 class="text-slate-600 font-bold text-4xl pt-14 text-center sm:text-left">Mi Perfil</h1>
                <section class="my-10 flex gap-4 flex-col items-center text-center sm:flex-row sm:text-left">
                    <picture v-if="user.photoURL != null">
                        <img :src="user.photoURL" alt="avatar-picture" class="rounded-lg w-[125px] h-[125px] shadow-lg object-cover">
                    </picture>
                    <div v-if="user.photoURL == null" class="w-[125px] h-[125px]">
                        <IconUserCircle size="100%" stroke-width="1.5" stroke="#f97316" class=" drop-shadow-lg"/>
                    </div>
                    <div class="flex flex-col gap-5">
                        <h2 class="text-slate-600 font-semibold text-2xl">{{ user.name }} {{ user.surname }}</h2>
                        <p class="font-semibold">{{ user.email }}</p>
                        <p v-if="user.plan_id != null" class="font-semibold">{{ plan_data.name }}</p>
                        <p v-else class="font-semibold">Sin Suscripción</p>
                    </div>
                </section>
                <section class="my-10 border rounded-lg bg-white p-6 shadow-lg">
                    <h2 class="mb-6 text-slate-600 font-semibold text-3xl">Administrar Perfil</h2>
                    <ul>
                        <li class="ml-4 mb-4 flex items-center gap-4">
                            <IconEdit :size="30" stroke-width="2" stroke="#f97316"/>
                            <router-link :to="`/edit-user/${this.user.id}`" class="text-blue-600 text-[18px] hover:opacity-75">
                                Editar Datos Personales
                            </router-link>
                        </li>
                        <li class="ml-4 mb-4 flex items-center gap-4">
                            <IconLock :size="30" stroke-width="2" stroke="#f97316"/>
                            <router-link :to="`/edit-password/${this.user.id}`" class="text-blue-600 text-[18px] hover:opacity-75">
                                Editar Password
                            </router-link>
                        </li>
                        <li class="ml-4 flex items-center gap-4">
                            <IconPhoto :size="30" stroke-width="2" stroke="#f97316"/>
                            <router-link :to="`/edit-user-avatar/${this.user.id}`" class="text-blue-600 text-[18px] hover:opacity-75">
                                Editar Avatar
                            </router-link>
                        </li>
                    </ul>
                </section>
                <section class="my-10 border rounded-lg bg-white p-6 shadow-lg">
                    <h2 class="mb-6 text-slate-600 font-semibold text-3xl">Adminstrar Suscripción</h2>
                    <ul>
                        <li class="ml-4 mb-4 flex items-center gap-4">
                            <IconDatabase :size="30" stroke-width="2" stroke="#f97316"/>
                            <router-link :to="`/manage-suscription/${this.user.id}`" class="text-blue-600 text-[18px] hover:opacity-75">
                                Ver Datos del plan
                            </router-link>
                        </li>
                        <li class="ml-4 mb-4 flex items-center gap-4">
                            <IconArrowBigUpLines :size="30" stroke-width="2" stroke="#f97316"/>
                            <router-link :to="`/upgrade-suscription/${this.user.id}`" class="text-blue-600 text-[18px] hover:opacity-75">
                                Mejorar Plan
                            </router-link>
                        </li>
                        <li class="ml-4 flex items-center gap-4">
                            <IconSquareX  :size="30" stroke-width="2" stroke="#ef4444"/>
                            <router-link :to="`/cancel-suscription/${this.user.id}`" class="text-blue-600 text-[18px] hover:opacity-75">
                                Cancelar Suscripcion
                            </router-link>
                        </li>
                    </ul>
                </section>
                <section class="border rounded-lg bg-white p-6 shadow-lg">
                    <h2 class="mb-6 text-slate-600 font-semibold text-3xl">Asistencia de Chat</h2>
                    <div class="ml-4 flex items-center gap-4">
                        <IconMessages :size="30" stroke-width="2" stroke="#f97316"/>
                        <router-link :to="`/usuario/${this.adminId}/chat`" class="text-blue-600 text-[18px] hover:opacity-75">
                            Contactarse con Atención al cliente
                        </router-link>
                    </div>
                </section>
            </div>
        </div>
    </template>
</template>