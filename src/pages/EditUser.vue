<script>
    import MainButton from "../components/MainButton.vue";
    import BaseLabel from "../components/BaseLabel.vue";
    import BaseInput from "../components/BaseInput.vue";
    import Loader from "../components/Loader.vue";
    import { getUserProfileById, editUserProfile } from '../services/user';
    import { notificationSymbol } from '../symbols/symbol.js';

    export default {
        name: 'EditUser',
        components: { Loader, BaseLabel, BaseInput, MainButton},
        inject: {
            notification: { from: notificationSymbol }
        },
        data() {
            return {
                editUserData: false,
                user_data :{},
                form_data: {
                    name : null,
                    surname : null,
                },
                form_errors: {},
                sent: false,
            }
        },
        methods: {
            async editUser() {

                this.sent = true;
                this.form_errors = {};

                if(!this.form_data.name) {
                    this.form_errors.name = 'El nombre del usuario es oblgatorio'
                }
                if(!this.form_data.surname) {
                    this.form_errors.surname = 'El apellido del usuario es oblgatorio'
                }

                if(Object.keys(this.form_errors).length == 0) { 

                    this.editUserData = true;
                    await editUserProfile({
                        uid  : this.$route.params.id,
                        data : this.form_data,
                    })                    
                    .then(error => {
                        if(error.code && error.message) {
                            this.notification.message = 'Ocurrio un error inesperado. Inténtalo de nuevo'
                            this.notification.type = 'error'
                            this.$router.push(`/edit-user/${this.$route.params.id}`)
                        } else {
                            this.notification.message = 'Datos actualizados con éxito',
                            this.notification.type = 'success'
                            if(this.user_data.rol != 'admin') {
                                this.$router.push(`/usuario/${this.$route.params.id}`)
                            }
                            else {
                                this.$router.push(`/dashboard/${this.$route.params.id}`)
                            }
                        }
                    }).finally(() => {
                        this.editUserData = false;
                    });
                }
            }
        },
        async mounted (){
            this.editUserData = true,
            this.user_data = await getUserProfileById(this.$route.params.id)
            this.form_data.name = this.user_data.name
            this.form_data.surname = this.user_data.surname
            this.editUserData = false;
        }
    }
</script>

<template>
    <Loader v-if="editUserData"/>
    <template v-else>
        <div class="flex items-center justify-center flex-col relative">
            <div class="max-w-xl w-full px-6">
                <h1 class="text-slate-600 font-bold text-4xl pt-14 text-center sm:text-left">Editar Datos</h1>
                <div class="my-10">
                    <form action="#" @submit.prevent="editUser">
                        <div class="mb-5">
                            <BaseLabel for="name">Nombre</BaseLabel>
                            <BaseInput type="text" id="name" v-model="form_data.name" :disabled="editUserData"/>
                        </div>
                        <div class="mb-5 font-bold text-red-500" v-if="form_errors.name">
                            * {{ form_errors.name }}
                        </div>
                        <div class="mb-8">
                            <BaseLabel for="surname">Apellido</BaseLabel>
                            <BaseInput type="text" id="surname" v-model="form_data.surname" :disabled="editUserData"/>
                        </div>
                        <div class="mb-5 font-bold text-red-500" v-if="form_errors.surname">
                            * {{ form_errors.surname }}
                        </div>
                        <div class="border-t-2 border-gray-300">
                            <MainButton :loading="editUserData" size="small" class="mt-8">Guardar Cambios</MainButton>
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
