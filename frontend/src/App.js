import { useEffect, useState } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import RoomIcon from "@material-ui/icons/Room";
import StarIcon from "@material-ui/icons/Star";
import Axios from "axios";
import { format } from "timeago.js";
import Register from "./components/Register";
import Login from "./components/Login";
import "./app.css";

function App() {
	const myStorage = window.localStorage;
	const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));
	const [pins, setPins] = useState([]);
	const [currentPlaceId, setCurrentPlaceId] = useState(null);
	const [newPlace, setNewPlace] = useState(null);
	const [title, setTitle] = useState("");
	const [desc, setDesc] = useState("");
	const [rating, setRating] = useState(0);
	const [showRegister, setShowRegister] = useState(false);
	const [showLogin, setShowLogin] = useState(false);
	const [viewport, setViewport] = useState({
		height: "100vh",
		width: "100vw",
		latitude: 46,
		longitude: 12,
		zoom: 3,
	});

	useEffect(() => {
		const getPins = async () => {
			try {
				const res = await Axios.get("/pins");
				setPins(res.data);
			} catch (err) {
				console.log(err);
			}
		};
		getPins();
	}, []);

	const handleMarkerClick = (id, lat, long) => {
		setCurrentPlaceId(id);
		setViewport({ ...viewport, latitude: lat, longitude: long });
	};

	const handleAddClick = (e) => {
		const [long, lat] = e.lngLat;
		setNewPlace({
			lat,
			long,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const newPin = {
			username: currentUser,
			title,
			desc,
			rating,
			lat: newPlace.lat,
			long: newPlace.long,
		};

		try {
			const res = await Axios.post("/pins", newPin);
			setPins([...pins, res.data]);
			setNewPlace(null);
		} catch (err) {
			console.log(err);
		}
	};

	const handleLogout = () => {
		myStorage.removeItem("user");
		setCurrentUser(null);
	};

	return (
		<div className='App'>
			<ReactMapGL
				{...viewport}
				width='100vw'
				height='100vh'
				transitionDuration='300'
				mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
				onViewportChange={(viewport) => setViewport(viewport)}
				mapStyle='mapbox://styles/arsh-ak7/ckqi1dldb05q217rr6vfq76j3'
				onDblClick={handleAddClick}>
				{pins.map((p) => (
					<>
						<Marker
							latitude={p.lat}
							longitude={p.long}
							offsetLeft={-viewport.zoom * 3.5}
							offsetTop={-viewport.zoom * 7}>
							<RoomIcon
								style={{
									fontSize: viewport.zoom * 7,
									color: p.username === currentUser ? "tomato" : "slateblue",
									cursor: "pointer",
								}}
								onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
							/>
						</Marker>
						{p._id === currentPlaceId && (
							<Popup
								latitude={p.lat}
								longitude={p.long}
								closeButton={true}
								closeOnClick={false}
								onClose={() => setCurrentPlaceId(null)}
								anchor='left'>
								<div className='card'>
									<label>Place</label>
									<h4 className='place'>{p.title}</h4>
									<label>Review</label>
									<p className='desc'>{p.desc}</p>
									<label>Rating</label>
									<div className='stars'>
										<StarIcon className='star' />
										<StarIcon className='star' />
										<StarIcon className='star' />
										<StarIcon className='star' />
										<StarIcon className='star' />
									</div>
									<label>Desc</label>
									<span className='username'>Created by {p.username}</span>
									<span className='date'>{format(p.createdAt)}</span>
								</div>
							</Popup>
						)}
					</>
				))}
				{newPlace && (
					<Popup
						latitude={newPlace.lat}
						longitude={newPlace.long}
						closeButton={true}
						closeOnClick={false}
						onClose={() => setNewPlace(null)}
						anchor='left'>
						<div>
							<form onSubmit={handleSubmit}>
								<lable>Title</lable>
								<input
									placeholder='Enter a title'
									onChange={(e) => setTitle(e.target.value)}
								/>
								<lable>Review</lable>
								<textarea
									placeholder='Say us something about it'
									onChange={(e) => setDesc(e.target.value)}
								/>
								<lable>Rating</lable>
								<select onChange={(e) => setRating(e.target.value)}>
									<option value='1'>1</option>
									<option value='2'>2</option>
									<option value='3'>3</option>
									<option value='4'>4</option>
									<option value='5'>5</option>
								</select>
								<button className='submitButton' type='submit'>
									Add Pin
								</button>
							</form>
						</div>
					</Popup>
				)}

				{currentUser ? (
					<button className='button logout' onClick={handleLogout}>
						Log Out
					</button>
				) : (
					<div className='buttons'>
						<button
							className='button login'
							onClick={() => {
								setShowLogin(true);
								setShowRegister(false);
							}}>
							Login
						</button>
						<button
							className='button register'
							onClick={() => {
								setShowLogin(false);
								setShowRegister(true);
							}}>
							Register
						</button>
					</div>
				)}
				{showRegister && <Register setShowRegister={setShowRegister} />}
				{showLogin && (
					<Login
						setShowLogin={setShowLogin}
						myStorage={myStorage}
						setCurrentUser={setCurrentUser}
					/>
				)}
			</ReactMapGL>
		</div>
	);
}

export default App;
