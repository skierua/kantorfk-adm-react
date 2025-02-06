import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import App from "./App";
// import { Main } from "./route_knt/Main";
// import { BrdMain } from "./route_board/BrdMain";

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <BrowserRouter>
//     <Routes>
//       <Route path="/" element={<App />}>
//         {/*<Route index element={<App />} />
//          <Route path="blogs" element={<Blogs />} />
//       <Route path="contact" element={<Contact />} />
//       <Route path="*" element={<NoPage />} /> */}
//       </Route>
//       <Route path="/knt" element={<Main />}></Route>
//       <Route path="/board" element={<BrdMain />}></Route>
//     </Routes>
//   </BrowserRouter>
// );
