<template>
<div class="container">
    <div id="NoConection">
        <h1>No conection with server, try again later</h1>
    </div></div>    
</template>
<script>
    export default {
    name: 'NoConection',
    }
</script>
<style lang="scss" scoped>
    #NoConection{
        display: flex;
        justify-content: center;
        align-items: center;

        text-align: center;
        
        height: calc(100vh - 50px - 80px);
    }
    // MEDIA ------------
    @media (max-width: 650px) {
        #NoConection{
            font-size: 10px;
            padding: 20px;
        }
    }
</style>