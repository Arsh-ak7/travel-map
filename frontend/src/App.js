import { useEffect, useState } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import RoomIcon from "@material-ui/icons/Room";
import StarIcon from "@material-ui/icons/Star";
import Axios from "axios";
import { format } from "timeago.js";
import "./app.css";

function App() {
	const [currentUser, setCurrentUser] = useState("Arsh");
	const [pins, setPins] = useState([]);
	const [currentPlaceId, setCurrentPlaceId] = useState(null);
	const [newPlace, setNewPlace] = useState(null);
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

	return (
		<div className='App'>
			<ReactMapGL
				{...viewport}
				width='100vw'
				height='100vh'
				transitionDuration='700'
				mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
				onViewportChange={(viewport) => setViewport(viewport)}
				mapStyle='mapbox://styles/arsh-ak7/ckqi1dldb05q217rr6vfq76j3'
				onDblClick={handleAddClick}>
				{pins.map((p) => (
					<>
						<Marker
							latitude={p.lat}
							longitude={p.long}
							offsetLeft={-20}
							offsetTop={-10}>
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
							<form>
								<lable>Title</lable>
								<input placeholder='Enter a title' />
								<lable>Review</lable>
								<textarea placeholder='Say us something about it' />
								<lable>Rating</lable>
								<select>
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
			</ReactMapGL>
		</div>
	);
}

export default App;
