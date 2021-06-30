import React, { useRef, useState } from "react";
import Room from "@material-ui/icons/Room";
import CancelIcon from "@material-ui/icons/Cancel";
import "../CSS/login.css";
import Axios from "axios";

export default function Login({ setShowLogin, myStorage, setCurrentUser }) {
	const [error, setError] = useState(false);
	const nameRef = useRef();
	const passwordRef = useRef();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const user = {
			username: nameRef.current.value,
			password: passwordRef.current.value,
		};
		try {
			const res = await Axios.post("/users/login", user);
			myStorage.setItem("user", res.data.username);
			setCurrentUser(res.data.username);
			setShowLogin(false);
			setError(false);
		} catch (err) {
			setError(true);
		}
	};

	return (
		<div className='loginContainer'>
			<div className='logo'>
				<Room />
				LamaPin
			</div>
			<form onSubmit={handleSubmit}>
				<input type='text' placeholder='username' ref={nameRef} />
				<input type='password' placeholder='password' ref={passwordRef} />
				<button className='loginBtn'>Login</button>
				{error && <span className='failure'>Something Went Wrong</span>}
			</form>
			<CancelIcon className='loginCancel' onClick={() => setShowLogin(false)} />
		</div>
	);
}
