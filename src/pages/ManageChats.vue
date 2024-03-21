<script>
import Loader from '../components/Loader.vue';
import { getAllUsers } from '../services/user';
import { getPrivateChatDocs } from '../services/private-chat';
import { getAllCloudServices } from '../services/cloud-plans';
import { IconUserCircle } from '@tabler/icons-vue';
    export default {
    name: 'ManageChats',
    components: { Loader, IconUserCircle },
    data() {
        return {
            userLoading: true,
            chats: [],
            usersData: [],
            cloudPlans: [],
            activeChats: [],
            obtainActiveChats: () => {
                this.usersData.forEach(user => {
                    this.chats.forEach(chat => {
                        if (user.id === chat.recieverId) {
                            this.activeChats.push({
                                "id"        : user.id,
                                "name"      : user.name,
                                "surname"   : user.surname,
                                "email"     : user.email,
                                "chat"      : user.chat,
                                "photoURL"  : user.photoURL,
                                "plan_id" : user.plan_id,
                            })
                        }
                    })
                });
            },
        };
    },
    methods: {
        getCloudPlanData(plan_id) {
            let cloudPlanName
            this.cloudPlans.forEach(cloudPlan => {
                if (plan_id === cloudPlan.uid) {
                    cloudPlanName = cloudPlan.name
                }
            })
            return cloudPlanName
        }
    },
    async mounted() {
        this.userLoading = true;
        await getAllUsers(usersData => {
            this.usersData = usersData;
        });
        this.chats = await getPrivateChatDocs(this.$route.params.id);
        await getAllCloudServices(cloudPlans => {
            this.cloudPlans = cloudPlans;
        });
        this.obtainActiveChats();
        this.userLoading = false;
    },
}
</script>

<template>
    <Loader v-if="userLoading"/>
    <template v-else>
        <div class="flex items-center justify-center flex-col relative">
            <div class="max-w-3xl w-full px-6">
                <h1 class="text-slate-600 font-bold text-4xl pt-14 text-left">Administrar Chats Activos</h1>
                <section class="mb-10 my-10">
                    <ul class="grid sm:grid-cols-2 xl:grid-cols-3">
                        <li v-for="activeChat, index in activeChats" :key="index" class="mb-5 py-5 flex flex-col justify-center items-center gap-4">
                            <picture v-if="activeChat.photoURL != null">
                                <img :src="activeChat.photoURL" alt="avatar-picture" class="rounded-lg w-[125px] h-[125px] shadow-lg object-cover">
                            </picture>
                            <div v-else class="w-[125px] h-[125px]">
                                <IconUserCircle size="100%" stroke-width="1.5" stroke="#f97316" class=" drop-shadow-lg"/>
                            </div>
                            <div class="text-center">
                                <h3 class="font-bold text-xl">{{ activeChat.name }} {{ activeChat.surname }}</h3>
                                <p>{{ activeChat.email }}</p>
                                <p v-if="activeChat.plan_id != null" class="font-semibold">{{ getCloudPlanData(activeChat.plan_id) }}</p>
                                <p v-else class="font-semibold">Sin Suscripción</p>
                            </div>
                            <div>
                                <router-link class="py-2 hover:opacity-75 block rounded p-1.5 text-white font-semibold bg-orange-500  hover:bg-orange-400 active:bg-orange-600 transition" :to="`${activeChat.chat}`">
                                    Ver Chat
                                </router-link>
                            </div>
                        </li>
                    </ul>
                </section>
            </div>
        </div>
    </template>
</template>

