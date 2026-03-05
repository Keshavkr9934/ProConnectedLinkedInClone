import {react,useEffect } from 'react';
import UserLayout from "@/layouts/Userlayout";
import DashBoardLayout from "@/layouts/dashBoardLayout";
import { useSelector, useDispatch } from 'react-redux';
import { getAllUsers } from '@/config/redux/action/authaction';
import Style from './discover.module.css';
import { BASE_URL } from '@/config';
import { useRouter } from 'next/router';

export default function Discover() {
  const authState = useSelector((state)=> state.auth);
  const dispatch =useDispatch();
  const route=useRouter();
  useEffect(()=>{
    if(!authState.all_profiles_feched){
      dispatch(getAllUsers());
    }
  }, [authState.all_profiles_feched])
  return (
    <UserLayout>
      <DashBoardLayout>
        <div className={Style.discoverContainer}>
          <h1 className={Style.heading}>Discover</h1>
          <div className={Style.userList}>
            {authState.all_profiles_feched && authState.all_users.map((user) =>{
              return (
                <div onClick={()=>route.push(`/view_profile/${user.userId.username}`)} key={user._id} className={Style.userCard}>
                  <img src={`${BASE_URL}/${user.userId.profilePicture}`|| '/default-profile.png'} alt={user.name} className={Style.profileImage} />
                  <div className={Style.userInfo}>
                  <h2 className={Style.userName}>{user.userId.name}</h2>
                  <p className={Style.userBio}>{user.bio || 'No bio available'}</p>
                  </div>
                </div>
              )
            } )}
          </div>
        </div>
      </DashBoardLayout>
    </UserLayout>
  );
}