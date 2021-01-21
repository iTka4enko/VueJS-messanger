<template>
    <div class="popUp">
        <div class="popUp__window">
            <div @click="hidePopUp" class="popUp__close">
                <div></div>
                <div></div>
            </div>
            <!-- login/profile -->
            <div class="popUp__login-logout popUp__parts">
                <div v-if="!authorizedUser">
                    <h2>LogIn</h2>
                    <form v-on:submit.prevent="validatelogIn" action="" method="GET">
                        <label class="popUp__label" :class="{'popUp__label--invalid': formLog.emptyName || formLog.noSuchName}" for="name"></label>
                        <input v-model.trim="formLog.name" @input="()=>{formLog.emptyName = false; formLog.noSuchName = false}" class="mainInput popUp__input" type="text" name="name" id="name" placeholder="Name">
                        <span>{{  formLog.emptyName ? 'Enter a name' : formLog.noSuchName ? 'No such user' : '' }}</span>

                        <label class = "popUp__label" :class="{'popUp__label--invalid': formLog.emptyPassword || formLog.wrongPassword}" for="password"></label>
                        <input @keypress.space.prevent v-model.trim="formLog.password" @input="()=>{formLog.emptyPassword = false; formLog.wrongPassword = false}" class="mainInput popUp__input" type="password" name="password" id="password" placeholder="Password">
                        <span>{{  formLog.emptyPassword ? 'Enter a password' : formLog.wrongPassword ? 'Wrong password' : '' }}</span>

                        <input class="popUp__submit mainButton mainButton--blue" type="submit" value="LogIn">    
                    </form>
                </div>
                <div v-else class="popUp__userProfile">
                    <form class="popUp__changes" v-on:submit.prevent="validateChanges" method="POST">
                        <div class="mainImg popUp__img">
                            <img :src="BACKEND_DOMAIN+authorizedUserObj.photo">
                        </div>
                        <span class="popUp__username">{{authorizedUser}}</span>

                        <FileInput></FileInput>
                        <label class="popUp__label" :class="{'popUp__label--invalid': formProfile.emptyName || formProfile.nameExist || formProfile.nameLenMin || formProfile.nameLenMax}" for="newUsername"></label>
                        <input v-model.trim="formProfile.name" @input="()=>{formProfile.emptyName = false; formProfile.nameLenMin = false; formProfile.nameLenMax = false; formProfile.nameExist = false}" class="mainInput popUp__input" type="text" name="newUsername">
                        <span>{{  formProfile.emptyName ? 'Enter a name' : formProfile.nameLenMin ? "At least 3 characters" : formProfile.nameLenMax ? 'To long name' : formProfile.nameExist ? 'Already exist' : '' }}</span>
                        <input class="mainButton mainButton--blue popUp__submit" type="submit" value="Send changes">
                    </form>
                    <form  class="popUp__logOut" v-on:submit.prevent="logOut" method="POST">
                        <input class="popUp__submit mainButton mainButton--red" type="submit" value="LogOut">
                    </form>
                </div>
            </div>
            <!-- registration -->
            <div v-if="!authorizedUser" class="popUp__registration popUp__parts">
                <h2>Registration</h2>
                <form action="" method="POST" onsubmit="return false;" v-on:submit.prevent="validateRegistrationData">
                    <label class = "popUp__label" :class="{'popUp__label--invalid': formReg.emptyName || formReg.nameExist || formReg.nameLenMin || formReg.nameLenMax}" for="regName"></label>
                    <input v-model.trim="formReg.name" @input="()=>{formReg.emptyName = false; formReg.nameExist = false; formReg.nameLenMin = false; formReg.nameLenMax = false}" class="mainInput popUp__input" type="text" name="name" id="regName" placeholder="Name">
                    <span>{{  formReg.emptyName ? 'Enter a name' : formReg.nameLenMin ? "At least 3 characters" : formReg.nameLenMax ? 'To long name' : formReg.nameExist ? 'Already exist' : '' }}</span>

                    <label class = "popUp__label" :class="{'popUp__label--invalid': formReg.emptyPassword || formReg.passwordLen}" for="regPassword"></label>
                    <input @keypress.space.prevent v-model.trim="formReg.password" @input="()=>{formReg.emptyPassword = false; formReg.passwordLen = false}" class="mainInput popUp__input" type="password" name="password" id="regPassword" placeholder="Password">
                    <span>{{  formReg.emptyPassword ? 'Enter a password' : formReg.passwordLen ? "At least 8 characters" : '' }}</span>

                    <label class = "popUp__label" :class="{'popUp__label--invalid': formReg.rePasswordCheck}" for="regRePassword"></label>
                    <input @keypress.space.prevent v-model.trim="formReg.rePassword" @input="()=>{formReg.rePasswordCheck = false}" class="mainInput popUp__input" type="password" name="rePassword" id="regRePassword" placeholder="Password again">
                    <span>{{  formReg.rePasswordCheck ? 'Wrong password repeat' : '' }}</span>

                    <input class="popUp__submit mainButton mainButton--blue" type="submit" value="Register">
                </form>
            </div>
        </div>
    </div>
