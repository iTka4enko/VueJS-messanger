<template>
  <div class="app__container">
	<AuthPopUp @hide="hidePopUp" v-if="showAuthPopUp"></AuthPopUp>
  	<Header @showPopUp="showPopUp"></Header>
    <!-- main part -->
    <router-view/>
    <!--  -->
	<Footer/>
  </div>
</template>

<script>
	// components
	import Footer from './components/Footer';
	import Header from './components/Header';
	import AuthPopUp from './components/AuthPopUp';

	import {mapActions, mapState} from 'vuex'

	export default {
		components:{
			Footer,
			Header,
			AuthPopUp
		},
		data(){
			return{
				showAuthPopUp: false
			}
		},
		computed:{
			...mapState([
				'authorizedUser',
				'contacts'
			])
		},
		methods:{
			...mapActions([
				'GET_CHATS',
				'GET_CONTACT',
				'CHECK_AUTORIZED',
				'LOG_OUT'
			]),
			hidePopUp(){
				this.showAuthPopUp = false
			},
			showPopUp(){
				this.showAuthPopUp = true
			},
			pingToServer(){
				setInterval(()=>{
					this.GET_CONTACT()
					.then((err)=>{
						if(err){
							this.$router.push('/NoConection')
						}
					})
					
					if(this.authorizedUser){
						this.GET_CHATS()
					}
				}, 2000)
			},
			getAuthObj(){
				let user = this.contacts.find(contact => contact.name == this.authorizedUser)
				if(!user){
					return {
						"notifications": []
					}
				}else{
					return user
				}
			}
		},
		mounted(){
			this.pingToServer()

			this.GET_CONTACT()
			.then((err)=>{
				if(err){
					this.$router.push('/NoConection')
				}
			})
		}
	}
</script>

<style lang="scss">
	@import './assets/defolts.scss';

	@import './assets/fonts/fonts.scss';
	@import './assets/animations/App.scss';
	@import './assets/animations/mainListsElem';
	@import './assets/colors';

	.mainButton {
		cursor: pointer;
		border: none;
		border-radius: 8px;
		min-width: 130px;
		padding: 8px;
		font-size: 14px;
		font-weight: 700;
		color: white;
		text-align: center;
		display: block;
		&--blue {
			background-color: $button-blue;
		}
		&--blue:active {
			background-color: darken($button-blue, 10%);
		}
		&--red {
			background-color: $button-red;
		}
		&--red:active {
			background-color: darken($button-red, 10%);
		}
	}

	.mainList {
		margin-top: 35px;
		margin-bottom: 35px;

		&__elem {
			animation: slideFromTop .2s;
			display: -ms-flexbox;
			display: flex;
			-ms-flex-pack: justify;
			justify-content: space-between;
			-ms-flex-align: center;
			align-items: center;

			padding: 10px 15px;

			cursor: pointer;

			position: relative;
		}

		a{
			position: absolute;

			width: 95%;
			height: 100%;

			z-index: 1;
		}
	}

	.userIcon {
		max-width: 50px;
		max-height: 50px;
		min-height: 50px;
		min-width: 50px;
		width: 50px;
		height: 50px;

		border-radius: 50%;
		background-color: darken($base-color, 30%);
		background-size: cover;
		background-position: 50% 50%;

		&--big{
			max-width: 80px;
			max-height: 80px;
			min-height: 80px;
			min-width: 80px;
			width: 80px;
			height: 80px;
		}
	}

	.status{
		border-radius: 50%;
		background-color: $offline;
		height: 10px;
		width: 10px;
		max-width: 10px;
		max-height: 10px;
		
		display: block;

		&--active{
			background-color: $online;
		}
	}

	.mainInput{
		font-size: 18px;
		border: 1px solid $base-color;
		border-radius: 5px;

		&:focus{
			border: 1px solid $input-focus;
			box-shadow: 0 0 2px 1px $input-focus-shadow;
		}
	}

	.simplebar-scrollbar::before{
		background-color: gray !important;
	}

	.mainImg {
		width: 250px;
		height: 320px;
		border: none;
		background-color: darken($base-color, 20%);
		
		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	// MEDIA ------------
	@media (max-width: 560px) {
		.userIcon {
			&--big{
				max-width: 60px;
				max-height: 60px;
				min-height: 60px;
				min-width: 60px;
				width: 60px;
				height: 60px;
			}
		}
	}
</style>
