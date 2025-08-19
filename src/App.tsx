import {useUnity} from "./bridge/useUnity";
import UnityPlayer from "./bridge/UnityPlayer";
import MessageInterfaceSample from "./components/MessageInterfaceSample";
import {MainHandler} from "@/bridge/handler/MainHandler";
import {SampleHandler} from "@/bridge/handler/SampleHandler";

export default function App() {
    const {unityProvider, isLoaded, loadingProgression} = useUnity();

    function Initialize() {
        MainHandler.register(SampleHandler);
    }

    Initialize();
    return (
        <div className="min-h-screen bg-gray-100 p-4 space-y-4">
            <div className="bg-white rounded-lg shadow p-4">
                <UnityPlayer
                    unityProvider={unityProvider}
                    isLoaded={isLoaded}
                    loadingProgression={loadingProgression}
                />
            </div>
            <MessageInterfaceSample/>
        </div>
    );
}
