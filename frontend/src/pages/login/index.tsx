import { RootState } from "@/config/redux/store";
import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./style.module.css";
import { loginUser, registerUser } from "@/config/redux/action/authAction";
import { emptyMessage } from "@/config/redux/reducer/authReducer";


export default function LoginComponent() {



  const authState = useSelector((state:RootState) => state.auth);
  const router = useRouter();
  const dispath = useDispatch();



  const [userLoginMethod,setUserLoginMethod] = useState(false);


  const[email,setEmail]= useState("");
  const[password,setPassword]= useState("");
  const[username,setUsername]= useState("");
  const[name,setName]= useState("");

  useEffect(() =>{
    if(authState.loggedIn){
      router.push("/dashboard");
    }
  },[authState.loggedIn])


  useEffect(() => {
    if(localStorage.getItem("token")){
      router.push("/dashboard");
    }
  })

  useEffect(() => {
    dispath(emptyMessage());
  },[userLoginMethod])




  const handleRegister = () => {
    console.log("registering");
    (dispath as any)(registerUser({ username, password, email, name }));
  }
  const handleLogin = () => {
    console.log("logging IN");
    (dispath as any)(loginUser({email,password}));
  }



  return (
    <UserLayout>

      
      <div className={styles.container}>
        <div className={styles.cardContainer}>
              <div className={styles.cardContainer_left}>
                  <p className={styles.cardleft_heading}>{userLoginMethod?"Sign In":"Sign up"}</p>
                  <p style={{color:authState.isError? "red":"green"}}>{(authState.message as any).message}</p>

                  <div className={styles.inputContainers}>
                      {!userLoginMethod && <div className={styles.inputRow}>
                          <input onChange={(e) => setUsername(e.target.value)} className={styles.inputField} type="text" placeholder="Username"></input>
                          <input onChange={(e) => setName(e.target.value)} className={styles.inputField} type="text" placeholder="Name"></input>
                      </div>}

                          
                      <input onChange={(e) => setEmail(e.target.value)} className={styles.inputField} type="text" placeholder="Email"></input>
                      <input onChange={(e) => setPassword(e.target.value)} className={styles.inputField} type="text" placeholder="Password"></input>

                      <div onClick={() => {
                        if(userLoginMethod){
                          handleLogin();
                        }else{
                          handleRegister();
                        }
                      }} className={styles.buttonWithOutline}>
                        <p>{userLoginMethod?"Sign In":"Sign up"}</p>
                      </div>



                  </div>

                  


              </div>

              <div className={styles.cardContainer_right}>
                      
                        <p>Already have an Account</p>
                        <div onClick={() => {
                          setUserLoginMethod(!userLoginMethod)
                      }} style={{color:"black",textAlign:"center"}} className={styles.buttonWithOutline}>
                        <p>{userLoginMethod?"Sign Up":"Sign In"}</p>
                      </div>

                      
              </div>

        </div>
      </div>
    </UserLayout>
    
  )
}