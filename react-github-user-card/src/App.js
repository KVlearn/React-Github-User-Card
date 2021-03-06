import React from 'react';
import axios from 'axios';
import Cards from './components/Cards';
import Search from './components/Search';
import Error from './components/Error';
import './App.css';

class App extends React.Component{
  constructor(){
    super();
    this.initialState= {
      userInfo:[],
      followersInfo:[],
      logins:[],
      search:"",
      loadSuccess:true,
      errorInfo:""  
    } 
    this.state= this.initialState;
       
  }

  
  //Function to Get UserInfo for given username and setState userInfo
  getUserInfo =(username)=>{
    axios.get(`https://api.github.com/users/${username}`)
       .then(res=> {
         console.log('res from axios get=',res.data)
         this.setState({
          userInfo: [...this.state.userInfo,res.data],
          loadSuccess:true,
          errorInfo:""
         })
         console.log('getUserInfo=',this.state);
       })
       .catch(err=>{
         this.setState({
          loadSuccess:false,
          errorInfo:err.message
         })
        
        console.log('error in axios get userinfo',err)
        console.log('error info',this.state.errorInfo)
      })
  }

   //Function to Get FollowersInfo for the given username and setstate for 
   //followersInfo and logins(by mapping to get login for each follower)
  getFollInfo=(username)=>{
     axios.get(`https://api.github.com/users/${username}/followers`)
      .then(res=> {
        console.log('followersInfo in axios',res.data)
       this.setState({
         followersInfo: res.data,
         loadSuccess:true,
         errorInfo:"",
         logins: res.data.map((item)=>item.login)
       })
      //  const logins= res.data.map((item)=>item.login)
      //  logins.forEach((item)=>this.getUserInfo(item))
      })
       
      
      .catch(err=>{
        console.log('error in axios get foll info',err)
        this.setState({
          loadSuccess:false,
          errorInfo:err.data
         })
        
      })
  }

  searchUser=(user)=>{
    this.setState({
      userInfo:[], //initialize userInfo array so it can store user on search
      search:user
    }) 
  }


  componentDidMount(){
    console.log('state in CDM=',this.state)
    const myusername="kavya3v" //My Username for initial axios get
    this.getUserInfo(myusername); // Get UserInfo and update userInfo state
    this.getFollInfo(myusername); // Get Followers info and update followersInfo and logins in state
  }

  componentDidUpdate(prevProps,prevState){
    console.log('in component did update=',prevProps,prevState)
    //this.state.logins gets updated in followers call to get the logins of the followers. Now on CDU invoke getFollInfo to for eact logins
    if(prevState.logins !== this.state.logins){
     console.log('in CDUpdate change this.state.logins',this.state.logins)
     this.state.logins.forEach((item)=>this.getUserInfo(item))
    }
     if(prevState.search !== this.state.search){
        console.log('in CDU=search user changed',this.state.search)
        this.getUserInfo(this.state.search);
        this.getFollInfo(this.state.search); 
    }
     
  }

  render(){

  return (
    <div className="App">
      <header>
      <h1>Github User Card</h1>
      </header>
      <Search searchUser={this.searchUser}/>
      {(this.state.search === "") ?
      <h2>Github User Kavya and Followers </h2>
      : <h2>Github User {this.state.search} and Followers </h2>
      }   
      {this.state.loadSuccess ?   
        this.state.userInfo.map(item=>{
          return(<Cards key={item.name} userInfo={item}/>)
        }) :<Error errorInfo={this.state.errorInfo}/>

      }
    </div>
  );
  }
}

export default App;
