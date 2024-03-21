<script>
    import { deleteCloudService, getCloudServiceByUid } from "../services/cloud-plans";
    import MainButton from "../components/MainButton.vue";
    import Loader from "../components/Loader.vue";
    import { notificationSymbol } from "../symbols/symbol";
    export default {
        name: 'DeleteService',
        components: { MainButton, Loader },
        inject: {
            notification: { from: notificationSymbol }
        },
        data() {
            return {
                data: {
                    id: null,
                    name : null,
                    price : null,
                    storage: null,
                    users: null,
                    online: null,
                    benefits: []
                },
                deleteServiceLoading: false,
                showModal : false,
            }
        },
        methods: {
             async deleteService() {
                
                this.deleteServiceLoading = true;

                await deleteCloudService(this.$route.params.id)
                .then(() => {
                    this.showModal = false;
                    this.notification.message = `El servicio ID ${this.data.id} ha sido eliminado con éxito`;
                    this.notification.type = 'success';
                    this.$router.push('/manage-services')
                })
                .catch((error) => {
                    this.showModal = false;
                    this.notification.message = 'Ocurrio un error inesperado. Inténtalo de nuevo'
                    this.notification.type = 'error'
                    this.$router.push(`/delete-service/${this.$route.params.id}`)
                    setTimeout(() => {
                        this.deleteServiceLoading = false
                    }, "1000");
                });
            },
            openModal() {
                this.showModal = true;
            },
            closeModal() {
                this.showModal = false;
            }, 
        },
        async mounted () {
            this.deleteServiceLoading = true;
            this.data = await getCloudServiceByUid(this.$route.params.id)
            this.deleteServiceLoading = false;
        }
    }
</script>

<template>
    <Loader v-if="deleteServiceLoading"/>
    <template v-else>
        <div class="flex items-center justify-center flex-col relative">
            <div class="max-w-3xl w-full px-6">
                <h1 class="text-slate-600 font-bold text-4xl pt-14 text-left">Eliminar Servicio ID {{ data.id }}</h1>
                <section class="my-10 pb-10">
                    <h2 class="mb-5 text-slate-600 font-bold text-2xl text-left">{{ data.name }}</h2>
                    <ul class="mb-8 block font-sans text-base font-normal leading-relaxed text-gray-700 antialiased">
                        <li class="mb-5">
                            <p><span class="mr-2 inline-block font-bold text-lg text-slate-600">Precio:</span>{{ data.price }} USD</p>
                        </li>
                        <li class="mb-5">
                            <p><span class="mr-2 inline-block font-bold text-lg text-slate-600">Almacenamiento:</span>{{ data.storage }} GB</p>
                        </li>
                        <li class="mb-5">
                            <p><span class="mr-2 inline-block font-bold text-lg text-slate-600">Usuarios:</span>{{ data.users }}</p>
                        </li>
                        <li class="mb-5">
                            <p><span class="mr-2 inline-block font-bold text-lg text-slate-600">Estado:</span>{{ data.online }}</p>
                        </li>
                    </ul>
                    <div class="mb-5">
                        <p class="mr-2 inline-block font-bold text-lg text-slate-600">Beneficios</p>
                    </div>
                    <div class="mb-5 border-b-2 border-t-2 border-gray-300">
                        <ul class="my-8 text-slate-600 list-image-[url(img/marca-de-verificacion.png)] list-inside">
                        <template v-if="data.benefits != ''">
                            <li v-for="(benefit) in data.benefits" :key="benefit.index" class="mb-5">
                                {{ benefit }}
                            </li>
                        </template>
                        <template v-else>
                             <li>No hay beneficios cargados</li>
                        </template>
                        </ul>
                    </div>
                    <div>
                        <MainButton @click="openModal()" size="small" class="mt-10">Confirmar</MainButton>
                    </div>
                    <div>
                        <router-link class="w-full block rounded p-1.5 mt-8 text-white font-semibold bg-red-500 hover:bg-red-400 active:bg-red-600 transition disabled:bg-slate-200 text-center" to="/manage-services">Cancelar</router-link>
                    </div>
                </section>
            </div>
        </div>
    </template>
    <template v-if="showModal">
            <div class="bg-slate-800 bg-opacity-50 flex justify-center items-center absolute top-0 right-0 bottom-0 left-0 h-[1fr]">
                <div class=" bg-white p-14 rounded-md">
                    <h1 class="text-2xl mb-4 font-bold text-slate-500 text-center">Confirmar Eliminación</h1>
                    <p class="mb-4 ">¿Estas seguro que deseas "Eliminar el Servicio <b>{{ data.name }}</b>"?</p>
                    <p class="mb-8 ">Recuerda que la acción que estas a punto de cometer es irreversible</p>
                    <form @submit.prevent="deleteService">
                        <div class="flex w-full gap-10 justify-center">
                            <button type="button" class="bg-red-500 hover:bg-red-400 active:bg-red-600 px-7 py-2 rounded-md text-md text-white font-semibold w-full" @click="closeModal()">Cancelar</button>
                            <MainButton type="submit" class="px-7 py-2 rounded-md text-md text-white font-semibold" :loading="deleteServiceLoading">Confirmar</MainButton>
                        </div>
                    </form>
                </div>
            </div>
    </template>
</template>