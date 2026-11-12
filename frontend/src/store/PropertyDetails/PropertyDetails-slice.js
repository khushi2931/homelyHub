//propertyDetails
//create a slice name
//create intial state
//Request starts
//propertydata received
// error occurs
// export actions,slice

import {createSlice} from "@reduxjs/toolkit";

const propertyDetailsSlice=createSlice({
    name:"propertyDetails",
    initialState:{
        propertyDetails:null,
        loading:false,
        error:null
    },
    reducers:{
        getListRequest(state){
            state.loading=true;
            state.error=null;
        },
        getPropertyDetails(state,action){
            state.propertyDetails=action.payload;
            state.loading=false;
            state.error=null;
        },
        getErrors(state,action){
            state.error=action.payload;
            state.loading=false;
        }
    }

})
export const propertyDetailsAction=propertyDetailsSlice.actions;
export default propertyDetailsSlice;