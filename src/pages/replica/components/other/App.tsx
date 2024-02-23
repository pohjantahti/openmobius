import AudioPlayer from "./AudioPlayer";
import Filters from "./Filters";
import Navigation from "./Navigation";
import "./App.css";

function App() {
    return (
        <div id="replicaApp" style={{ height: "inherit", width: "inherit" }}>
            <Filters />
            <AudioPlayer />
            <Navigation />
        </div>
    );
}

export default App;
