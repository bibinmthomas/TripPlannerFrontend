import axios from 'axios';
import {REACT_APP_BE_URL,BASE_URL } from "./services/helper"
const instance = axios.create({
    // .. where we make our configurations
        baseURL: BASE_URL
    });
    
export default instance;