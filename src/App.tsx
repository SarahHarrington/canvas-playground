import React, { useState, useEffect, SyntheticEvent } from 'react';
import { socket } from './socket';
import './App.scss';
import Canvas from './components/Canvas'

export interface IncomingDraw {
  color: string;
  lineWidth: number;
  mouseStart: {
      x: number;
      y: number;
  };
  mouseEnd: {
      x: number;
      y: number;
  }
}

interface Item {
  socketId: string;
  userName?: string;
}

function App() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [users, setUsers] = useState<string[]>([]);
  const [userCount, setUserCount] = useState<number>(0)
  const [items, setItems] = useState<Item[]>([])
  const [color, setColor] = useState<string>('black')
  const [canvasColor, setCanvasColor] = useState<string>('white');
  const [incomingDraw, setIncomingDraw] = useState<IncomingDraw | null>(null)
  const [showCanvas, setShowCanvas] = useState<boolean>(false)
  const [userName, setUserName] = useState<string>('')

  const colors = [
    {
      name: 'Melon',
      value: '#FFADAD'
    },
    {
      name: 'Sunset',
      value: '#FFD6A5'
    },
    {
      name: 'Cream',
      value: '#FDFFB6'
    },
    {
      name: 'Green Tea',
      value: '#CAFFBF'
    },
    {
      name: 'Electric Blue',
      value: '#9BF6FF'
    },
    {
      name: 'Jordy Blue',
      value: '#A0C4FF'
    },
    {
      name: 'Periwinkle',
      value: '#BDB2FF'
    },
    {
      name: 'Mauve',
      value: '#FFC6FF'
    },
    {
      name: 'Baby Powder',
      value: '#FFFFFC'
    },
  ]

  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items));
  }, [items])

  useEffect(() => {
    function onConnect(event: any) {
      console.log('connection made', event)
      setIsConnected(true)
      setItems([])
    }

    function onDisconnect() {
      setIsConnected(false)
    }

    function onNewUserJoined(id: any) {
      console.log('new user joined: id', id)
      setUsers(previous => [...previous, id])
      setItems([...items, {socketId: id}])
    }

    function onConnectedUserCount(count: number) {
      console.log('number of users', count)
      setUserCount(count)
    }

    function clientDisconnected(count: number) {
      console.log(count)
      setUserCount(count)
    }

    function userDrawing(drawing: IncomingDraw) {
      console.log('userDrawing')
      setIncomingDraw(drawing)
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('newUserJoined', onNewUserJoined)
    socket.on('connectedUserCount', onConnectedUserCount)
    socket.on('clientDisconnected', clientDisconnected)
    socket.on('userDrawing', userDrawing)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('newUserJoined', onNewUserJoined)
    }
  }, [])

  function updateUserName(e: any) {
    setUserName(e.currentTarget.value)
  }

  function saveUserName() {
    console.log('saveUserName clicked')
    console.log('items', items)
    setShowCanvas(true)
    socket.emit('userName', {name: userName, socketId: items[0].socketId})
  }

  function changeColor(event: any) {
    console.log('changeColor event', event)
    setColor(event.currentTarget.value)
  }

  function updateCanvasColor(event: any) {
    setCanvasColor(event?.currentTarget.value)
  }

  function updateDraw(drawElementForServer: object) {
    socket.emit('userIsDrawing', drawElementForServer)
  }

  return (
    <div className="App">
      <h1>Canvas Playground</h1>
      {
        showCanvas ?
        <>
          <h2>Number of connected users: {userCount}</h2>
          <div>
            {users.map(user => {
              return (
                <p key={user}>{user}</p>
              )
            })}
          </div>
          <div>background color:
            <button value='black' onClick={updateCanvasColor}>black</button>
            <button value='white' onClick={updateCanvasColor}>white</button>
          </div>
          <div>
            Select a color:
            {colors.map((color) => (
              <button className='paint-button' value={color.value} onClick={changeColor}><span className='material-symbols-outlined' style={{color: `${color.value}`}}>brush</span></button>
            ))}
          </div>
          <Canvas 
            height={600}
            width={900}
            color={color}
            canvasColor={canvasColor}
            updateDraw={updateDraw}
            incomingDraw={incomingDraw}
          />
        </> : 
        <>
          <label htmlFor="userName">Enter your name to start painting!</label>
          <input id='userName' type="text" onChange={updateUserName}/>
          <button className='start-button' onClick={saveUserName}>Start</button>
        </>
      }
    </div>
  );
}

export default App;
