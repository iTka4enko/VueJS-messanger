<template>
<div class="container">
    <div id="notFoundPage">
        <h1>Error 404: Page not found</h1>
    </div></div>    
</template>
<script>
    export default {
    name: 'NotFound',
    }
</script>
<style lang="scss" scoped>
    #notFoundPage{
        display: flex;
        justify-content: center;
        align-items: center;

        height: calc(100vh - 50px - 80px);
    }
    // MEDIA ------------
    @media (max-width: 530px) {
        #notFoundPage{
            font-size: 11px;
        }
    }
</style>