import {useUnity} from "@/bridge/useUnity";
import UnityPlayer from "@/bridge/UnityPlayer";

export default function SimulationSamplePage() {
    const {unityProvider, isLoaded, loadingProgression} = useUnity();

    return (
        <UnityPlayer
            unityProvider={unityProvider}
            isLoaded={isLoaded}
            loadingProgression={loadingProgression}
        />
    );
}