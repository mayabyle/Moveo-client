import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { BlockContext } from '../context/blockContext.js'; 
import CodeBlock from '../components/codeBlockItem.js'

function CodeBlockPage() {
  const { id } = useParams();
  const codeBlockId = Number(id);
  const codeBlocks = useContext(BlockContext);
  const block = codeBlocks.find((block) => block.id === codeBlockId)

  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("");
  const [code, setCode] = useState("");
  const [answer, setAnswer] = useState("");
  const [isMentor, setIsMentor] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    // const socket = new WebSocket('ws://localhost:5000');
    const socket = new WebSocket('wss://moveo-api-mayabyle.onrender.com');

    socket.addEventListener('open', () => {  //The 'open' event is fired when the WebSocket connection is successfully established
      console.log('Connected to WebSocket');
      socket.send(JSON.stringify({ type: 'join', codeBlockId }));
      
      if(block) {
        setTitle(block.title)
        setGoal(block.goal)
        setCode(block.code);
        setAnswer(block.answer.replace(/\s/g, ''))
        console.log("desired answer:", block.answer.replace(/\s/g, ''))
      }
    });

    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);    
      if (data.type === 'readOnly') {
        console.log('Received readOnly signal');
        setIsMentor(true)
      } 
      else if (data.type === 'code') {
        setCode(data.code)
      }
    });

    socket.addEventListener('close', () => {
      console.log('Disconnected from WebSocket');
    });

    setWs(socket);

    return () => {
      socket.send(JSON.stringify({ type: 'closePage', isMentor: isMentor, codeBlockId: codeBlockId })); 
      socket.close();
    };
  }, [codeBlockId, block, isMentor]);


  const handleCodeChange = (event) => {
    const newCode = event.target.value; 
    ws.send(JSON.stringify({ type: 'codeChange', newCode }));
  };

  const handleSubmit = () => {
    const cleanCode = code.replace(/\s/g, '')
    if(cleanCode === answer) {
      setIsFinished(true)
    } else {
      alert("Not done yet...\ndon't worry you're getting close :)")
    }
  }

  const handleSave = () => {
    ws.send(JSON.stringify({ type: 'save', code: code, id: codeBlockId }));
    alert("Saved");
    // window.location.reload();
  }
  
  if (!codeBlocks.length) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <CodeBlock 
      title={title} 
      goal={goal} 
      code={code} 
      isMentor={isMentor}
      handleCodeChange={handleCodeChange} 
      handleSubmit={handleSubmit}
      handleSave={handleSave}
      isFinished={isFinished}
    />
    </>
  );
}

export default CodeBlockPage;
