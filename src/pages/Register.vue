<script>
    import MainButton from "../components/MainButton.vue";
    import BaseLabel from "../components/BaseLabel.vue";
    import BaseInput from "../components/BaseInput.vue";
    import { register } from "../services/auth.js";
    import { validateEmail } from "../helpers/email.js";
    import { notificationSymbol } from '../symbols/symbol.js';
    export default {
        name : 'Register',
        components: { MainButton, BaseLabel, BaseInput },
        inject: {
            notification: { from: notificationSymbol }
        },
        data() {
            return {
                registerLoading: false,
                newUser: {
                    email: null,
                    password: '',
                    name: null,
                    surname: null,
                    photoURL: null,
                    plan_id: null,
                    rol: 'user'
                },
                form_errors: {},
                sent: false,
                password_repeat: '',
            }
        },
        methods: {
            async handleSubmit() {

                this.sent = true;
                this.form_errors = {};

                if(!this.newUser.name) {
                    this.form_errors.name = 'El nombre del usuario es oblgatorio'
                }
                if(!this.newUser.surname) {
                    this.form_errors.surname = 'El apellido del usuario es oblgatorio'
                }

                if(!validateEmail(this.newUser.email)) {
                    this.form_errors.email = 'El email debe tener un formato válido'
                }
                if(!this.newUser.email) {
                    this.form_errors.email = 'El email no puede quedar vacío'
                }

                if(this.newUser.password.length < 8) {
                    this.form_errors.password = 'La contraseña debe contener almenos 8 caracteres'
                }
                if(!this.newUser.password) {
                    this.form_errors.password = 'La contraseña es obligatoria'
                }

                if(!this.password_repeat) {
                    this.form_errors.password_repeat = 'La contraseña es obligatoria'
                }
                if(this.newUser.password != this.password_repeat) {
                    this.form_errors.password_repeat = 'Las contraseñas ingresadas no coinciden'
                }

                if(Object.keys(this.form_errors).length == 0) { 

                    this.registerLoading = true;

                    register({
                        ...this.newUser 
                    })
                    .then(user => {
                        if(user.code && user.message) { 
                            if(user.code == 'auth/email-already-in-use') {
                                this.notification.message = 'La dirección email ya se encuentra registrada'
                            }
                            this.notification.type = 'error';
                            this.$router.push('/registrarse')
                        } else {
                            this.notification.message = 'Te has registrado correctamente. Verifica tu Panel'
                            this.notification.type = 'success';
                            this.$router.push('/')
                        }
                    })
                    .finally(() => {
                        this.registerLoading = false;
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
            <h1 class="text-2xl font-semibold text-center text-slate-600 mt-8 mb-6">Crear cuenta</h1>
            <form action="#" @submit.prevent="handleSubmit" novalidate>
                <div class="mb-5">
                    <BaseLabel for="name">Nombre</BaseLabel>
                    <BaseInput type="text" id="name" v-model="newUser.name" :disabled="registerLoading"/>
                </div>
                <div class="mb-5 font-bold text-red-500" v-if="form_errors.name">
                    * {{ form_errors.name }}
                </div>               
                <div class="mb-5">
                    <BaseLabel for="surname">Apellido</BaseLabel>
                    <BaseInput type="text" id="surname" v-model="newUser.surname" :disabled="registerLoading"/>
                </div>
                <div class="mb-5 font-bold text-red-500" v-if="form_errors.surname">
                    * {{ form_errors.surname }}
                </div> 
                <div class="mb-5">
                    <BaseLabel for="email">Email</BaseLabel>
                    <BaseInput type="email" id="email" v-model="newUser.email" :disabled="registerLoading"/>
                </div>
                <div class="mb-5 font-bold text-red-500" v-if="form_errors.email">
                    * {{ form_errors.email }}
                </div> 
                <div class="mb-5">
                    <BaseLabel for="password">Contraseña</BaseLabel>
                    <BaseInput type="password" id="password" v-model="newUser.password" :disabled="registerLoading"/>
                </div>
                <div class="mb-5 font-bold text-red-500" v-if="form_errors.password">
                    * {{ form_errors.password }}
                </div>
                <div class="mb-5">
                    <BaseLabel for="password_repeat">Repetir Contraseña</BaseLabel>
                    <BaseInput type="password" id="password_repeat" v-model="password_repeat" :disabled="registerLoading"/>
                </div>
                <div class="mb-5 font-bold text-red-500" v-if="form_errors.password_repeat">
                    * {{ form_errors.password_repeat }}
                </div>
                <MainButton :loading="registerLoading" size="small" class="mt-10">Crear Cuenta</MainButton>
                <div>
                    <router-link class="w-full block rounded p-1.5 mt-8 text-white font-semibold bg-red-500 hover:bg-red-400 active:bg-red-600 transition disabled:bg-slate-200 text-center" to='/iniciar-sesion'>Cancelar</router-link>
                </div>
            </form>
        </div>
    </div>
</template>