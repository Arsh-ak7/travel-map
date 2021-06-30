import React, { useRef, useState } from "react";
import Room from "@material-ui/icons/Room";
import CancelIcon from "@material-ui/icons/Cancel";
import "../CSS/register.css";
import Axios from "axios";

export default function Register({ setShowRegister }) {
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState(false);
	const nameRef = useRef();
	const emailRef = useRef();
	const passwordRef = useRef();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const newUser = {
			username: nameRef.current.value,
			email: emailRef.current.value,
			password: passwordRef.current.value,
		};
		try {
			await Axios.post("/users/register", newUser);
			setError(false);
			setSuccess(true);
		} catch (err) {
			setSuccess(false);
			setError(true);
		}
	};

	return (
		<div className='registerContainer'>
			<div className='logo'>
				<Room />
				LamaPin
			</div>
			<form onSubmit={handleSubmit}>
				<input type='text' placeholder='username' ref={nameRef} />
				<input type='email' placeholder='email' ref={emailRef} />
				<input type='password' placeholder='password' ref={passwordRef} />
				<button className='registerBtn'>Register</button>
				{success && <span className='success'>You can Login Now!</span>}
				{error && <span className='failure'>Something Went Wrong</span>}
			</form>
			<CancelIcon
				className='registerCancel'
				onClick={() => setShowRegister(false)}
			/>
		</div>
	);
}
