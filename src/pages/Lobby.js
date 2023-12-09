import React, { useContext } from 'react';
import { BlockContext } from '../context/blockContext.js'; 
import { Link } from 'react-router-dom';


function Lobby() {
    const codeBlocks = useContext(BlockContext);

    return (
        <div className='lobby'>
            <p style={{fontSize:'42px'}}>Choose code block</p>
            <ul className="blocksList">
                {codeBlocks.map((block, index) => (
                    <li key={index}> 
                        <Link className="blockLink" to={`/code/${index+1}`}>{block.title}</Link>
                    </li> 
                ))}
            </ul>
            <div className='footer'>Have a nice learning process, Maya ♥☻</div>
        </div>
    );
};

export default Lobby;
