<script>
    import Loader from '../components/Loader.vue';
    import { getUserProfileById } from '../services/user';
    import { IconEdit, IconLock, IconPhoto, IconMessages, IconSquareRoundedPlus, IconAdjustmentsHorizontal, IconUserSquareRounded, IconUserCircle } from '@tabler/icons-vue';
    import { notificationSymbol } from '../symbols/symbol.js';
    export default {
        name: 'Dashboard',
        components: { Loader, IconEdit, IconLock, IconPhoto, IconMessages, IconSquareRoundedPlus, IconAdjustmentsHorizontal, IconUserSquareRounded, IconUserCircle },
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
                    rol: null,
                    photoURL: null,
                }
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
                <h1 class="text-slate-600 font-bold text-4xl pt-14 text-center sm:text-left">Dashboard</h1>
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
                        <p class="font-semibold capitalize">{{ user.rol }}</p>
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
                    <h2 class="mb-6 text-slate-600 font-semibold text-3xl">Administrar Chats</h2>
                    <div class="ml-4 flex items-center gap-4">
                        <IconMessages :size="30" stroke-width="2" stroke="#f97316"/>
                        <router-link :to="`/manage-chats/${this.user.id}`" class="text-blue-600 text-[18px] hover:opacity-75">
                           Ver Chats Activos
                        </router-link>
                    </div>
                </section>
                <section class="my-10 border rounded-lg bg-white p-6 shadow-lg">
                    <h2 class="mb-6 text-slate-600 font-semibold text-3xl">Administrar Servicios</h2>
                    <ul>
                        <li class="ml-4 mb-4 flex items-center gap-4">
                            <IconSquareRoundedPlus :size="30" stroke-width="2" stroke="#f97316"/>
                            <router-link to="/add-service" class="text-blue-600 text-[18px] hover:opacity-75">
                                Nuevo Servicio
                            </router-link>
                        </li>
                        <li class="ml-4 flex items-center gap-4">
                            <IconAdjustmentsHorizontal :size="30" stroke-width="2" stroke="#f97316"/>
                            <router-link  to="/manage-services" class="text-blue-600 text-[18px] hover:opacity-75">
                                Ver Servicios
                            </router-link>
                        </li>
                    </ul>
                </section>
                <section class="mt-10 border rounded-lg bg-white p-6 shadow-lg">
                    <h2 class="mb-6 text-slate-600 font-semibold text-3xl">Administrar Usuarios</h2>
                    <ul>
                        <li class="ml-4 flex items-center gap-4">
                            <IconUserSquareRounded :size="30" stroke-width="2" stroke="#f97316"/>
                            <router-link to="/manage-users" class="text-blue-600 text-[18px] hover:opacity-75">
                                Ver Usuarios
                            </router-link>
                        </li>
                    </ul>
                </section>
            </div>
        </div>
    </template>
</template>