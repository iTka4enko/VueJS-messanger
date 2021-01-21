<template>
  <div class="container">
            <div class="chat">
                <div class="chat__header">
                    <div class="userIcon userIcon--big chat__img" :style="`background-image: url(${BACKEND_DOMAIN+chatWith.photo})`">
                        <router-link :to="{name: 'contactView', params: {contactName: chatWith.name}}"></router-link>
                    </div>
                    <div class="chat__text">
                        <h2>{{chatWith.name}}</h2>
                        <div class="chat__status">
                            <span v-if="chatWith.status"  class="status status--active chat__online"></span>
                            <span v-else>Last seen: {{lastSeen}}</span>
                        </div>
                    </div>
                </div>
                <div class="chat__messages" ref="chatScroll">
                    <div v-if="curentChat.messages.length" class="chat__messagesContainer">
                        <p  v-for="message in curentChat.messages" 
                            :key="message.from" 
                            class="chat__message" 
                            :class="{'chat__message--my': (message.from==authorizedUser), 'chat__message--firstMessageOfDay': message.firstMessageOfDay}">

                            {{message.text}}
                            <span class="chat__timeSend">{{message.timeOfSend.split(',')[3]}}</span>
                            <span v-if="message.firstMessageOfDay" class="chat__date">{{dateNow()}}</span> 
                        </p>
                    </div> 
                    <div class="chat__noMessages" v-else>No messages</div> 
                </div>
                <div></div>  
                <div class="chat__form">
                    <form @submit.prevent="sendMessage">
                        <textarea rows="1" style="height: 36px;" ref="textarea" @input="changeTextareaHeight" @keypress.enter="sendMessage" v-model.trim="messageVal" class="mainInput chat__textarea" name="" id="" cols="52"></textarea>
                        <button class="chat__button" type="submit">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </form>
                </div>
            </div>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import SimpleBar from "simplebar"
    import moment from 'moment'
    import BACKEND_DOMAIN from '../messanger-config';

    export default {
        data(){
            return{
                scrollContainerOfMessages: null,
                messageVal: '',

                BACKEND_DOMAIN: BACKEND_DOMAIN
            }
        },
        computed:{
            ...mapState([
                'chats',
                'authorizedUser',
                'contacts'
            ]),
            curentChat: function(){
                let chatWith = this.$route.params.contactName
                let result = {
                    users: [],
                    messages: []
                }

                this.chats.forEach(chat => {
                    if(this.arrDifference(chat.users, [chatWith, this.authorizedUser]).length == 0){
                        result = chat
                    }
                })

                return result
            },
            messages: function(){
                return this.curentChat.messages
            },
            chatWith: function(){
                let user = this.contacts.find(user => user.name == this.$route.params.contactName)

                if(user){
                    return user
                }else{
                    return {
                        name: '',
                        status: false,
                        last_seen: '',
                        photo: ''
                    }
                }
            },
            lastSeen(){
                let last_seen = this.chatWith.last_seen
                let arrLastSeen = last_seen.split(',')

                let lastSeenDate = new Date(last_seen)
                let now = new Date()
                let difference = Number(now - lastSeenDate)

                let oneDay = 86400000
                let oneYear = 31104000000

                if(difference >= oneDay && difference < oneYear){
                    return arrLastSeen[1]+', '+arrLastSeen[2]
                }else if(difference >= oneYear){
                    return last_seen
                }else{
                    return arrLastSeen[2]
                }
            },
        },
        watch:{
            authorizedUser: function(val){
                if(!val){
                    this.$router.push('/')
                }
            },
            messages: function(newVal, oldVal){
                if(newVal.length > oldVal.length){
                    this.clearNots()
                    this.scrollDown()
                }
            }
        },
        methods:{
            ...mapActions([
                    'GET_CHATS',
                    'SEND_MESSAGE',
                    'CLEAN_NOTS',
            ]),
            changeTextareaHeight(e){
                let textarea = this.$refs.textarea
                textarea.style.height = 'auto'
                textarea.style.height = textarea.scrollHeight+'px'

                if(this.messageVal === ''){
                    textarea.style.height = '36px'
                }
            },
            arrDifference(arr1, arr2){
                let arrDiff = []
    
                arr1.forEach((item1)=>{
                    let validator = false
                    
                    arr2.forEach((item2)=>{
                        if(item1 == item2){
                            validator = true
                        }
                    })
                    
                    if(!validator){
                        arrDiff.push(item1)
                    }
                })
                
                return arrDiff
            },
            clearNots(){
                let authUser = this.authorizedUser
                let chatWith = this.chatWith.name

                this.CLEAN_NOTS({authUser, chatWith})
            },
            createScrollContainer(){
                let elem = this.$refs.chatScroll
                const simpleBar = new SimpleBar(elem)
                this.scrollContainerOfMessages = simpleBar.getScrollElement()

                this.scrollDown()
            },
            scrollDown(){
                let scrollContainer = this.scrollContainerOfMessages
                scrollContainer.scrollTop = scrollContainer.scrollHeight
            },
            dateNow(){
                return moment().format('dddd, LL')
            },
            // send message
            firstMessageOfDay(){
                let date = this.dateNow()

                let lastMessage = this.curentChat.messages[this.curentChat.messages.length-1]
                let lastMessageTimeStamp = ''
                let onlyDateTimeStamp = ''
                let arrLastSeen

                if(lastMessage){
                    lastMessageTimeStamp = lastMessage.timeOfSend
                    arrLastSeen = lastMessageTimeStamp.split(',')
                    onlyDateTimeStamp = arrLastSeen[0]+', '+arrLastSeen[1]+', '+arrLastSeen[2]
                }else{
                    onlyDateTimeStamp = '1970-01-01T00:00:00Z'
                }
                

                let lastMessageDate = new Date(onlyDateTimeStamp)
                let dateNow = new Date(date)

                if(dateNow > lastMessageDate){
                    return true
                }else{
                    return false
                }
            },
            sendMessage(){
                if(this.messageVal){
                    let chatId = this.curentChat.id
                    let messageFrom = this.authorizedUser
                    let messageTo = this.chatWith.name
                    let messageText = this.messageVal
                    let time = moment().format('dddd, LL, h:mm:ss a'); 

                    const message = {
                        "from": messageFrom,
                        "text": messageText,
                        "timeOfSend": String(time),
                        "to": messageTo,
                        "firstMessageOfDay": this.firstMessageOfDay()
                    }

                    let v = this
                    this.SEND_MESSAGE({message, chatId})
                    .then(() => {
                        v.scrollDown()
                    })

                    this.messageVal = ''
                    this.$refs.textarea.style.height = '36px'
                    this.$refs.textarea.blur()
                }
            }
        },
        mounted(){
            let v = this
            v.$nextTick(function(){
                if(!v.authorizedUser || !v.curentChat.users.length){
                    v.$router.push('/404')
                }else{
                    v.clearNots()
                }

                v.createScrollContainer()
            })
        }
    }

