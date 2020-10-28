import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { listLogs } from "./API";
import LogEntryForm from "./LogEntryForm";

const App = () => {
  const [logEntries, setlogEntries] = useState([]);
  const [showPopup, setshowPopup] = useState({});
  const [addEntryLocation, setaddEntryLocation] = useState(null);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 26.648546,
    longitude: 77.612999,
    zoom: 4,
  });

  const getEntries = async () => {
    const logEntries = await listLogs();
    setlogEntries(logEntries);
  };
  useEffect(() => {
    getEntries();
  }, []);

  const showAddMarkerPopup = (event) => {
    const [longitude, latitude] = event.lngLat;
    setaddEntryLocation({
      latitude,
      longitude,
    });
  };

  return (
    <ReactMapGL
      {...viewport}
      mapStyle="mapbox://styles/niteshchaurasiya/ckgqyi31q59ca19qobgl846kn"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
      onDblClick={showAddMarkerPopup}
    >
      {logEntries.map((entry) => (
        <React.Fragment key={entry._id}>
          <Marker
            latitude={entry.latitude}
            longitude={entry.longitude}
            offsetLeft={-20}
            offsetTop={-10}
          >
            <div
              onClick={() =>
                setshowPopup({
                  [entry._id]: true,
                })
              }
            >
              <svg
                className="marker"
                viewBox="0 0 24 24"
                style={{
                  height: 3 * viewport.zoom,
                  width: 3 * viewport.zoom,
                }}
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
          </Marker>
          {showPopup[entry._id] ? (
            <Popup
              latitude={entry.latitude}
              longitude={entry.longitude}
              closeButton={true}
              closeOnClick={false}
              dynamicPosition={true}
              onClose={() => setshowPopup({})}
              anchor="top"
            >
              <div className="popup">
                <h3>{entry.title}</h3>
                <p>{entry.description}</p>
                <small>
                  Visited on :{new Date(entry.visitDate).toLocaleDateString()}
                </small>
                {entry.image && (
                  <img className="image" src={entry.image} alt={entry.title} />
                )}
              </div>
            </Popup>
          ) : null}
        </React.Fragment>
      ))}
      {addEntryLocation ? (
        <>
          <Marker
            latitude={addEntryLocation.latitude}
            longitude={addEntryLocation.longitude}
            offsetLeft={-20}
            offsetTop={-10}
          >
            <div>
              <svg
                className="marker-red"
                viewBox="0 0 24 24"
                style={{
                  height: 3 * viewport.zoom,
                  width: 3 * viewport.zoom,
                }}
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
          </Marker>
          <Popup
            latitude={addEntryLocation.latitude}
            longitude={addEntryLocation.longitude}
            closeButton={true}
            closeOnClick={false}
            dynamicPosition={true}
            onClose={() => setaddEntryLocation(null)}
            anchor="bottom"
          >
            <div className="popup">
              <LogEntryForm
                onClose={() => {
                  setaddEntryLocation(null);
                  getEntries();
                }}
                location={addEntryLocation}
              />
            </div>
          </Popup>
        </>
      ) : null}
    </ReactMapGL>
  );
};

export default App;