</template>
<script>
    import {mapState, mapActions} from 'vuex'
    import BACKEND_DOMAIN from '../messanger-config';

    import FileInput from './FileInput';

    export default {
        name: "Auth",
        components:{
            FileInput
        },
        data(){
            return{
                BACKEND_DOMAIN: BACKEND_DOMAIN,
                formReg:{
                    name: '',
                    password: '',
                    rePassword: '',
                    // validations
                    emptyPassword: false,
                    emptyName: false,
                    rePasswordCheck: false,
                    nameExist: false,
                    nameLenMin: false,
                    nameLenMax: false,
                    passwordLen: false,
                },
                formLog:{
                    name: '',
                    password: '',
                    // validations
                    emptyPassword: false,
                    emptyName: false,
                    noSuchName: false,
                    wrongPassword: false,
                },
                formProfile:{
                    name: '',
                    //validations
                    emptyName: false,
                    nameExist: false,
                    nameLenMin: false,
                    nameLenMax: false,
                }
            }
        },
        computed:{
            ...mapState([
                'authorizedUser',
                'contacts'
            ]),
            authorizedUserObj(){
                let user = this.contacts.find(contact => contact.name == this.authorizedUser)
                if(!user){
                    return {
                        "notifications": []
                    }
                }else{
                    return user
                }
            },
        },
        methods: {
            ...mapActions([
                'SET_NEW_CONTACT',
                'LOG_OUT',
                'LOG_IN',
                'GET_CHATS',
                'CHANGE_PROFILE'
            ]),
            hidePopUp(e){
                this.$emit('hide')
            },
            getIndexByUserName(userName) {
                let index = null
                this.contacts.forEach((user, i) => {
                    if (user.name === userName) {
                        index = i
                    }
                })

                return index
            },
            // Auth
            isNameAndPassEmpty(name, password, form){
                let checkPass = true
                if(password === null){
                    password = true
                    checkPass = false
                }

                if (name != '' && password != '') {
                    form.emptyName = false 
                    checkPass ? form.emptyPassword = false : ''

                    return false
                } else {
                    if (name == '') {
                        form.emptyName = true
                    } else {
                        form.emptyName = false
                    }

                    if(checkPass){
                        if (password == '') {
                        form.emptyPassword = true
                        } else {
                            form.emptyPassword = false
                        }
                    }

                    return true
                }
            },
            isUserExist(form){
                let checkUserExist = this.contacts.filter(user => user.name == form.name)
    
                if (checkUserExist.length) {
                    form.nameExist = true

                    return true
                }else {
                    form.nameExist = false

                    return false
                }
            },
            namePasswordLenOk(name, password, form){
                let checkPass = true
                if(password === null){
                    password = '********'
                    checkPass = false
                }

                if (name.length >= 3 && password.length >= 8 && name.length <= 10) {
                    checkPass ? form.passwordLen = false : ''
                    form.nameLenMin = false

                    return true
                } else {
                    if (name.length < 3) {
                        form.nameLenMin = true
                    } else {
                        form.nameLenMin = false
                    }

                    if (name.length > 15) {
                        form.nameLenMax = true
                    } else {
                        form.nameLenMax = false
                    }

                    if(checkPass){
                        if (password.length < 8) {
                        form.passwordLen = true
                        } else {
                            form.passwordLen = false
                        }
                    }

                    return false
                }
            },
            validateRegistrationData() {
                let name = this.formReg.name
                let password = this.formReg.password
                let rePassword = this.formReg.rePassword

                if(this.isNameAndPassEmpty(name, password, this.formReg)){
                    return false
                }

                if(!this.namePasswordLenOk(name, password, this.formReg)){
                    return false
                }

                if (password == rePassword) {
                    this.formReg.rePasswordCheck = false
                } else {
                    this.formReg.rePasswordCheck = true
                    return false
                }

                if(this.isUserExist(this.formReg)){
                    return false
                }

                this.sendRegistrationData()
                this.hidePopUp()
                this.$router.push('/')
            },
            validatelogIn(e) {
                let name = this.formLog.name
                let password = this.formLog.password

                if(this.isNameAndPassEmpty(name, password, this.formLog)){
                    return false
                }

                let index = this.getIndexByUserName(name)
                if (index !== null) {
                    this.formLog.noSuchName = false
                } else {
                    this.formLog.noSuchName = true

                    return false
                }

                this.logIn(index)
                    .then(function(respons) {
                        if (respons.data == '') {
                            this.formLog.wrongPassword = true
                        } else {
                            this.formLog.wrongPassword = false
                            this.formReg.name = ''
                            this.formReg.password = ''

                            this.GET_CHATS()
                            this.hidePopUp()
                            this.$router.push('/')
                        }
                    }.bind(this))
            },
            validateChanges(e) {
                let name = this.formProfile.name

                if(name){
                    if(!this.namePasswordLenOk(name, null, this.formProfile)){
                        return false
                    }
                }

                if(this.isUserExist(this.formProfile)){
                    return false
                }

                let form = e.target
                this.sendChanges(form)

                this.hidePopUp()
            },
            logIn(index) {
                let v = this
                let name = this.formLog.name
                let password = this.formLog.password
                const authorizedUser = {
                    "name": name,
                    "password": password,
                    "index": index
                }
                return new Promise((resolve) => {
                    v.LOG_IN(authorizedUser)
                        .then(function(respons) {
                            resolve(respons)
                        })
                })
            },
            sendRegistrationData() {
                let password = this.formReg.password
                let name = this.formReg.name

                const newContact = {
                    "password": password,
                    "name": name,
                }
                this.SET_NEW_CONTACT(newContact)

                this.formReg.name = ''
                this.formReg.password = ''
                this.formReg.rePassword = ''
            },
            sendChanges(form) {
                let changes = new FormData(form)
                let oldUsername = this.authorizedUser
                let newUsername = this.formProfile.name

                this.CHANGE_PROFILE({
                    changes,
                    oldUsername,
                    newUsername
                })
            },
            logOut(e) {
                let index = this.getIndexByUserName(this.authorizedUser)
                const deAutorized = {
                    index: index,
                }
                this.LOG_OUT(deAutorized)

                this.hidePopUp()
                this.$router.push('/')
            },
        },
    }
