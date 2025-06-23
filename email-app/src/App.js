import React from "react";
import EmailForm from "./components/EmailForm";
import { SnackbarProvider } from "./components/SnackbarProvider";
function App() {
  return (
    <SnackbarProvider>
      <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
        <h2>Email Trigger App</h2>
        <EmailForm />
      </div>
    </SnackbarProvider>
  );
}

export default App;