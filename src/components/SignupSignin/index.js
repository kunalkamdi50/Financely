import React, { useState } from 'react'
import "./styles.css"
import Input from '../Input'
import Button from '../Button';
import { GoogleAuthProvider, createUserWithEmailAndPassword,  signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { toast } from 'react-toastify';
import { doc, getDoc, setDoc } from "firebase/firestore"; 
import { auth, db, provider } from '../../firebase';
import { useNavigate } from 'react-router-dom';


function SignupSigninComponent() {
  const[name, setName]=useState("");
  const[email, setEmail]=useState("");
  const[password, setPassword]=useState("");
  const[confirmPassword, setConfirmPassword]=useState("");
  const[loginForm, setLoginForm]=useState(false);
  const[loading, setLoading]=useState(false);
  const navigate = useNavigate();
    
function signupWithEmail(){
  setLoading(true);
  console.log("Name", name);
  console.log("Email", email);
  console.log("Password", password);
  console.log("ConfirmPassword", confirmPassword);
  //Authenticate the user or basically create a new account with email and pass
  
  if(name!="" && email!="" && password!="" && confirmPassword!=""){
    if(password==confirmPassword){
      createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log("user>>>", user);
        toast.success("User Created!")
        setLoading(false);
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        await createDoc(user);
        navigate("/dashboard");
        //create a doc with user id as the following
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage)
        setLoading(false);
      });
    }else{
      toast.error("Password and Confirm PassWord don't Match");
      setLoading(false);
    }
   
}else{
  toast.error("All fields all mandatory!");
  setLoading(false);
}
}

function LoginUsingEmail(){
  console.log("Email", email);
  console.log("Password", password);
  setLoading(true);

  if( email!="" && password!="" ){
     signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        toast.success("User Logged In!");
        console.log("User Logged In!", user)
        setLoading(false);
        navigate("/dashboard");
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(errorMessage);
        setLoading(false);
      });
  }else{
     toast.error("All fields are mandatory");
     setLoading(false);
  }
 
  
}

 async function createDoc(user){
  //make sure that the with uid doesn't exist
  //create a doc
  setLoading(true);
  if (!user) return;
  const userRef = doc(db, "users", user.uid);
  const userData = await getDoc(userRef);

  if (!userData.exists()) {
    const { displayName, email, photoURL } = user;
    const createdAt = new Date();
    try {
      await setDoc(userRef, {
        name: displayName ? displayName : name,
        email,
        photoURL: photoURL ? photoURL : "",
        createdAt,
      });
      toast.success("Account Created!");
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      console.error("Error creating user document: ", error);
      setLoading(false);
    }


}else{
  // toast.error("Doc alredy exists")
  setLoading(false);
}
}

function googleAuth() {
  setLoading(true);
  try{
    signInWithPopup(auth , provider)
    .then(async (result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      
      // The signed-in user info.
      const user = result.user;
      console.log("user>>>", user);
      await createDoc(user);
      setLoading(false);
      navigate("/dashboard");
      toast.success("User Authenticated!")
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    }).catch((error) => {
      // Handle Errors here.
      setLoading(false);
      const errorCode = error.code;
      const errorMessage = error.message;
     toast.error(errorMessage);
    });
  }catch(e){
    setLoading(false);
    toast.error(e.message);
  }
}


  return (
    <>
    {loginForm? (
    <div className='signup-wrapper'>
    <h2 className='title'>
    Login On <span style={{color: "var(--theme)"}}>Financely.</span>
    </h2>
    <form>
      <Input
      type={email}
      label={"Email"}
      state={email}
      setState={setEmail}
      placeholder={"JohnDoe@gmail.com"}
      />
       <Input
      type="password"
      label={"Password"}
      state={password}
      setState={setPassword}
      placeholder={"Example@123"}
      />
      <Button
      disabled={loading}
      text={loading ? 'Loading' : "Login Using Email and Password"} 
      onClick={LoginUsingEmail}
       />
      <p className="p-login">or</p>
      <Button
      onClick={googleAuth}
      disabled={loading}
      text={loading ? 'Loading' : " Login Using Google"}
      blue={true}
      />
      <p className="p-login"
      style={{cursor:"pointer"}}
      onClick={()=> setLoginForm(!loginForm)}
      >
        or Don't Have An Account? Click Here
      </p>
    </form>
  </div>
    ) : (
    <div className='signup-wrapper'>
    <h2 className='title'>
      Sign Up on <span style={{color: "var(--theme)"}}>Financely.</span>
    </h2>
    <form>
      <Input
      label={"Full Name"}
      state={name}
      setState={setName}
      placeholder={"John Doe"}
      />
      <Input
      type={email}
      label={"Email"}
      state={email}
      setState={setEmail}
      placeholder={"JohnDoe@gmail.com"}
      />
       <Input
      type="password"
      label={"Password"}
      state={password}
      setState={setPassword}
      placeholder={"Example@123"}
      />
      <Input
      type="password"
      label={"Confirm Password"}
      state={confirmPassword}
      setState={setConfirmPassword}
      placeholder={"Example@123"}
      />
      <Button
       disabled={loading}
       text={loading ? 'Loading' : "Signup Using Email and Password"} 
       onClick={signupWithEmail}
       />
      <p className='p-login'>or</p>
      <Button
      onClick={googleAuth}
      disabled={loading}
      text={loading ? 'Loading' : "Signup Using Google"}
      blue={true}
      />
      <p className="p-login"
       style={{cursor:"pointer"}}
       onClick={()=> setLoginForm(!loginForm)}
      >
        or Have An Account Already? Click Here
      </p>

    </form>
  </div>
  ) }
   
  </>
  )
}

export default SignupSigninComponent