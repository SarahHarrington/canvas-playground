import React, { useState, useEffect, SyntheticEvent } from 'react';
import { socket } from './socket';
import './App.scss';
import Canvas from './components/Canvas'

function App() {
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
  const [users, setUsers] = useState<string[]>([]);
  const [userCount, setUserCount] = useState<number>(0)
  const [items, setItems] = useState<object[]>([])
  const [color, setColor] = useState<string>('black')
  const [canvasColor, setCanvasColor] = useState<string>('white');

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
    console.log('update the local storage')
    localStorage.setItem('items', JSON.stringify(items));
  }, items)

  useEffect(() => {
    function onConnect(event: any) {
      console.log('connection made', event)
      setIsConnected(true)
    }

    function onDisconnect() {
      setIsConnected(false)
    }

    function onNewUserJoined(id: any) {
      console.log('new user joined: id', id)
      setUsers(previous => [...previous, id])
      // setItems([...items, {socketId: id}])
    }

    function onConnectedUserCount(count: number) {
      console.log('number of users', count)
      setUserCount(count)
    }

    function clientDisconnected(count: number) {
      console.log(count)
      setUserCount(count)
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('newUserJoined', onNewUserJoined)
    socket.on('connectedUserCount', onConnectedUserCount)
    socket.on('clientDisconnected', clientDisconnected)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('newUserJoined', onNewUserJoined)
    }
  }, [])

  function updateUserName(e: any) {
    console.log(e.target.value)
    console.log('socket.id', socket.id)
    socket.emit('userName', {name: e.target.value, socketId: socket.id})
  }

  function changeColor(event: any) {
    console.log('changeColor event', event)
    setColor(event.currentTarget.value)
  }

  function updateCanvasColor(event: any) {
    setCanvasColor(event?.currentTarget.value)
  }

  return (
    <div className="App">
      Stuff will go here
      <h2>Number of connected users: {userCount}</h2>
      <input type="text" onChange={updateUserName} />
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
          <button value={color.value} onClick={changeColor}><span className='material-symbols-outlined' style={{color: `${color.value}`}}>brush</span></button>
        ))}
      </div>
      <div>
        pen size:
        <button className=''></button>
      </div>
      <Canvas 
        height={600}
        width={900}
        color={color}
        canvasColor={canvasColor}
      />
    </div>
  );
}

export default App;
