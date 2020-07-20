import Vue from 'vue'
import axios from 'axios'

const baseURL = 'http://localhost:3030'

Vue.prototype.$axios = axios.create({
    baseURL: baseURL
});

