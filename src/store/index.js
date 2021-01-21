import Axios from 'axios'
import { createStore } from 'vuex'
import qs from "qs"
import createPersistedState from 'vuex-persistedstate';
import BACKEND_DOMAIN from '../messanger-config';

export default createStore({
  state: {
    authorizedUser: '',
    contacts: [],
    chats: []
  },

  plugins: [createPersistedState()],

  mutations: {
    CONTACT_TO_STORE(state, contacts){
      state.contacts = contacts;
    },
    CHATS_TO_STORE(state, chats){
      state.chats = chats;
    },
    SET_NEW_MESSAGE(state, {message, chatId}){
      let chat = state.chats.filter(chat => chat.id == chatId)[0]
      chat.messages.push(message)
    },
    CLEAN_NOTS(state, {authUser, chatWith}){
      if(authUser){
        let user = state.contacts.find(user => user.name == authUser)
        let nots = user.notifications.filter(n => n.messageFrom != chatWith)
        user.notifications = nots
      }
    },
    NEW_CHAT_TO_STORE(state, newChat){
      state.chats.unshift(newChat)
    },
    NEW_CONTACT_TO_STORE(state, newContact){
      state.contacts.push(newContact)
    },
    NEW_PROFILE_NAME(state, {newUsername, oldUsername}){
      state.contacts.forEach((item)=>{
        if(item.name == oldUsername){
          item.name = newUsername
        }
      })
      state.authorizedUser = newUsername
    },
    LOG_OUT(state, {index, last_seen}){
      state.contacts[index].last_seen = last_seen
      state.contacts[index].status = false
      state.authorizedUser = ''
    },
    DELETE_AUTH(state){
      state.authorizedUser = ''
    },
    LOG_IN(state, name){
      state.authorizedUser = name
    }
  },

  actions: {
    GET_CONTACT({commit}){
      return new Promise((reject) => { 
        Axios.get(BACKEND_DOMAIN+'/APIgetContacts/')
        .then(contacts =>{
          commit('CONTACT_TO_STORE', contacts.data)
        })
        .catch((err)=>{
          reject(err)
        })
      })
    },
    GET_CHATS({commit}){
      let user = this.state.authorizedUser
      return Axios.get(`${BACKEND_DOMAIN}/APIgetChats/${user}/`)
        .then(chats =>{
          commit('CHATS_TO_STORE', chats.data)
        })
    },
    SEND_MESSAGE({commit}, {message, chatId}){
      return new Promise((resolve) => {
          Axios({
            method: "POST",
            url:`${BACKEND_DOMAIN}/APIsendMessage/${chatId}/`, 
            data: qs.stringify(message) 
          })
          .then(()=>{
            commit('SET_NEW_MESSAGE', {message, chatId})
            resolve()
          })
      })
    },
    CLEAN_NOTS({commit}, {authUser, chatWith}){
      commit('CLEAN_NOTS', {authUser, chatWith})
      let data = {
        "authUser": authUser,
        "chatWith": chatWith
      }

      Axios({
        method: "POST",
        url:`${BACKEND_DOMAIN}/APIclearNots/`, 
        data: qs.stringify(data) 
      })
      .then((respons) => {
        return respons;
      })
    },
    SET_NEW_CHAT({commit}, newChat){
      return new Promise((resolve) => {
        Axios({
          method: "POST",
          url:`${BACKEND_DOMAIN}/APIsetNewChat/`, 
          data: qs.stringify(newChat)
        })
        .then((respons) => {
          const newChat = respons.data
          commit('NEW_CHAT_TO_STORE', newChat)
          resolve(newChat)
        })
      })
    },
    // registration
    SET_NEW_CONTACT({commit}, newContact){
      return new Promise((resolve) => {
          Axios({
            method: "POST",
            url:`${BACKEND_DOMAIN}/APIreg/`, 
            data: qs.stringify(newContact)
          })
          .then((respons) => {
            const newUser = respons.data
            commit('NEW_CONTACT_TO_STORE', newUser)
            resolve(newUser)
          })
      })
    },
    CHANGE_PROFILE({commit}, {changes, oldUsername, newUsername}){
      Axios({
        method: "POST",
        url: `${BACKEND_DOMAIN}/APIchengeProfileData/${oldUsername}/`,
        data: changes,
        headers: {
            "content-type": "multipart/form-data"
        }
      })
      .then(()=>{
        if(newUsername){
          commit('NEW_PROFILE_NAME', {newUsername, oldUsername})
        }
      }) 
    },
    // logIn
    LOG_IN({commit}, authorizedUser){
      let name = authorizedUser.name
      return new Promise((resolve) => {
          Axios({
            method: "POST",
            url:`${BACKEND_DOMAIN}/APIlog/`, 
            data: qs.stringify(authorizedUser)
          })
          .then((respons) => {
            if(respons.data){
              commit('LOG_IN', name) 
            }else{
              let name = ''
              commit('LOG_IN', name)
            }
            resolve(respons)
          })
      })

    },
    // logOut
    LOG_OUT({commit}, deAutorized){
      let user = this.state.authorizedUser
      let index = deAutorized.index

      Axios({
        method: 'POST',
        url: `${BACKEND_DOMAIN}/APIlogout/${user}/`,
        data: qs.stringify(deAutorized)
      })
      .then((respons)=>{
        if(respons.data){
          let last_seen = respons.data
          commit('LOG_OUT', {index, last_seen})
        }
      })
    }
  },

  modules: {
  }
})
