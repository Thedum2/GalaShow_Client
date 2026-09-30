import { MainHandler } from "./handler/MainHandler";
import { SampleHandler } from "./handler/SampleHandler";
import { RGFHandler } from "./handler/RGFHandler";

MainHandler.register(SampleHandler);
MainHandler.register(RGFHandler);

console.log("[bridge] All handlers registered");
