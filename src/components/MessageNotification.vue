<template>
    <span :class="[notificationCount ? 'newMessages--active': '', setColor()]" class="newMessages">{{notificationCount}}</span>
</template>
<script>
	export default {
		props: {
			notificationCount: Number,
			color: String,
		},
		methods: {
			setColor(){
				const colorStr = this.color

				if(colorStr == "red"){
					return 'newMessages--red'
				}else{
					return 'newMessages--grey'
				}
			},
		}
	}
</script>
<style lang='scss' scoped>
	@import '../assets/colors.scss';

	.newMessages{
			padding: 0px 5.5px 1px 5px;
			border-radius: 20px;

			pointer-events: none;

			color: white;
			font-size: 10px;
			font-weight: 700;

			display: none;
			justify-content: center;
			align-items: center;

			&--active{
				display: flex;
			}

			&--red{
				background-color: $notification-red;
			}
			&--grey{
				background-color: $notification-gray;
			}
		}
</style>