
import { makeVar } from "@apollo/client";
import Social from "./pages/Social";

export const markersInMapVar = makeVar([])

function App() {
  return (
    <Social />
  )
}

export default App;
