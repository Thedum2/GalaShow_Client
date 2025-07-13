import './App.css'
import {Unity, useUnityContext} from "react-unity-webgl";
import {Fragment} from "react";

function App() {

    const {unityProvider, loadingProgression, isLoaded} = useUnityContext({
        loaderUrl: "../build/unity/Downloads.loader.js",
        dataUrl: "../build/unity/Downloads.data",
        frameworkUrl: "../build/unity/Downloads.framework.js",
        codeUrl: "../build/unity/Downloads.wasm",
    });

    return (
        <Fragment>
            {!isLoaded && (
                <p>Loading Application... {Math.round(loadingProgression * 100)}%</p>
            )}
            <Unity
                unityProvider={unityProvider}
                style={{visibility: isLoaded ? "visible" : "hidden"}}
            />
        </Fragment>
    )
}

export default App
