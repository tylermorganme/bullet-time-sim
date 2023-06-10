import { createContext, useContext, useEffect, useState, useRef } from "react";
import * as dat from "dat.gui";

// Context to hold the GUI and the parameters
const GUIContext = createContext();

// Hook to use the GUI context
export const useGUI = () => useContext(GUIContext);

// Provider to provide the GUI and the parameters
export const GUIProvider = ({ children }) => {
//   const [scale, setScale] = useState(0.01);
//   const [rotation, setRotation] = useState(0);
//   const [animationTime, setAnimationTime] = useState(0);
//   const [fps, setFps] = useState(30);
//   const [duration, setDuration] = useState(2); //seconds

  const [parameters, setParameters] = useState({
    scale: 0.01,
    rotation: 0,
    animationTime: 0,
    fps: 30,
    duration: 2,
  });

  let gui;

  // GUI
  useEffect(() => {
    gui = new dat.GUI();
    // You can add more parameters as needed
    gui
      .add(parameters, "scale", 0.01, 0.1)
      .onChange((value) => setParameters({ ...parameters, scale: value }));
    gui
      .add(parameters, "rotation", -Math.PI, Math.PI)
      .onChange((value) => setParameters({ ...parameters, rotation: value }));
    gui
      .add(parameters, "animationTime", 0, 10)
        .onChange((value) => setParameters({ ...parameters, animationTime: value }));
    gui
      .add(parameters, "fps", 0, 120)
      .onChange((value) => setParameters({ ...parameters, fps: value }));
    gui
      .add(parameters, "duration", 0, 4)
      .onChange((value) => setParameters({ ...parameters, duration: value }));

    return () => gui.destroy();
  }, []);

  return (
    <GUIContext.Provider value={{ gui, parameters }}>
      {children}
    </GUIContext.Provider>
  );
};
