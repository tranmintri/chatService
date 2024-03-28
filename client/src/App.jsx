import { ToastContainer } from 'react-toastify';
import AppRouter from './router/AppRouter';
import 'react-toastify/dist/ReactToastify.css';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StateProvider } from './context/StateContext';
import reducer, { initialState } from "./context/StateReducers"

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <StateProvider initialState={initialState} reducer={reducer}>
          <AppRouter />
        </StateProvider>
      </QueryClientProvider>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition="Bounce"
      />
      <ToastContainer />
    </>
  );
}

export default App;
