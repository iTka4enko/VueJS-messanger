<template>
    <div class="FileInput">
        <input @change="changeText" class="FileInput__input" type="file" name="photo" accept="image/*">
        <button @click.prevent="chouseFile" class="FileInput__button">Choose a file</button>
        <span class="FileInput__text">No file chosen</span>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                input: '',
                button: '',
                text: '',
            }
        },
        methods:{
            chouseFile(){
                this.input.click()
            },
            changeText(){
                this.text.innerText = this.input.value.match(/[\/\\]([\w\d\s\.\-\(\)]+)$/)[1]
            },
        },
        mounted(){
            let v = this
            this.$nextTick(()=>{
                v.input = document.querySelector('.FileInput__input')
                v.button = document.querySelector('.FileInput__button')
                v.text = document.querySelector('.FileInput__text')
            })
        }
    }
</script>

<style lang="scss" scoped>
    @import '../assets/colors';

    .FileInput {
        display: flex;
        position: relative;

        &__input{
            display: none;
        }
        &__button{
            cursor: pointer;
            background-color: darken($base-color, 100%);
            border-radius: 8px;
            border: none;
            padding: 5px;

            color: white;
            font-family: 'Andika';
        }
        &__text{
            margin-left: 10px;
            color: darken($base-color, 100%);
        }
    }

</style>