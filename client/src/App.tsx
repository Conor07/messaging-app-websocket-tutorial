import Login from "./components/Login.tsx";
import useLocalStorage from "./hooks/useLocalStorage.ts";
import Dashboard from "./components/Dashboard.tsx";
import { ContactsProvider } from "./contexts/ContactsProvider.tsx";
import ConversationsProvider from "./contexts/ConversationsProvider.tsx";
import { SocketProvider } from "./contexts/SocketProvider.tsx";

function App() {
  const [id, setId] = useLocalStorage<string>("id");

  if (!id) return <Login onIdSubmit={setId} />;

  return (
    <SocketProvider id={id}>
      <ContactsProvider>
        <ConversationsProvider id={id}>
          <Dashboard id={id} />
        </ConversationsProvider>
      </ContactsProvider>
    </SocketProvider>
  );
}

export default App;
