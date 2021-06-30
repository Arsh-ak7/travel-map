import { useEffect, useState } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import RoomIcon from "@material-ui/icons/Room";
import StarIcon from "@material-ui/icons/Star";
import Axios from "axios";
import { format } from "timeago.js";
import "./app.css";

function App() {
	const [pins, setPins] = useState([]);
	const [currentPlaceId, setCurrentPlaceId] = useState(null);
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
				console.log(res);
				setPins(res.data);
			} catch (err) {
				console.log(err);
			}
		};
		getPins();
	}, []);

	const handleMarkerClick = (id) => {
		setCurrentPlaceId(id);
	};

	return (
		<div className='App'>
			<ReactMapGL
				{...viewport}
				width='100vw'
				height='100vh'
				mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
				onViewportChange={(viewport) => setViewport(viewport)}
				mapStyle='mapbox://styles/arsh-ak7/ckqi1dldb05q217rr6vfq76j3'>
				{pins.map((p) => (
					<>
						<Marker
							latitude={p.lat}
							longitude={p.long}
							offsetLeft={-20}
							offsetTop={-10}>
							<RoomIcon
								style={{ fontSize: viewport.zoom * 7 }}
								onClick={() => handleMarkerClick(p._id)}
							/>
						</Marker>
						{p._id === currentPlaceId && (
							<Popup
								latitude={p.lat}
								longitude={p.long}
								closeButton={true}
								closeOnClick={true}
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
			</ReactMapGL>
		</div>
	);
}

export default App;
