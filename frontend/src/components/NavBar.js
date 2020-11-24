import React, { useContext, useEffect, useRef,useState } from 'react'
import {Link,useHistory} from 'react-router-dom'
import { UserContext } from '../App'
import M from 'materialize-css'

const NavBar = () =>{
  const searchModal = useRef(null)
  const {state,dispatch} = useContext(UserContext)
  const [search,setSearch] = useState();
  const history = useHistory()
  const LogOut = () =>{
    localStorage.clear()
    dispatch({type:'CLEAR'})
    history.push('/signin');
  }
  useEffect(()=>{
    M.Modal.init(searchModal.current)
  },[])
  const renderList = () =>{
    if(state){
      return [
        <li key="profile"><Link to="/profile">Profile</Link></li>,
        <li key="createpost"><Link to="/createpost">Create Post</Link></li>,
        <li key="subscribedpost"><Link to="/myfollowingpost">Following Posts</Link></li>,
        <li key="logout"><button className="btn waves-effect waves-light #b71c1c red darken-4" onClick={()=> LogOut()}>Logout</button></li>
      ]
    }else{
      return[
        <li key="signin"><Link to="/signin">Login</Link></li>,
        <li key="signup"><Link to="/signup">Signup</Link></li>
      ]
    }
  }
return (
    <nav>
    <div className="nav-wrapper white">
      <Link to={state?"/":"/signin"} className="brand-logo left">Instagram</Link>
      <ul id="nav-mobile" className="right">
      {renderList()}
      </ul>
      </div>
  </nav>
        

)
}

export default NavBar