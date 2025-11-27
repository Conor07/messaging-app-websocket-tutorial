import Login from "./components/Login.tsx";
import useLocalStorage from "./hooks/useLocalStorage.ts";
import Dashboard from "./components/Dashboard.tsx";
import { ContactsProvider } from "./contexts/ContactsProvider.tsx";

function App() {
  const [id, setId] = useLocalStorage<string>("id");

  const dashboard = (
    <ContactsProvider>
      <Dashboard id={id} />
    </ContactsProvider>
  );

  return <>{id ? dashboard : <Login onIdSubmit={setId} />}</>;
}

export default App;
