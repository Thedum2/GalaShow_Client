import {MainHandler} from "./bridge/handler/MainHandler";
import {SampleHandler} from "./bridge/handler/SampleHandler";
import {useEffect} from "react";
import {Routes, Route} from "react-router-dom";
import MainPage from "@/pages/MainPage";


export default function App() {

    useEffect(() => {
        MainHandler.register(SampleHandler);
    }, []);

    return (
        <Routes>
            <Route path="/" element={<MainPage/>}/>
        </Routes>
    );
}