</script>

<style lang="scss" scoped>
    @import '../../node_modules/simplebar/dist/simplebar.css';
    @import '../assets/colors';

    .chat {
        display: flex;
        flex-flow: column;
        align-items: center;

        margin: 30px auto;
        width: 500px;

        &__text{
            margin-left: 15px;

            display: flex;
            flex-flow: column;
            justify-content: space-between;

            h2 {
                font-size: 35px;
                margin: 0;
                padding: 0;
            }
            span{
                margin-left: 2px;

                word-wrap: break-word;
            }
        }
        &__status{
            height: 30px;
        }
        &__online{
            margin-top: 10px;
        }
        &__img{
            width: 70px;
            height: 70px;

            overflow: hidden;

            position: relative;

            a{
                position: absolute;

                width: 100%;
                height: 100%;
            }
        }
        &__header {
            width: 100%;

            display: flex;
            align-items: center;
            justify-content: start;

            margin-top: 5px;
            margin-bottom: 40px;
        }
        &__messages{
            height: 50vh;
            width: 100%;

            padding: 15px;

            position: relative;
        }
        &__messagesContainer{
            padding: 5px;

            display: flex;
            flex-flow: column;
        }
        &__noMessages{
            left: 37%;
            top: 40%;

            position: absolute;
        }
        &__message {
            word-wrap: break-word;
            max-width: 80%;
            margin: 30px 0 0 0;
            padding: 0px 10px 5px 10px;
            background-color: $message;
            color: $message-text;
            border-radius: 5px 5px 5px 0px;
            display: inline;
            position: relative;

            &:first-child{
                margin-top: 0;
            }

            &--my {
                background-color: $message-my;
                color: $message-my-text;
                margin-left: 20%;
                border-radius: 5px 5px 0px 5px;

                .chat__date{
                    left: 2%;
                }
            }

            &--firstMessageOfDay{
                margin-top: 80px;
            }
        }
        &__date{
            left: 27%;

            color: lighten($base-font-color, 35%);

            padding: 15px;
            text-align: center;

            position: absolute;
            top: -60px;
        }
        &__timeSend {
                color: lighten($base-font-color, 35%);
                position: absolute;
                bottom: -20px;
                right: 5px;
        }

        &__form {
            width: 100%;
            margin-top: 35px;
            
            form {
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
        &__textarea {
            min-height: 36px;
            padding: 6px;
            width: 83%;
            margin-left: 10px;
            resize: none;
            overflow: hidden;
        }
        &__button {
            cursor: pointer;
            border: none;
            background-color: transparent;
            width: 15%;

            svg{
                font-size: 30px;
                color: $light-blue;
            }
        }
    }
    // MEDIA -----------
    @media (max-width: 560px) {
        .chat{
            width: 300px;

            &__date{
                font-size: 15px;
                width: 246px;
                left: 3%;
            }
            &__message{
                &--my {
                    .chat__date{
                        left: -20%;
                    }
                }
            }

            &__textarea{
                margin-left: 0px;
            }

            &__button{
                margin-left: 5px;
            }
            &__text{
                span{
                    font-size: 12px;
                    word-wrap: break-word;
                }
            }
        }
    }
</style>