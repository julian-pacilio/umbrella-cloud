<script>
    import MainButton from "../components/MainButton.vue";
    import ActionButton from "../components/ActionButton.vue";
    import BaseLabel from "../components/BaseLabel.vue";
    import BaseInput from "../components/BaseInput.vue";
    import Loader from "../components/Loader.vue";
    import { editCloudService, getCloudServiceByUid } from "../services/cloud-plans";
    import { IconTrashFilled, IconSettingsFilled, IconCirclePlus } from '@tabler/icons-vue';
    import { notificationSymbol } from "../symbols/symbol";
    export default {
        name: 'EditService',
        components: { Loader, BaseLabel, BaseInput, MainButton, ActionButton, IconTrashFilled, IconSettingsFilled, IconCirclePlus },
        inject: {
            notification: { from: notificationSymbol }
        },
        data() {
            return {
                editServiceLoading: false,
                form_data: {
                    id: null,
                    name : null,
                    price : null,
                    storage: null,
                    users: null,
                    online: null,
                    benefits: []
                },
                form_errors: {},
                sent: false,
                benefit : null,
                benefitEdit : null,
                benefitIndex: null,
                showModal : false,
            }
        },
        methods: {
            async editService() {

                this.sent = true;
                this.form_errors = {};

                if(!this.form_data.name) {
                    this.form_errors.name = 'El nombre del servicio es oblgatorio'
                }
                if(!this.form_data.price) {
                    this.form_errors.price = 'El precio del servicio es oblgatorio'
                }
                if(!this.form_data.storage) {
                    this.form_errors.storage = 'El alamacenamiento del servicio es oblgatorio'
                }
                if(!this.form_data.users) {
                    this.form_errors.users = 'Los usuarios del servicio son oblgatorios'
                }
                if(!this.form_data.online) {
                    this.form_errors.online = 'El estado del servicio es oblgatorio'
                }

                if(Object.keys(this.form_errors).length == 0) {

                    this.editServiceLoading = true;

                    await editCloudService({
                        uid  : this.$route.params.id,
                        data : this.form_data,
                    })
                    .then(() => {
                        this.notification.message = `El servicio ID ${this.form_data.id} ha sido editado con éxito`;
                        this.notification.type = 'success';
                        this.$router.push('/manage-services')
                    })
                    .catch((error)=>{
                        this.notification.message = 'Ocurrio un error inesperado. Inténtalo de nuevo'
                        this.notification.type = 'error'
                        this.$router.push(`/edit-service/${this.$route.params.id}`)
                        setTimeout(() => {
                            this.editServiceLoading = false
                        }, "1000");
                    })
                }
            },
            addBenefit() {
                if(this.benefit != null) {
                    this.form_data.benefits.push(this.benefit)
                    this.benefit = null;
                }
            },
            editBenefit(index) {
                console.log(index)
                this.benefitEdit = this.form_data.benefits[index]
            },
            saveBenefitEdit(benefitIndex) {
                this.form_data.benefits[benefitIndex] = this.benefitEdit;
                this.closeModal();
            },
            openModal(index) {
                this.showModal = true;
                this.benefitIndex = index
            }, 
            closeModal() {
                this.showModal = false;
            },
            deleteBenefit(index) {
                this.form_data.benefits.splice(index, 1)
            }
        },
        async mounted (){
            this.editServiceLoading = true,
            this.form_data = await getCloudServiceByUid(this.$route.params.id)
            this.editServiceLoading = false;
        }
    }
</script>

