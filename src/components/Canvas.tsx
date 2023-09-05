import './Canvas.scss';
import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import { IncomingDraw } from '../App';

interface CanvasProps {
  height: number;
  width: number;
  activeColor: string;
  canvasColor: string;
  updateDraw: Function;
  incomingDraw: IncomingDraw | null;
}

interface Coordinates {
  x: number,
  y: number
}

export default function Canvas({height, width, activeColor, canvasColor, updateDraw, incomingDraw}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPainting, setIsPainting] = useState(false);
  const [mousePosition, setMousePosition] = useState<Coordinates | undefined>(undefined);
  const [canvasHeight, setCanvasHeight] = useState(height)
  const [canvasWidth, setCanvasWidth] = useState(width)

  const startPaint = useCallback((event: MouseEvent) => {
    if (!canvasRef.current) return
    const coordinates = getCoordinates(event);
    if (coordinates) {
        setMousePosition(coordinates);
        setIsPainting(true);
    }
  }, []);

  useEffect(() => {
    if (!incomingDraw) return
    drawServerLine(incomingDraw)
  }, [incomingDraw])

  const paint = useCallback(
    (event: MouseEvent) => {
      if (!canvasRef.current) return;
      if (isPainting) {
        const newMousePosition = getCoordinates(event);
        if (mousePosition && newMousePosition) {
            drawLine(mousePosition, newMousePosition);
            setMousePosition(newMousePosition);
        }
      }
    },
    [isPainting, mousePosition]
);

//for getting rectangle, turn on a flag, record mouse down and mouse up to get
// dimensions and placement?

  const exitPaint = useCallback(() => {
    if (!canvasRef.current) return
    setIsPainting(false);
    setMousePosition(undefined);
  }, []);

  const getCoordinates = (event: MouseEvent): Coordinates | undefined => {
    if (!canvasRef.current) {
        return;
    }

    const canvas: HTMLCanvasElement = canvasRef.current;
    return { x: event.clientX - canvas.offsetLeft, y: event.clientY - canvas.offsetTop };
  };

  const drawLine = (originalMousePosition: Coordinates, newMousePosition: Coordinates, externalDraw: boolean = false) => {
    if (!canvasRef.current) {
        return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    const context = canvas.getContext('2d');
    if (context) {
        context.strokeStyle = `${activeColor}`;
        context.lineJoin = 'round';
        context.lineWidth = 5;
        context.beginPath();
        context.moveTo(originalMousePosition.x, originalMousePosition.y);
        context.lineTo(newMousePosition.x, newMousePosition.y);
        context.closePath();
        context.stroke();
    }

    if (externalDraw) return
    const drawElementForServer = {
      color: activeColor,
      lineWidth: 5,
      mouseStart: {x: originalMousePosition.x, y: originalMousePosition.y},
      mouseEnd: {x: newMousePosition.x, y: newMousePosition.y},
    }
    updateDraw(drawElementForServer)
  };

  const drawServerLine = (incomingDraw: IncomingDraw) => {
    if (!canvasRef.current) {
        return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    const context = canvas.getContext('2d');
    if (context) {
        context.strokeStyle = `${incomingDraw.color}`;
        context.lineJoin = 'round';
        context.lineWidth = 5;
        context.beginPath();
        context.moveTo(incomingDraw.mouseStart.x, incomingDraw.mouseStart.y);
        context.lineTo(incomingDraw.mouseEnd.x, incomingDraw.mouseEnd.y);
        context.closePath();
        context.stroke();
    }
  };


  return (
    <canvas
      style={{backgroundColor: canvasColor}}
      ref={canvasRef}
      className='canvas'
      height={canvasHeight}
      width={canvasWidth}
      onMouseDown={startPaint}
      onMouseMove={paint}
      onMouseUp={exitPaint}
      onMouseLeave={exitPaint}
    ></canvas>
  )
}
