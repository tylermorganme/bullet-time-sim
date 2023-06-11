import React from "react";
import { useGUI } from "../contexts/GUIContext";

export const UI = () => {
  const {
    loading,
    progress,
    removeMarkerFunctionRef,
    addMarkerFunctionRef,
    logCameraPositionRef,
  } = useGUI();
  const handleRemove = () => {
    removeMarkerFunctionRef.current();
  };

  const handleAdd = () => {
    addMarkerFunctionRef.current();
  };

  const handleLogCameraPosition = () => {
    logCameraPositionRef.current();
  };

  return (
    <div style={{top: 0, left:0, position: "absolute", zIndex: 2}}>
      {loading && <div>Loading...</div>}
      <progress value={progress} max="100" />
      <button onClick={handleAdd}>Add Spheres</button>
      <button onClick={handleRemove}>Remove Spheres</button>
      <button onClick={handleLogCameraPosition}>Log Camera Position</button>
      <div style={{ color: "black" }}>Press Ctrl + Q to Capture</div>
    </div>
  );
};
