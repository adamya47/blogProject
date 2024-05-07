import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";

const store=configureStore({

    reducer:{
 auth:authSlice,
 //todo - add more slice for post etc..
    }

});

export default store