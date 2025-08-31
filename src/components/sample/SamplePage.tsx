import {useState} from "react";
import UnityPlayer from "@/bridge/UnityPlayer";
import MessageInterfaceSample from "@/components/sample/MessageInterfaceSample";
import ApiPlaygroundSample from "@/components/sample/ApiPlaygroundSample";
import {useUnity} from "@/bridge/useUnity";

export default function SamplePage() {

    const {unityProvider, isLoaded, loadingProgression} = useUnity();
    const [showMessage, setShowMessage] = useState<boolean>(false);

    return (
        <div className="p-6 space-y-4">
            <button
                onClick={() => setShowMessage((v) => !v)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition"
            >
                {showMessage ? "기본 화면 보기" : "MessageInterfaceSample 보기"}
            </button>

            <div className="mt-4">
                {showMessage ? <div className="min-h-screen bg-gray-100 p-4 flex flex-col gap-4">
                    <div className="bg-white rounded-lg shadow p-4">
                        <UnityPlayer
                            unityProvider={unityProvider}
                            isLoaded={isLoaded}
                            loadingProgression={loadingProgression}
                        />
                    </div>
                    <MessageInterfaceSample className="flex-1"/>
                </div> : <ApiPlaygroundSample/>}
            </div>
        </div>
    );
}