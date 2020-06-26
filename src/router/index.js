import Vue from 'vue'
import Router from 'vue-router'


import Login from '../components/Login'
import Home from '../components/Home'
import AdminIndex from '../components/admin/AdminIndex'
import Register from '../components/Register'
import DashBoard from '../components/admin/dashboard/admin/index'

import modelFile from '../components/wordsyn/modelFile'
import docFile from '../components/wordsyn/docFile'
import wordShow from '../components/wordsyn/wordShow'
import compareFile from '../components/wordsyn/compareFile'
import wordsynLeft from '../components/wordsyn/wordsynLeft'


Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Default',
      redirect: '/login',
      component: Home
    },
    {
      // home页面并不需要被访问，只是作为其它组件的父组件
      path: '/home',
      name: 'Home',
      component: Home,
      redirect: '/index',
      children: [
        {
          path: '/wordsynLeft',
          name: 'wordsynLeft',
          component: wordsynLeft,
          redirect: '/modelFile',//自动重定位到wordsyn,
          meta: {
            requireAuth: true
          },
          children: [
            {
              path: '/modelFile',
              name: 'modelFile',
              component: modelFile, meta: {
                requireAuth: true
              },
            }, {
              path: '/docFile',
              name: 'docFile',
              component: docFile, meta: {
                requireAuth: true
              },
            }, {
              path: '/wordShow',
              name: 'wordShow',
              component: wordShow, meta: {
                requireAuth: true
              },
            }, {
              path: '/compareFile',
              name: 'compareFile',
              component: compareFile, meta: {
                requireAuth: true
              },
            }
          ]
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/admin',
      name: 'Admin',
      component: AdminIndex,
      meta: {
        requireAuth: true
      },
      children: [
        {
          path: '/admin/dashboard',
          name: 'dashboard',
          component: DashBoard,
          meta: {
            requireAuth: true
          }
        }
      ]
    }
  ]
})

// 用于创建默认路由
export const createRouter = routes => new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Default',
      redirect: '/home',
      component: Home
    },
    {
      // home页面并不需要被访问，只是作为其它组件的父组件
      path: '/home',
      name: 'Home',
      component: Home,
      redirect: '/index',
      children: [
        {
          path: '/index',
          name: 'AppIndex',
          component: AppIndex
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/admin',
      name: 'Admin',
      component: AdminIndex,
      meta: {
        requireAuth: true
      },
      children: [
        {
          path: '/admin/dashboard',
          name: 'dashboard',
          component: DashBoard,
          meta: {
            requireAuth: true
          }
        }
      ]
    }
  ]
})
