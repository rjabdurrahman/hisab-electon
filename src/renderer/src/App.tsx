import { RouterProvider } from "react-router-dom";
import router from "./Router";
import { useEffect } from "react";

function App(): React.JSX.Element {
  useEffect(() => {
    // Standard theme initialization matching pos-v2 logic
    const savedTheme = localStorage.getItem('app-theme') || 'light';
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  return (
    <RouterProvider router={router} />
  );
}

export default App;