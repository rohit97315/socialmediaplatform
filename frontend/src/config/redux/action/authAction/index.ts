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
    async(user:{ email: string; password: string,username: string ,name:string},thunkAPI) =>{
         try{
            const request = await clientServer.post("/register",{
                username:user.username,
                email:user.email,
                password:user.password,
                name:user.name
            })
         }catch(error:any){
            return thunkAPI.rejectWithValue(error.response.data);
         }
    }
)

export const getAboutUser = createAsyncThunk(
    "user/getAboutUser",
    async(user: { token: string }, thunkAPI) => {
        try{
            const response = await clientServer.get("/get_user_and_profile",{
                params:{
                    token:user.token
                }
            })

            return thunkAPI.fulfillWithValue(response.data);

            

        }catch(e:any){
            return thunkAPI.rejectWithValue(e.response.data)
        }
    }
)