<template>
  <div class="container">
     <main>
       <div class="contacts mainList">
          <template v-for="contact in contactsReversed" :key="contact.name">
            
              <div class="contacts__item mainList__elem" v-if="contact.name != authorizedUser">
                <router-link :to="{name: 'contactView', params: {contactName: contact.name}}"></router-link>
                <div class="contacts__image userIcon" :style="`background-image: url(${BACKEND_DOMAIN+contact.photo})`"></div>
                <div class="contacts__name">{{contact.name}}</div>
                <div class="status" :class="{'status--active': contact.status}"></div>
              </div>

          </template>
        </div>
    </main>
  </div>
</template>

<script>
// @ is an alias to /src
  import {mapState} from 'vuex'
  import BACKEND_DOMAIN from '../messanger-config';

  export default {
    name: 'Home',
    data(){
      return{
        BACKEND_DOMAIN: BACKEND_DOMAIN
      }
    },
    computed: {
      ...mapState([
        'contacts',
        'authorizedUser'
      ]),
      contactsReversed: function(){
        return this.contacts.reverse()
      }
    },
  }
</script>
