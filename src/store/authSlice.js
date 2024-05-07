import { createSlice } from "@reduxjs/toolkit";


const initialState={

    userData:null,
    status:false
}

const authSlice=createSlice({

name:"auth",
initialState,
reducers:{
login:(state,action)=>{
    state.status=true,
    state.userData=action.payload.userData//we expect an object from input side jisme userData wali key hogi  
},
logout:(state)=>{
state.status=false;
state.userData=null
}

}

})

export default authSlice.reducer;
export const {logout,login}=authSlice.actions;