<template>
    <Loader v-if="editServiceLoading"/>
    <template v-else>
        <div class="flex items-center justify-center flex-col relative">
            <div class="max-w-3xl w-full px-6">
                <h1 class="text-slate-600 font-bold text-4xl pt-14 text-left">Editar Servicio ID {{ form_data.id }}</h1>
                <div class="my-10 pb-10">
                    <form action="#" @submit.prevent="editService">
                        <div class="mb-5">
                            <BaseLabel for="name">Nombre</BaseLabel>
                            <BaseInput type="text" id="name" v-model="form_data.name" :disabled="editServiceLoading"/>
                        </div>
                        <div class="mb-5 font-bold text-red-500" v-if="form_errors.name">
                            * {{ form_errors.name }}
                        </div>
                        <div class="mb-5">
                            <BaseLabel for="price">Precio</BaseLabel>
                            <BaseInput type="text" id="price" v-model="form_data.price" :disabled="editServiceLoading"/>
                        </div>
                        <div class="mb-5 font-bold text-red-500" v-if="form_errors.price">
                            * {{ form_errors.price }}
                        </div>
                        <div class="mb-5">
                            <BaseLabel for="storage">Almacenamiento</BaseLabel>
                            <BaseInput type="text" id="storage" v-model="form_data.storage" :disabled="editServiceLoading"/>
                        </div>
                        <div class="mb-5 font-bold text-red-500" v-if="form_errors.storage">
                            * {{ form_errors.storage }}
                        </div>
                        <div class="mb-5">
                            <BaseLabel for="users">Usuarios</BaseLabel>
                            <BaseInput type="text" id="users" v-model="form_data.users" :disabled="editServiceLoading"/>
                        </div>
                        <div class="mb-5 font-bold text-red-500" v-if="form_errors.users">
                            * {{ form_errors.users }}
                        </div>
                        <div class="mb-5">
                            <BaseLabel for="online">Estado del servicio</BaseLabel>
                            <select class="w-full border border-orange-500 rounded p-2 bg-white disabled:bg-gray-200" name="online" id="online" v-model="form_data.online" :disabled="editServiceLoading">
                                <option value="Activo">Activo</option>
                                <option value="Revisión">Revisión</option>
                                <option value="Inactivo">Inactivo</option>
                            </select>
                        </div>
                        <div class="pb-8 border-b-2 border-gray-300">
                            <BaseLabel for="benefits">Beneficios</BaseLabel>
                            <div class="flex items-start gap-2">
                                <textarea id="benefits" class="w-full border border-orange-500 rounded p-2 resize-none mb-0 h-[70px]" v-model="benefit" :disabled="editServiceLoading"></textarea>
                                <ActionButton type="button" class="bg-blue-500 p-2 rounded-md hover:bg-blue-400 active:bg-blue-600 h-[70px] w-[60px]" @click="addBenefit()">
                                    <IconCirclePlus :size="26" stroke-width="1" />
                                </ActionButton >
                            </div>
                        </div>
                        <ul class="my-8">
                            <template v-if="form_data.benefits != ''">
                                <li v-for="(benefit, index) in form_data.benefits" :key="benefit.id" class="mb-5 grid grid-cols-6 gap-1 text-l justify-center items-center">
                                    <div class="col-start-1 col-end-5">{{ benefit }}</div>
                                    <div class="flex justify-end">
                                        <ActionButton type="button" class="bg-blue-500 p-2 rounded-md hover:bg-blue-400 active:bg-blue-600" @click="editBenefit(index), openModal(index)">
                                            <IconSettingsFilled :size="26" stroke-width="1" />
                                        </ActionButton >
                                    </div>
                                    <div class="flex justify-end">
                                        <ActionButton type="button" class="bg-red-500 p-2 rounded-md hover:bg-red-400 active:bg-red-600" @click="deleteBenefit(index)">
                                            <IconTrashFilled  :size="26" stroke-width="1" />
                                        </ActionButton >
                                    </div>
                                </li>
                            </template>
                            <template v-else>
                                <li>No hay beneficios cargados</li>
                            </template>
                        </ul>
                        <div class="border-t-2 border-gray-300">
                            <MainButton :loading="editServiceLoading" size="small" class="mt-8">Guardar Cambios</MainButton>
                        </div>
                    </form>
                    <div>
                        <router-link class="w-full block rounded p-1.5 mt-8 text-white font-semibold bg-red-500 hover:bg-red-400 active:bg-red-600 transition disabled:bg-slate-200 text-center" to="/manage-services">Cancelar</router-link>
                    </div>
                </div>
            </div>
        </div>
    </template>
    <template v-if="showModal">
        <div class="bg-slate-800 bg-opacity-50 flex justify-center items-center absolute top-0 right-0 bottom-0 left-0">
            <div class=" bg-white px-16 py-14 rounded-md sm:w-[400px] md:w-[600px]">
                <h1 class="text-2xl mb-4 font-bold text-slate-500">Editar Beneficio {{ benefitIndex + 1 }}</h1>
                    <form @submit.prevent="saveBenefitEdit(benefitIndex)">
                        <div class="mb-8">
                            <BaseLabel for="benefit_edit">Beneficio</BaseLabel>
                            <textarea id="benefit_edit" class="w-full border border-orange-500 rounded p-2 resize-none mb-0 sm:h-[100px]" v-model="benefitEdit"></textarea>
                        </div>
                        <div class="flex justify-end w-full gap-2">
                            <button type="button" class="bg-red-500 hover:bg-red-400 active:bg-red-600 px-7 py-2 rounded-md text-md text-white font-semibold w-full" @click="closeModal()">Cancelar</button>
                            <button type="submit" class="bg-green-500 hover:bg-green-400 active:bg-green-600 px-7 py-2 rounded-md text-md text-white font-semibold w-full">Guardar</button>
                       </div>
                    </form>
                </div>
            </div>
    </template>
</template>