import './App.css'
import {Unity, useUnityContext} from 'react-unity-webgl'
import {Fragment} from 'react'

function App() {
    const {unityProvider, loadingProgression, isLoaded} = useUnityContext({
        loaderUrl: '../build/unity/WebGL.loader.js',
        dataUrl: '../build/unity/WebGL.data',
        frameworkUrl: '../build/unity/WebGL.framework.js',
        codeUrl: '../build/unity/WebGL.wasm',
    })

    return (
        <Fragment>
            <header className="w-full py-4 bg-black text-white text-center text-2xl font-bold z-10">
                Galashow Unity Stage
            </header>

            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-black text-white z-20">
                    <p className="text-lg">
                        Loading... {Math.round(loadingProgression * 100)}%
                    </p>
                </div>
            )}

            <main className="w-full h-[calc(100vh-4rem)]">
                <Unity
                    unityProvider={unityProvider}
                    className={`w-full h-full ${isLoaded ? 'block' : 'invisible'}`}
                />
            </main>
        </Fragment>
    )
}

export default App
