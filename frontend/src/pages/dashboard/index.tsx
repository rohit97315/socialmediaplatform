import { getAboutUser } from '@/config/redux/action/authAction';
import { getAllPosts } from '@/config/redux/action/postAction';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

export default function Dashboard() {


    const router = useRouter();

    const dispath = useDispatch();

    const authState = useSelector((state:any) => state.auth)


    const [isTokenThere,setIsTokenThere] = useState(false);

    useEffect(() => {
        if(localStorage.getItem("token") === null){
            router.push("/login");
        }

        setIsTokenThere(true);
    })


    useEffect(() => {
        if(isTokenThere){
            (dispath as any)(getAllPosts);
            (dispath as any)(getAboutUser({token: localStorage.getItem('token')!}));
        }
    },[isTokenThere])


  return (
    <div>
      <h2>dashboard</h2>
    </div>
  )
}
