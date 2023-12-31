import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const BlockContext = createContext({});

export const BlockContexProvider = ({ children }) => {
  const [codeBlocks, setCodeBlocks] = useState([]);  

  useEffect(() => {
    const path = `https://moveo-api-mayabyle.onrender.com`   // to run locally: `http://localhost:5000/`
    const fetchData = async () => {
      await axios.get(path)
        .then((res) => setCodeBlocks(res.data))
        .catch((err) => console.log(err))
    };
    fetchData()
  }, [])

  return (
    <BlockContext.Provider value={ codeBlocks }>
      {children}
    </BlockContext.Provider>
  );
};