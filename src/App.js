import "./App.css";
import { useState, useEffect } from "react";
import Conversion from "./components/Conversion";
import store from "./store/configureStore";
function App() {
  const [state, setState] = useState({});
  useEffect(() => {
    store.subscribe(() => setState({}));
  }, []);
  return <Conversion originAmount={store.getState().originAmount} />;
}

export default App;
