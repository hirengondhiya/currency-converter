import "./App.css";
import { Provider } from "react-redux";
import Conversion from "./components/Conversion";
import store from "./store/configureStore";
function App() {
  return (
    <Provider store={store}>
      <Conversion originAmount={store.getState().originAmount} />
    </Provider>
  );
}

export default App;
