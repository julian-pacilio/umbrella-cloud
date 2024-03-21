<script>
    import MainButton from "../components/MainButton.vue";
    import BaseLabel from "../components/BaseLabel.vue";
    import BaseInputFile from "../components/BaseInputFile.vue";
    import Loader from "../components/Loader.vue";
    import { getUserProfileById } from '../services/user';
    import { editUserProfileAvatar } from '../services/auth';
    import { notificationSymbol } from '../symbols/symbol.js';

    export default {
        name: 'EditAvatar',
        components: { Loader, BaseLabel, MainButton, BaseInputFile},
        inject: {
            notification: { from: notificationSymbol }
        },
        data() {
            return {
                editUserData: false,
                user_data : {
                    id: null,
                    name: null,
                    surname: null,
                    email: null,
                    rol: null
                },
                avatar_data: {
                    file: null,
                    preview: null,
                },
                form_errors: {},
                sent: false,
            }
        },
        methods: {
            handleAvatarFileChange(e) {

                this.form_errors = {};

                this.avatar_data.file = e.target.files[0]

                let validFormats = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']

                if(!validFormats.includes(this.avatar_data.file.type)) {
                    document.querySelector('input').value = '';
                    this.avatar_data.preview = null;
                    this.form_errors.file = `Error: Formato ${this.avatar_data.file.type} no válido como archivo`;
                } else {
                    const reader = new FileReader();
                    reader.addEventListener('load', () => {
                        this.avatar_data.preview = reader.result;
                    })
                    reader.readAsDataURL(this.avatar_data.file)
                }
            },
            async editUserAvatar() {

                this.sent = true;
                this.form_errors = {};

                if(!this.avatar_data.file) {
                    this.form_errors.file = 'Debes selecciónar un archivo'
                }

                if(this.avatar_data.file && this.avatar_data.preview == null) {
                    this.form_errors.file = 'Debes selecciónar un archivo'
                }

                if(Object.keys(this.form_errors).length == 0) { 
                    this.editUserData = true;

                    await editUserProfileAvatar(this.avatar_data.file)
                    .then(error => {
                        if(error.code && error.message) {
                            this.notification.message = 'Ocurrio un error inesperado. Inténtalo de nuevo'
                            this.notification.type = 'error'

                            this.avatar_data.preview = null
                            this.$router.push(`/edit-user-avatar/${this.user_data.id}`)
                        } else {
                            this.notification.message = 'Avatar actualizado con éxito'
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
                        this.editUserData = false;
                    });
                }
            },
        },
        async mounted (){
            this.editUserData = true,
            this.user_data = await getUserProfileById(this.$route.params.id)
            this.editUserData = false;
        }
    }
</script>

<template>
    <Loader v-if="editUserData"/>
    <template v-else>
        <div class="flex items-center justify-center flex-col relative">
            <div class="max-w-xl w-full px-6">
                <h1 class="text-slate-600 font-bold text-4xl pt-14 text-center sm:text-left">Editar Avatar</h1>
                <div class="my-10">
                    <form action="#" @submit.prevent="editUserAvatar">
                        <div class="mb-5">
                            <BaseLabel for="avatar">Nuevo Avatar</BaseLabel>
                            <BaseInputFile type="file" id="avatar" name="avatar"  :disabled="editUserData" @change="handleAvatarFileChange"/>
                        </div>
                        <div class="mb-5 font-bold text-red-500" v-if="form_errors.file">
                            * {{ form_errors.file }}
                        </div>
                        <div class="mb-5" v-if="avatar_data.preview != null">
                            <p class="font-bold mb-3 text-lg text-slate-600">Previsualización de imagen</p>
                            <picture>
                                <img :src="avatar_data.preview" alt="avatar-picture" class="mt-5 mb-8 mx-auto rounded-md">
                            </picture>
                        </div>
                        <div class="border-t-2 border-gray-300">
                            <MainButton :loading="editUserData" size="small" class="mt-8">Guardar Cambios</MainButton>
                        </div>
                    </form>
                    <div v-if="user_data.rol != 'admin'">
                        <router-link class="w-full block rounded p-1.5 mt-8 text-white font-semibold bg-red-500 hover:bg-red-400 active:bg-red-600 transition disabled:bg-slate-200 text-center" :to='`/usuario/${this.user_data.id}`'>Cancelar</router-link>
                    </div>
                    <div v-else>
                        <router-link class="w-full block rounded p-1.5 mt-8 text-white font-semibold bg-red-500 hover:bg-red-400 active:bg-red-600 transition disabled:bg-slate-200 text-center" :to='`/dashboard/${this.user_data.id}`'>Cancelar</router-link>
                    </div>
                </div>
            </div>
        </div>
    </template>
</template>
