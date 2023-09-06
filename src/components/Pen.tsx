import { MouseEventHandler, useEffect, useState } from 'react';
import './Pen.scss';

interface PenProps {
  color: {
    value: string;
    name: string;
  },
  activeColor: string;
  changeColor: MouseEventHandler;
}

export default function Pen({ color, activeColor, changeColor }: PenProps) {
  return (
    <button className={`paint-button ${activeColor === color.value ? 'selected' : ''}`} value={color.value} onClick={changeColor}>
      <span className='material-symbols-outlined' style={{color: `${color.value}`}}>brush</span>
    </button>
  )
}