<script>
    import { getUserProfileById } from './services/user';
    import { suscribeToAuth, logout } from './services/auth.js';
    import { notificationSymbol } from './symbols/symbol';
    import { IconCircleX, IconCircleCheck } from '@tabler/icons-vue'
    import { computed } from 'vue'
    export default {
        name: "App",
        components: { IconCircleX, IconCircleCheck },
        data() {
            return {
                user: {
                    id: null,
                    email: null,
                },
                userLogData: {
                    id: null,
                    email: null,
                    name : null,
                    surname : null,
                    rol : 'user',
                },
                showMenu : false,
                notification: {
                    message: null,
                    type: null,
                }
            }
        },
        provide() {
            return{
                [notificationSymbol]: computed(() => this.notification)
            }
        },
        methods:{
            handleLogout() {
                logout()
                .then(() => {
                    this.notification.message = 'Sesión cerrada con éxito'
                    this.notification.type = 'success'
                })
                .catch(error => {
                    this.notification.message = 'Ocurrio un error inesperado. Inténtalo de nuevo'
                    this.notification.type = 'error'
                });
                this.userLogData = {}
                this.$router.push('/iniciar-sesion')
            },
            handleRouterLinkClick() {
                this.showMenu = !this.showMenu;
            },
        },
        mounted() {
            suscribeToAuth(async user => {
                this.user = {...user}
                    if(this.user.id != null ) {
                        this.userLogData = await getUserProfileById(this.user.id)
                    }
            });
        },
    };
</script>

<template>
    <header class="z-10">
        <nav class="border-gray-200 bg-orange-500 transition">
            <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-3">
                <a href="#" class="flex items-center">
                    <img src="/img/logo.svg" alt="Logo" class="w-60"/>
                    <span class="sr-only">Umbrella Cloud</span>
                </a>
                <button data-collapse-toggle="navbar-default" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg lg:hidden hover:bg-orange-300" aria-controls="navbar-default" aria-expanded="false">
                    <span class="sr-only">Abrir Menú</span>
                    <svg class="w-5 h-5" aria-hidden="false" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
                    </svg>
                </button>
                <div class="hidden w-full h-screen lg:h-auto lg:block lg:w-auto" :class="{ 'hidden': showMenu }" id="navbar-default" >
                    <ul class="font-medium flex flex-col p-4 lg:p-0 mt-4 lg:flex-row lg:mt-0">
                        <li class="nav-item">
                            <router-link @click="handleRouterLinkClick" class="px-3 py-2 flex items-center font-medium leading-snug text-white hover:opacity-75" to="/">Home</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link @click="handleRouterLinkClick" class="px-3 py-2 flex items-center font-medium leading-snug text-white hover:opacity-75" to="/quienes-somos">Nosotros</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link @click="handleRouterLinkClick" class="px-3 py-2 flex items-center font-medium leading-snug text-white hover:opacity-75" to="/pricing">Precios</router-link>
                        </li>
                        <template v-if="user.id === null">
                            <li class="nav-item">
                                <router-link @click="handleRouterLinkClick" class="px-3 py-2 flex items-center font-medium leading-snug text-white hover:opacity-75" to="/iniciar-sesion">Iniciar Sesion</router-link>
                            </li>
                        </template>
                        <template v-else>  
                            <template v-if="this.userLogData.rol != 'admin'">
                                <li class="nav-item">
                                    <router-link @click="handleRouterLinkClick" :to="`/usuario/${this.user.id}`" class="px-3 py-2 flex items-center font-medium leading-snug text-white hover:opacity-75">Panel</router-link>
                                </li>
                            </template>
                            <template v-else>
                                <li class="nav-item">
                                    <router-link @click="handleRouterLinkClick" :to="`/dashboard/${this.user.id}`" class="px-3 py-2 flex items-center font-medium leading-snug text-white hover:opacity-75">Dashboard</router-link>
                                </li>
                            </template>
                                <li class="nav-item">
                                    <form action="#" @submit.prevent="handleLogout">
                                        <button @click="handleRouterLinkClick" class="px-3 py-2 flex items-center font-medium leading-snug text-white hover:opacity-75" type="submit">Cerrar Sesion</button>
                                    </form>
                                </li>
                        </template>
                    </ul>
                </div>
            </div>
        </nav>
    </header>
    
    <div class="h-full relative">
        <div v-if="notification.message != null"
        class="p-4 border rounded mb-4 max-w-4xl mx-auto mt-2" 
        :class="{
            'border-emerald-700'    : notification.type == 'success',
            'bg-emerald-100'        : notification.type == 'success',
            'text-emerald-700'      : notification.type == 'success',
            'border-red-700'        : notification.type == 'error',
            'bg-red-100'            : notification.type == 'error',
            'text-red-700'          : notification.type == 'error',
        }">
            <div class="flex gap-2 font-semibold text-[18px]">
                <IconCircleX :size="30" stroke-width="2" stroke="#b91c1c" class="inline-block" v-if="notification.type == 'error'"/>
                <IconCircleCheck :size="30" stroke-width="2" stroke="#047857" class="inline-block" v-if="notification.type == 'success'"/>
                {{ notification.message }}
            </div>
        </div>
        <router-view></router-view>
    </div>

    <footer class="flex items-center justify-center p-5 bg-orange-500 text-white">
        <p>Umbrella Cloud &copy; 2023</p>
    </footer>
</template>