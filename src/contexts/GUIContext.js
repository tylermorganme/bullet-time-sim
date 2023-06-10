import { createContext, useContext, useEffect, useState, useRef } from "react";
import * as dat from "dat.gui";

const GUIContext = createContext();

export const useGUI = () => useContext(GUIContext);

export const GUIProvider = ({ children }) => {
  const [parameters, setParameters] = useState({
    scale: 0.01,
    rotation: 0,
    animationTime: 0,
    fps: 5,
    duration: 1,
    numCameras: 2,
    radius: 3,
    cameraHeight: 1.5,
  });

  useEffect(() => {
    const gui = new dat.GUI();

    const controllers = {
      scale: gui.add(parameters, "scale", 0.01, 0.1),
      rotation: gui.add(parameters, "rotation", -Math.PI, Math.PI),
      animationTime: gui.add(parameters, "animationTime", 0, 2),
      fps: gui.add(parameters, "fps", 0, 120),
      duration: gui.add(parameters, "duration", 0, 4),
      numCameras: gui.add(parameters, "numCameras", 0, 64),
      radius: gui.add(parameters, "radius", 0, 10),
      cameraHeight: gui.add(parameters, "cameraHeight", 0, 4),
    };

    for (const key in controllers) {
      controllers[key].onChange((value) => {
        setParameters((prevParameters) => ({
          ...prevParameters,
          [key]: value,
        }));
      });
    }

    return () => {
      gui.destroy();
    };
  }, []);

  return (
    <GUIContext.Provider value={{ parameters, setParameters }}>
      {children}
    </GUIContext.Provider>
  );
};