/**
 * Steps for state management
 * submit action
 * handle action in its reducer
 * register here reducer
 * 
 */

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer"


export const store = configureStore({
    reducer:{
        auth:authReducer
    }
})