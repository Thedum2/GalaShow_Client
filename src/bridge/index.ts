import { MainHandler } from "./handler/MainHandler";
import { SampleHandler } from "./handler/SampleHandler";

MainHandler.register(SampleHandler);

console.log("[bridge] All handlers registered");
