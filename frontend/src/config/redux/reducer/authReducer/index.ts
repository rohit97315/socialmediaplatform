import { createSlice } from "@reduxjs/toolkit"
import { loginUser,registerUser } from "../../action/authAction"






const initialState = {
    user:[],
    isError:false,
    isSuccess:false,
    isLoading:false,
    loggedIn:false,
    message:"",
    profileFetched:false,
    connections:[],
    connectionReques:[]

}


const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        reset: () => initialState,
        handleLoginUser: (state) => {
            state.message = "hello"
        }
    },
    extraReducers: (builder) =>{
        builder.addCase(loginUser.pending, (state) =>{
            state.isLoading = true
            state.message = "knocking the door"
        })
        .addCase(loginUser.fulfilled,(state,action) => {
            state.isLoading=false;
            state.isError = false;
            state.isSuccess=true;
            state.loggedIn = true;
            state.message="logged in successfully"
        })
        .addCase(loginUser.rejected,(state,action) => {
            state.isLoading=false;
            state.isError=true;
            state.message=action.payload as string
        })
        .addCase(registerUser.pending,(state)=>{
            state.isLoading = true
            state.message = "knocking the door"
        })
        .addCase(registerUser.fulfilled,(state,action) =>{
            state.isLoading=false;
            state.isError = false;
            state.isSuccess=true;
            state.loggedIn = true;
            state.message="logged in successfully"
        })
        .addCase(registerUser.rejected,(state,action) => {
            state.isLoading=false;
            state.isError=true;
            state.message=action.payload as string
        })
    }
})

export default authSlice.reducer;