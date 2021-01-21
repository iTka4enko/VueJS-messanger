<template>
     <div class="container">
        <div v-if="curentUser" class="contact-card">
            <div class="contact-card__name">{{ $route.params.contactName }} <span class="status" :class="{'status--active': curentUser.status}"></span> </div>
            <div class="contact-card__image mainImg">
                <img :src="BACKEND_DOMAIN+curentUser.photo">
            </div>
            <div class="contact-card__bottom">
                <div v-if="authorizedUser" class="contact-card__start-chat">
                    <span class="mainButton mainButton--blue" @click="checkChat($route.params.contactName)">Start chat</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from 'moment'
    import {mapState, mapActions} from 'vuex'
    import BACKEND_DOMAIN from '../messanger-config';

    export default {
        name: "contactView",
        data(){
            return{
                BACKEND_DOMAIN: BACKEND_DOMAIN
            }
        },
        computed:{
            ...mapState([
                'contacts',
                'chats',
                'authorizedUser'
            ]),
            curentUser: function(){
                let routePathName = this.$route.params.contactName
                return this.contacts.find(contact => contact.name == routePathName)
            } 
        },
        methods:{
            ...mapActions([
                'GET_CONTACT',
                'SET_NEW_CHAT',
                'CHECK_AUTORIZED'
            ]),
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
            isChatExist(user){
                let arrWeNeed = [user, this.authorizedUser]
                let result = false

                this.chats.forEach(chat => {
                    if(this.arrDifference(chat.users, arrWeNeed).length == 0){
                        result = true
                    }
                });

                return result
            },
            // redirect to chat
            redirectToChat(chatName){
                this.$router.push('/'+chatName+'/chat')
            },
            // create chate
            createChat(){
                let firsUser = this.curentUser.name
                let secondUser = this.authorizedUser

                let timeOfCreated = moment().format('dddd, LL, h:mm:ss a'); 

                const newChat = {
                    "first_user": firsUser,
                    "second_user": secondUser,
                    "create_dateStr": String(timeOfCreated)
                }

                return this.SET_NEW_CHAT(newChat)                
            },
            checkChat(chatName){
                let v = this 
                if(!v.isChatExist(chatName)){
                    v.createChat()
                    .then((respons)=>{
                        v.redirectToChat(chatName)
                    })
                }else{
                    v.redirectToChat(chatName)
                }
            }
        },
        mounted(){
           if(!this.curentUser){
               this.$router.push('/404')
           } 
        }
    }
</script>


<style lang="scss" scoped>
    .contact-card {
        display: flex;
        flex-flow: column;
        align-items: center;

        &__name {
            margin: 30px 0 30px 0;
            font-size: 35px;

            display: flex;
            align-items: center;

            span{
                margin-left: 10px;
            }
        }

        &__bottom {
            display: flex;
            justify-content: flex-end;

            margin: 30px 0 50px 0;
        }
    }
</style>