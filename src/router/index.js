import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import Contact from '../views/Contact.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/NoConection',
    name: 'NoConection',
    component: () => import(/* webpackChunkName: "no-conection" */ '../components/NoConection.vue'),
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import(/* webpackChunkName: "not-found" */ '../components/NotFound404.vue'),
  },
  {
    path: '/chats',
    name: 'Chats',
    component: () => import(/* webpackChunkName: "chats" */ '../views/Chats.vue')
  },
  {
    path: '/:contactName',
    name: 'contact',
    component: Contact,
    props: true,
    children: [
      {
        path: 'chat',
        name: 'Chat',
        component: () => import(/* webpackChunkName: "chat" */ '../views/Chat.vue'),
      },
      {
        path: '',
        name: 'contactView',
        component: () => import(/* webpackChunkName: "contact" */ '../views/ContactView.vue'),
        props: true,
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (!to.matched.length) {
  	next('/404');
  } else {
  	next();
  }
})

export default router
