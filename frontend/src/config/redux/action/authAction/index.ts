import { createAsyncThunk } from "@reduxjs/toolkit";

import {clientServer} from "@/config";




export const loginUser = createAsyncThunk(
    "user/login",
    async(user:{ email: string; password: string }, thunkAPI) => {
        try{
            const response = await clientServer.post("/login",{
                email:user.email,
                password:user.password
            })

            if(response.data.token){
                localStorage.setItem("token",response.data.token);
            }else{
                return thunkAPI.rejectWithValue({
                    message:"token not provided"
                })
            }

            return thunkAPI.fulfillWithValue(response.data.token);
        }catch(error:any){
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const registerUser = createAsyncThunk(
    "user/register",
    async(user:{ email: string; password: string },thunkAPI) =>{
         try{
            const response = await clientServer.post("/register",{
                email:user.email,
                password:user.password
            })
         }catch(error:any){
            return thunkAPI.rejectWithValue(error.response.data);
         }
    }
)