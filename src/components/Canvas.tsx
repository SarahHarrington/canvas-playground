import './Canvas.css';
import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react';

interface CanvasProps {
  height: number;
  width: number;
  color: string;
  canvasColor: string;
}

interface Coordinates {
  x: number,
  y: number
}

export default function Canvas({height, width, color, canvasColor}: CanvasProps) {
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

  const drawLine = (originalMousePosition: Coordinates, newMousePosition: Coordinates) => {
    if (!canvasRef.current) {
        return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    const context = canvas.getContext('2d');
    if (context) {
        context.strokeStyle = `${color}`;
        context.lineJoin = 'round';
        context.lineWidth = 5;
        context.beginPath();
        context.moveTo(originalMousePosition.x, originalMousePosition.y);
        context.lineTo(newMousePosition.x, newMousePosition.y);
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
