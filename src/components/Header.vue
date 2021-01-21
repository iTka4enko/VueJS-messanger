<template>
    <div class="header">
        <div 
			class="header__backButton" 
			:class="{'header__backButton--disabled': isHomePage}" 
			@click="backInHistory">

			<div></div><span>Back</span>
		</div>
        <nav>
            <div class="header__nav">
				<div class="header__links" :class="{'header__links--active': routePath == '/'}">
					<svg class="header__img fas fa-home"></svg>
					<router-link to="/"><span></span></router-link>
				</div>
				<div v-if="authorizedUser" class="header__links" :class="{'header__links--active': routePath == '/chats'}">
					<svg class="header__img fas fa-comments"></svg>
					<router-link to="/chats"><span></span></router-link>
					<MessageNotification :notificationCount="authorizedUserObj.notifications.length" color="red" class="header__notificationIcon"></MessageNotification>
				</div>
				<div @click="showPopUpinAPP" class="header__links">
					<div class="header__profileLink" v-show="authorizedUser">
						<div class="userIcon" :style="`background-image: url(${BACKEND_DOMAIN+authUserPhoto})`"></div>
						<span class="header__authUser">{{authorizedUser}}</span>
					</div>
					<div v-show="!authorizedUser">
						<svg class="header__img fas fa-user"></svg>
					</div>
				</div>
            </div>
        </nav>
    </div>
</template>

<script>
	import router from '../router/index.js';
	import {mapState, mapActions, mapMutations} from 'vuex';
	import BACKEND_DOMAIN from '../messanger-config';
	// components
	import MessageNotification from '../components/MessageNotification'

	export default {
		data(){
			return{
				BACKEND_DOMAIN: BACKEND_DOMAIN
			}
		},
		components: {
			MessageNotification
		},
		computed: {
			routePath(){
				return this.$route.path
			},
			isHomePage(){
				return this.$route.path === "/"
			},
			...mapState([
				'authorizedUser',
				'contacts',
				'chats'
			]),
			authorizedUserObj(){
				return this.$parent.getAuthObj()
			},
			authUserPhoto(){
				if(this.authorizedUserObj){
					return this.authorizedUserObj.photo
				}else{
					return ''
				}
			}
		},
		methods: {
			...mapActions([
				'GET_CONTACT'
			]),
			...mapMutations([
				'DELETE_AUTH',
			]),
			backInHistory(){	
				router.go(-1)
			},
			showPopUpinAPP(){
				this.$emit('showPopUp')
			},
			checkUserExist(){
				const result = this.contacts.find(user => user.name == this.authorizedUser)

				if(!result){
					this.DELETE_AUTH()
				}
			}
		},
		mounted(){
			this.checkUserExist()
		}
	}
</script>

<style lang="scss" scoped>
	@import '../assets/colors';

	.header {
		max-height: 80px;
		min-height: 80px;
		background-color: $base-color;

		display: -ms-flexbox;
		display: flex;
		align-items: center;

		nav{
			margin: 0 auto;
			padding-right: 15px;
			height: 100%;

			display: flex;
			align-items: center;
		}
		&__nav {
			width: 100%;

			display: -ms-flexbox;
			display: flex;
			-ms-flex-pack: justify;
			justify-content: space-between;
			-ms-flex-align: center;
			align-items: center
		}
		&__profileLink{
			box-sizing: content-box;

			display: flex;
			flex-flow: column;
			align-items: center;

			margin-top: 5px;
		}
		&__authUser{
			margin-top: -5px;
		}
		&__links{
			cursor: pointer;
			position: relative;
			display: flex;
			justify-content: center;
			align-items: center;

			margin: 0 80px;

			min-width: 25px;
			min-height: 25px;
			max-width: 25px;
			max-height: 25px;

			a{
				position: absolute;
				
				width: 100%;
				height: 100%;
			}

			svg{
				color: $links;
				font-size: 24px;
			}

			&--active{
				svg{
					color: $light-blue;
					transition: all .1s;
					font-size: 24px;
				}
			}
		}
		&__notificationIcon{
			position: absolute;
			top: -2px;
			left: 12px;
		}

		&__backButton{
			position: absolute;
			left: 30px;

			cursor: pointer;

			display: flex;
			align-items: center;

			div{
				width: 0;
				height: 0;
				border-style: solid;
				border-width: 5px 10px 5px 0;
				border-color: transparent $base-font-color transparent transparent;

				margin-top: 3px;
				margin-right: 5px;
			}

			&--disabled{
				display: none;
			}
		}

		// MEDIA -------------------
		@media (max-width: 760px) {
			.header__links{
				margin: 0 40px;
			}
		}
		@media (max-width: 530px) {
			.header__links{
				margin: 0 30px;
			}
			.header__backButton{
				font-size: 14px;
				left: 15px;
			}
		}
		@media (max-width: 420px) {
			.header__links{
				margin: 0 20px;
			}
			.header__backButton{
				color: transparent;
			}
		}
	}
</style>