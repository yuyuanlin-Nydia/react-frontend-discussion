import { Routes, Route } from "react-router-dom";

import "./App.css";
import IndexPage from "./page/IndexPage";
import QuestionConPage from "./page/QuestionConPage";

function App() {
  return (
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route
              path="question-details/:questionId"
              element={<QuestionConPage />}
            />
          </Routes>
        </header>
      </div>
  );
}

export default App;
