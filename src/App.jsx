import { AuthProvider } from "./components/auth/useAuth";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Layout from "./components/layout/Layout";
import Login from "./components/views/Login";
import SignUp from "./components/views/SignUp";
import PageNotFound from "./components/views/PageNotFound";
import Dashboard from "./components/views/Dashboard";
import Flashcards from "./components/views/Flashcards";
import CreateFlashcardSet from "./components/views/CreateFlashcardSet";
import ViewFlashcards from "./components/views/ViewFlashcards";
import EditFlashcardSet from "./components/views/EditFlashcardSet";
import Quiz from "./components/views/Quiz";
import Notes from "./components/views/Notes";
import EditNote from "./components/views/EditNote";
import CreateNote from "./components/views/CreateNote";
import Store from "./components/views/Store";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/flashcards"
              element={
                <ProtectedRoute>
                  <Flashcards />
                </ProtectedRoute>
              }
            />
            <Route
              path="/flashcards/newset"
              element={
                <ProtectedRoute>
                  <CreateFlashcardSet />
                </ProtectedRoute>
              }
            />
            <Route
              path="/flashcards/:setID"
              element={
                <ProtectedRoute>
                  <ViewFlashcards />
                </ProtectedRoute>
              }
            />
            <Route
              path="/flashcards/edit/:setID"
              element={
                <ProtectedRoute>
                  <EditFlashcardSet />
                </ProtectedRoute>
              }
            />

            <Route
              path="/flashcards/:setID/quiz"
              element={
                <ProtectedRoute>
                  <Quiz />
                </ProtectedRoute>
              }
            />

            <Route
              path="/notes"
              element={
                <ProtectedRoute>
                  <Notes />
                </ProtectedRoute>
              }
            />

            <Route
              path="/notes/newnote"
              element={
                <ProtectedRoute>
                  <CreateNote />
                </ProtectedRoute>
              }
            />

            <Route
              path="/notes/edit/:noteID"
              element={
                <ProtectedRoute>
                  <EditNote />
                </ProtectedRoute>
              }
            />

            <Route
              path="/store"
              element={
                <ProtectedRoute>
                  <Store />
                </ProtectedRoute>
              }
            />
            <Route path="/*" element={<PageNotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
