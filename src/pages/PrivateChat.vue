<script>
import BaseTextarea from '../components/BaseTextarea.vue';
import Loader from '../components/Loader.vue';
import MainButton from '../components/MainButton.vue';
import { sendPrivateChatMessage, subscribeToPrivateChat } from '../services/private-chat';
import { suscribeToAuth } from '../services/auth';
import { getUserProfileById } from '../services/user';
import { dateToString } from '../helpers/date';


export default {
    name: 'PrivateChat',
    components: { Loader, BaseTextarea, MainButton },
    data() {
        return {
            userLoading: true,
            user: {
                id: null,
                email: null,
            },
            authUser: {
                id: null,
                email: null,
            },
            unsubscribeAuth: () => {},
            newMessage : {
                message: '',
            },
            messagesLoading: true,
            messages: [],
            unsubscribeMessages: () => {},
        };
    },
    methods: {
        handleSendMessage() {
            sendPrivateChatMessage({
                senderId: this.authUser.id,
                recieverId: this.user.id,
                message : this.newMessage.message,
            });
            this.newMessage.message = '';
        },
        formatDate(date) {
            return dateToString(date)
        },
    },
    async mounted() {
        this.userLoading = true;
        this.user = await getUserProfileById(this.$route.params.id);
        this.unsubscribeAuth = suscribeToAuth(newUser => this.authUser = newUser);
        this.userLoading = false;

        this.messagesLoading = true;
        this.unsubscribeMessages = await subscribeToPrivateChat(
            {
                senderId : this.authUser.id,
                recieverId : this.user.id,
            },
            (newMessages) => this.messages = newMessages
        );
        this.messagesLoading = false;
    },
    unmounted () {
        this.unsubscribeAuth();
        this.unsubscribeMessages();
    }
}
</script>

<template>
    <Loader v-if="userLoading"/>
    <template v-else>
        <h1 class="text-slate-600 text-2xl md:text-3xl font-bold py-14 text-center">Conversación con {{user.email}}</h1>   
        <div class="flex items-center justify-center flex-col">
            <div class="max-w-3xl pt-0 pb-14 p-3 w-full">
                <h2 class="sr-only">Mensajes</h2>
                <div class="flex flex-col items-start mb-4 border-2 rounded border-orange-300 p-4 relative min-h-[400px] shadow-md">
                    <Loader v-if="messagesLoading"/>
                    <template v-else>
                        <div v-for="message in messages" 
                                    :key="message.id" 
                                    class="mb-2 max-w-[60] p-3 rounded"
                                    :class="{
                                            'bg-yellow-200' : message.senderId !== authUser.id,
                                            'bg-gray-200'   : message.senderId === authUser.id,
                                            'self-end'        : message.senderId === authUser.id,
                                    }"
                        >
                            <div>{{ message.message }}</div>
                            <div class="text-right">{{ formatDate(message.created_at) || 'Enviando...'}}</div>
                        </div>
                    </template> 
                </div>
                <h2 class="sr-only">Enviar Mensajes</h2>
                <form action="#" @submit.prevent="handleSendMessage" class="flex gap-2 h-[50px] mb-24">
                    <label for="message" class="sr-only">Mensaje</label>
                    <BaseTextarea id="message" class="w-[85%]" v-model="newMessage.message"/>
                    <MainButton class="w-[15%]">Enviar</MainButton>
                </form>
            </div>
        </div>
    </template>
</template>