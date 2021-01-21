<template>
  <div class="container">
        <div v-if="chats.length" class="chats mainList">
            <template
                v-for="chat in chats"
                :key="chat.name"
            >

                <div class="chats__item mainList__elem" :class="{'chats__item--active': getNotificationsLength(chat)}">
                    <router-link :to="{path: '/'+chat.users.find(user => user != authorizedUser)+'/chat'}"></router-link>
                    <div class="userIcon" :style="`background-image: url(${BACKEND_DOMAIN+userObj(chat).photo})`"></div>
                    <div class="chats__text">
                        <div class="chats__username">{{userObj(chat).name}}</div>
                        <div v-if="chat.messages.length" class="chats__messageText">{{getLastMessage(chat)}}</div>
                    </div>
                    <div class="chats__time">{{getLastTime(chat).split(',')[3]}}</div>
                    <MessageNotification :notificationCount="getNotificationsLength(chat)" color="grey" class="chats__newMessagesCount"></MessageNotification>
                </div>
                
            </template>
        </div>
        <div class="chats__noChats" v-else>No chats found</div>   
  </div>
</template>

<script>
    import {mapState} from 'vuex'
    import BACKEND_DOMAIN from '../messanger-config';
    // components
    import MessageNotification from '../components/MessageNotification'

    export default {
        name: "Chats",
        data(){
            return{
                BACKEND_DOMAIN: BACKEND_DOMAIN
            }
        },
        components:{
            MessageNotification
        },
        computed: {
            ...mapState([
                'contacts',
                'chats',
                'authorizedUser'
            ]),
            authorizedUserObj(){
                return this.$parent.$parent.getAuthObj()
            },
        },
        watch:{
            authorizedUser: function(val){
                if(!val){
                    this.$router.push('/')
                }
            },
            chats: function(){
                this.sortChatsByActivity()
            },
        },
        methods:{
            userObj(chat){
                let user = chat.users.find(user => user != this.authorizedUser)
                let userObj = this.contacts.find(contact => contact.name == user)
                return userObj
            },
            sortChatsByActivity(){
                let v = this

                this.chats.sort(function (elem, nextElem) {
                    let time = v.getLastTime(elem)
                    let timeNext = v.getLastTime(nextElem)

                    let elemDate = new Date(time)
                    let nextElemDate = new Date(timeNext)

                    if (elemDate > nextElemDate) return -1; 
                    if (elemDate == nextElemDate) return 0;
                    if (elemDate < nextElemDate) return 1;

                });
            },
            getLastTime(chat){
                if(chat.messages.length){
                    let dataTime = chat.messages[chat.messages.length-1].timeOfSend
                    return dataTime
                }else{
                    let dataTime = chat.timeOfCreate
                    return dataTime
                }
            },
            getLastMessage(chat){
                let text = chat.messages[chat.messages.length-1].text

                if(text.length > 30){
                    text = text.substr(0, 30)+" . . ."
                }

                return text
            },
            getNotificationsLength(chat){
                if(this.authorizedUserObj){
                    let length = this.authorizedUserObj.notifications.filter(n => n.messageFrom == chat.users.find(user => user != this.authorizedUser)).length
                    return length
                }else{
                    return false
                }
            },
        },
        mounted(){
            if(!this.authorizedUser){
                this.$router.push('/404')
            }else{
                this.sortChatsByActivity()
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../assets/colors';
    .chats {
        padding-bottom: 20px;
        display: flex;
        flex-flow: column;
        position: relative;
        &__item {
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-right: 70px;
            &--active {
                background-color: $chat-item-active;
                border-bottom: 1px ridge $base-color;
            }
        }
        &__newMessagesCount {
            position: absolute;
            right: 20px;
        }
        &__text {
            height: 100%;
            display: flex;
            flex-flow: column;
            justify-content: space-between;
            position: relative;
            a {
                position: absolute;
                width: 100%;
                height: 100%;
            }
        }
        &__username {
            color: $base-font-color;
        }
        &__messageText {
            color: lighten($base-font-color, 20%);
            width: 292px;
        }
        &__time {
            color: lighten($base-font-color, 20%);
        }
        &__noChats {
            text-align: center;
            position: absolute;
            top: calc(50vh - 100px);
            width: 100%;
        }
    }

    // MEDIA -------------
    @media (max-width: 575px) {
        .chats__messageText{
            width: 200px;
            word-wrap: break-word;
        }
    }
    @media (max-width: 455px) {
        .chats__messageText{
            width: 100px;
        }
        .chats__item{
            font-size: 14px;
        }
    }
    @media (max-width: 355px) {
        .chats__item{
            padding-right: 25px;
        }
        .chats__newMessagesCount{
            right: 5px;
        }
    }
</style>