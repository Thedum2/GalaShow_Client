import Icon from "@/components/icons";
import StartGameButton from "@/components/lobby/StartGameButton";
import React from "react";
import {hello, world} from "polychat-bridge";

export default function CsSamplePage() {
    return (
        <div>
            CsSamplePage

            <StartGameButton
                text="Hello"
                icon={<Icon name="bookmark" size={35} mode="eager"/>}
                backgroundColor="#FFDE59"
                textColor="#000000"
                onClick={() => {
                    alert(hello()+' '+world());
                }}
            />
        </div>

    );
}