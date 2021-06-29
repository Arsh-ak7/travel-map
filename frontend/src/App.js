import { useState } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import RoomIcon from "@material-ui/icons/Room";

function App() {
	const [viewport, setViewport] = useState({
		height: "100vh",
		width: "100vw",
		latitude: 46,
		longitude: 12,
		zoom: 3,
	});
	return (
		<div className='App'>
			<ReactMapGL
				{...viewport}
				width='100vw'
				height='100vh'
				mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
				onViewportChange={(viewport) => setViewport(viewport)}
				mapStyle='mapbox://styles/arsh-ak7/ckqi1dldb05q217rr6vfq76j3'>
				<Marker
					latitude={48.858093}
					longitude={2.294694}
					offsetLeft={-20}
					offsetTop={-10}>
					<RoomIcon style={{ fontSize: viewport.zoom * 7 }} />
				</Marker>
				<Popup
					latitude={48.858093}
					longitude={2.294694}
					closeButton={true}
					closeOnClick={false}
					anchor='left'>
					<div className='card'>
						<label>Place</label>
						<label>Review</label>
						<label>Rating</label>
						<label>Desc</label>
					</div>
				</Popup>
			</ReactMapGL>
		</div>
	);
}

export default App;
