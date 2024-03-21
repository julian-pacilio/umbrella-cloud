<script>
    import MainButton from "../components/MainButton.vue";
    import BaseLabel from "../components/BaseLabel.vue";
    import BaseInput from "../components/BaseInput.vue";
    import { login } from "../services/auth.js";
    import { validateEmail } from "../helpers/email.js";
    import { notificationSymbol } from '../symbols/symbol.js';
    export default {
        name : 'Login',
        components: { MainButton, BaseLabel, BaseInput },
        emits: ['login'],
        inject: {
            notification: { from: notificationSymbol }
        },
        data() {
            return {
                loginLoading: false,
                form: {
                    email: null,
                    password: null,
                },
                form_errors: {},
                sent: false,
            }
        },
        methods: {
            doLogin() {

                this.sent = true;
                this.form_errors = {};

                if(!validateEmail(this.form.email)) {
                    this.form_errors.email = 'El email debe tener un formato válido'
                }

                if(!this.form.email) {
                    this.form_errors.email = 'El email no puede quedar vacío'
                }

                if(!this.form.password) {
                    this.form_errors.password = 'La contraseña no puede quedar vacía'
                }

                if(Object.keys(this.form_errors).length == 0) {

                    this.loginLoading = true;

                    login({
                        ...this.form,
                    })
                    .then(user => {
                        if(user.code && user.message) {
                            if(user.code == 'auth/invalid-login-credentials') {
                                this.notification.message = 'Error: Credenciales de acceso no válidas'
                            }
                            this.notification.type = 'error'
                            this.$router.push('/iniciar-sesion')
                        } else {
                            this.$emit('login', {...user});
                            this.notification.message = 'Sesión Iniciada con Éxito'
                            this.notification.type = 'success'
                            this.$router.push('/')
                        }
                    })
                    .finally(() => {
                        this.loginLoading = false;
                    });
                }                
            },
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
    <div class="min-h-screen flex items-center justify-center">
        <div class="max-w-md w-full pb-16 mx-5">
            <picture class="flex justify-center my-8">
                <img src="/img/logo-login.svg" alt="Logo" class="h-12">
            </picture>
            <h1 class="text-2xl font-semibold text-center text-slate-600 mt-8 mb-6">Inicia sesión</h1>
            <form action="#" @submit.prevent="doLogin" novalidate>
                <div class="mb-5">
                    <BaseLabel for="email">Email</BaseLabel>
                    <BaseInput type="email" id="email" v-model="form.email" :disabled="loginLoading"/>
                </div>
                <div class="mb-5 font-bold text-red-500" v-if="form_errors.email">
                    * {{ form_errors.email }}
                </div>
                <div class="mb-5">
                    <BaseLabel for="password">Contraseña</BaseLabel>
                    <BaseInput type="password" id="password" v-model="form.password" :disabled="loginLoading"/>
                </div>
                <div class="mb-5 font-bold text-red-500" v-if="form_errors.password">
                    * {{ form_errors.password }}
                </div>                
                <MainButton :loading="loginLoading" size="small" class="mt-10">Iniciar Sesion</MainButton>
            </form>
            <p class=" my-5 text-center text-slate-600">¿Aun no te encuentras registrado?</p>
            <div>
                <router-link class="w-full block rounded text-center p-1.5 text-white font-semibold bg-orange-500  hover:bg-orange-400 active:bg-orange-600 transition"
                    to="/registrarse">Registarse</router-link>
            </div>
        </div>
    </div>
</template>

