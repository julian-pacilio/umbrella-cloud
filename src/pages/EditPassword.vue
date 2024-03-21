<script>
    import MainButton from "../components/MainButton.vue";
    import BaseLabel from "../components/BaseLabel.vue";
    import BaseInput from "../components/BaseInput.vue";
    import Loader from "../components/Loader.vue";
    import { getUserProfileById, editUserAccountPassword } from '../services/user';
    import { notificationSymbol } from '../symbols/symbol.js';
    export default {
        name: 'EditPassword',
        components: { Loader, BaseLabel, BaseInput, MainButton },
        inject: {
            notification: { from: notificationSymbol }
        },
        data() {
            return {
                editUserPassword: false,
                user_data: {
                    id: null,
                    email: null,
                    name: null,
                    surname: null,
                    photoURL: null,
                    plan_id: null,
                    rol: null,
                },
                form_data_password: {
                    password: '',
                },
                password_repeat: null,
                form_errors: {},
                sent: false,
            }
        },
        methods: {
            async editPassword() {

                this.sent = true;
                this.form_errors = {};

                if(!this.form_data_password.password) {
                    this.form_errors.password = 'La contraseña es obligatoria'
                }
                if(this.form_data_password.password.length < 8) {
                    this.form_errors.password = 'La contraseña debe contener almenos 8 caracteres'
                }
                if(!this.password_repeat) {
                    this.form_errors.password_repeat = 'La contraseña es obligatoria'
                }
                if(this.form_data_password.password != this.password_repeat) {
                    this.form_errors.password_repeat = 'Las contraseñas ingresadas no coinciden'
                }

                if(Object.keys(this.form_errors).length == 0) { 

                    this.editUserPassword = true;

                    await editUserAccountPassword({
                        password : this.form_data_password.password,
                    })
                    .then(error => {
                        if(error.code && error.message) {
                            this.notification.message = 'Ocurrio un error inesperado. Inténtalo de nuevo'
                            this.notification.type = 'error'
                            if(error.code == 'auth/requires-recent-login') {
                                this.notification.message = 'Se produjo un error. Inicia sesión nuevamente e inténtalo de nuevo'
                            } 
                            this.$router.push(`/edit-password/${this.$route.params.id}`)
                        } else {
                            this.notification.message = 'Password actualizado con éxito'
                            this.notification.type = 'success'
                            if(this.user_data.rol != 'admin') {
                                this.$router.push(`/usuario/${this.$route.params.id}`)
                            }
                            else {
                                this.$router.push(`/dashboard/${this.$route.params.id}`)
                            }
                        }
                    })
                    .finally(() => {
                        this.editUserPassword = false;
                    });
                }
            },
        },
        async mounted (){
            this.editUserPassword = true,
            this.user_data = await getUserProfileById(this.$route.params.id)
            this.editUserPassword = false;
        }
    }
</script>

<template>
    <Loader v-if="editUserPassword"/>
    <template v-else>
        <div class="flex items-center justify-center flex-col relative">
            <div class="max-w-xl w-full px-6">
                <h1 class="text-slate-600 font-bold text-4xl pt-14 text-center sm:text-left">Editar Password</h1>
                <div class="my-10">
                    <form action="#" @submit.prevent="editPassword">
                        <div class="mb-5">
                            <BaseLabel for="password">Nuevo Password</BaseLabel>
                            <BaseInput type="password" id="password" v-model="form_data_password.password" :disabled="editUserPassword"/>
                        </div>
                        <div class="mb-5 font-bold text-red-500" v-if="form_errors.password">
                            * {{ form_errors.password }}
                        </div>
                        <div class="mb-8">
                            <BaseLabel for="password_repeat">Repetir Password</BaseLabel>
                            <BaseInput type="password" id="password_repeat" v-model="password_repeat" :disabled="editUserPassword"/>
                        </div>
                        <div class="mb-5 font-bold text-red-500" v-if="form_errors.password_repeat">
                            * {{ form_errors.password_repeat }}
                        </div>
                        <div class="border-t-2 border-gray-300">
                            <MainButton :loading="editUserPassword" size="small" class="mt-8">Guardar Cambios</MainButton>
                        </div>
                    </form>
                    <div v-if="user_data.rol != 'admin'">
                        <router-link class="w-full block rounded p-1.5 mt-8 text-white font-semibold bg-red-500 hover:bg-red-400 active:bg-red-600 transition disabled:bg-slate-200 text-center" :to='`/usuario/${this.$route.params.id}`'>Cancelar</router-link>
                    </div>
                    <div v-else>
                        <router-link class="w-full block rounded p-1.5 mt-8 text-white font-semibold bg-red-500 hover:bg-red-400 active:bg-red-600 transition disabled:bg-slate-200 text-center" :to='`/dashboard/${this.$route.params.id}`'>Cancelar</router-link>
                    </div>
                </div>
            </div>
        </div>
    </template>
</template>
