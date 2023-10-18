import { Outlet } from "react-router-dom";
import React from "react";
// https://dribbble.com/shots/22401540-Investment-Dashboard-UI-Screen

function App() {
  return (
    <React.Fragment>
      <div className="h-screen">
          <Outlet />
      </div>
    </React.Fragment>

  );
}

export default App;