</script>
<style lang="scss" scoped>
    @import '../assets/animations/AuthPopUp.scss';
    @import '../assets/colors';

    .popUp{
        position: absolute;
        width: 100vw;
        height: 100vh;

        background-color: $popUp-bg;

        display: flex;
        justify-content: center;
        align-items: center;

        z-index: 1000;

        &__window{
            width: 600px;

            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 0 15px 3px lighten($popUp-bg, 50%);

            padding: 45px 15px 60px 15px;

            animation: zoomIn .2s;

            position: relative;
        }
        &__close{
            position: absolute;
            top: 12px;
            right: 14px;
            cursor: pointer;
            width: 20px;
            height: 20px;

            div{
                margin-top: 10px;
                width: 100%;
                height: 1px;
                background-color: $close;
                display: block;
                position: absolute;
            }
            div:first-child{
                transform: rotate(45deg);
            }
            div:last-child{
                transform: rotate(-45deg);
            }

            &:hover>div{
                background-color: $close-hover;
            }
        }
        &__parts{
            form{
            display: flex;
            flex-flow: column;
            align-items: center;

            margin-top: 5px;
            }
            h2{
                text-align: center;
                margin: 0;
            }
        }

        &__username{
            margin: 10px 0 35px 0;
            font-size: 24px;
        }
        &__userProfile{
            form{
                padding: 20px;
            }
        }
        &__registration {
            margin-top: 80px;
        }

        &__label{
            &+input+span{
                min-height: 20px;
                line-height: 20px;
            }
            &--invalid+input{
                border: 1px solid rgb(255, 99, 99);
                box-shadow: 0 0 2px 1px rgba(255, 99, 99, 0.315);
            }
            &--invalid+input+span{
                color:rgb(255, 99, 99);
                text-align: start;

                width: 80%;
            }
        }
        &__input{
            width: 80%; 

            margin-top: 10px;
            padding: 5px;
        }
        &__submit{
            margin-top: 20px;
        }
    }
</style>