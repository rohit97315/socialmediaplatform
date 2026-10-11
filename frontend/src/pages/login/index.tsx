import { RootState } from "@/config/redux/store";
import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./style.module.css";


export default function LoginComponent() {



  const authState = useSelector((state:RootState) => state.auth);
  const router = useRouter();

  const [userLoginMethod,setUserLoginMethod] = useState(false);


  useEffect(() =>{
    if(authState.loggedIn){
      router.push("/dashboard");
    }
  })

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
              <div className={styles.cardContainer_left}>
                  <p className={styles.cardleft_heading}>{userLoginMethod?"Sign In":"Sign up"}</p>
              </div>

              <div className={styles.cardContainer_right}>

              </div>

        </div>
      </div>
    </UserLayout>
    
  )
}