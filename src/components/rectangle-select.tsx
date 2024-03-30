import React, { ReactNode } from "react";
import { useState } from "react";

interface SelectionBoxProps {
  children?: ReactNode;
  disabled?: boolean;
  onTouchStart?: () => void;
  onSelect: (
    evt: React.MouseEvent | React.TouchEvent,
    params: SelectionParams
  ) => void;
  style?: React.CSSProperties;
  id?: string;
}

interface SelectionParams {
  origin: number[];
  target: number[];
  limit: number[][];
  topLeft: number[];
  width: number;
  height: number;
}

const RectangleSelection: React.FC<SelectionBoxProps> = (props) => {
  const [hold, setHold] = useState(false);
  const [selectionBox, setSelectionBox] = useState(false);
  const [selectionBoxOrigin, setSelectionBoxOrigin] = useState([0, 0]);
  const [selectionBoxTarget, setSelectionBoxTarget] = useState([0, 0]);
  const [selectionBoxLimit, setSelectionBoxLimit] = useState([
    [0, 0],
    [0, 0],
    [0, 0],
  ]);

  const closeSelectionBox = () => {
    setHold(false);
    setSelectionBox(false);
  };

  const handleTouchDown = (e: React.TouchEvent<HTMLDivElement>) => {
    if (props.disabled) return;
    setSelectionBox(false);

    if ((e.target as HTMLDivElement).id === "react-rectangle-selection") {
      setSelectionBox(false);
    }

    const target = e.touches[0].target as HTMLDivElement;

    setHold(true);
    setSelectionBoxOrigin([
      Math.round(e.touches[0].pageX),
      Math.round(e.touches[0].pageY),
    ]);
    setSelectionBoxTarget([
      Math.round(e.touches[0].pageX),
      Math.round(e.touches[0].pageY),
    ]);
    setSelectionBoxLimit([
      [target.offsetLeft, target.offsetTop],
      [
        target.offsetLeft + target.offsetWidth,
        target.offsetTop + target.offsetHeight,
      ],
      [target.offsetWidth, target.offsetHeight],
    ]);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (props.disabled) return;
    setSelectionBox(false);

    if ((e.target as HTMLDivElement).id === "react-rectangle-selection") {
      setSelectionBox(false);
    }

    const target = e.nativeEvent.target as HTMLDivElement;

    setHold(true);
    setSelectionBoxOrigin([
      Math.round(e.nativeEvent.pageX),
      Math.round(e.nativeEvent.pageY),
    ]);
    setSelectionBoxTarget([
      Math.round(e.nativeEvent.pageX),
      Math.round(e.nativeEvent.pageY),
    ]);
    setSelectionBoxLimit([
      [target.offsetLeft, target.offsetTop],
      [
        target.offsetLeft + target.offsetWidth,
        target.offsetTop + target.offsetHeight,
      ],
      [target.offsetWidth, target.offsetHeight],
    ]);
  };

  const calculateRoomDivParams = () => {
    const elem = document.getElementById(props.id ?? "");
    var viewportOffset = elem?.getBoundingClientRect();

    const leftPercent =
      ((Math.min(selectionBoxOrigin[0], selectionBoxTarget[0]) -
        (viewportOffset?.left ?? 0)) *
        100) /
      selectionBoxLimit[2][0];
    const topPercent =
      ((Math.min(selectionBoxOrigin[1], selectionBoxTarget[1]) -
        (viewportOffset?.top ?? 0)) *
        100) /
      selectionBoxLimit[2][1];

    const topLeft = [leftPercent, topPercent];
    const absWidthPercent =
      (Math.abs(selectionBoxOrigin[0] - selectionBoxTarget[0]) * 100) /
      selectionBoxLimit[2][0];
    const absHeightPercent =
      (Math.abs(selectionBoxOrigin[1] - selectionBoxTarget[1]) * 100) /
      selectionBoxLimit[2][1];
    return {
      topLeft: topLeft,
      width: absWidthPercent - 0.1,
      height: absHeightPercent - 0.1,
    };
  };

  return (
    <div
      id={props.id}
      style={{ height: "inherit", width: "inherit", touchAction: "none" }}
      onTouchStart={(e) => handleTouchDown(e)}
      onTouchEnd={() => {
        closeSelectionBox();
      }}
      onMouseLeave={() => {
        closeSelectionBox();
      }}
      onMouseDown={(e) => handleMouseDown(e)}
      onMouseUp={() => closeSelectionBox()}
      // for desktop screens
      onMouseMove={(evt) => {
        if (hold && !selectionBox) {
          if (props.onTouchStart) props.onTouchStart();
          setSelectionBox(true);
        }
        if (selectionBox) {
          setSelectionBoxTarget([evt.nativeEvent.pageX, evt.nativeEvent.pageY]);

          const { topLeft, width, height } = calculateRoomDivParams();

          props.onSelect(evt, {
            origin: selectionBoxOrigin,
            target: selectionBoxTarget,
            limit: selectionBoxLimit,
            topLeft: topLeft,
            width: width,
            height: height,
          });
        }
      }}
      // for touchscreen
      onTouchMove={(evt) => {
        if (hold && !selectionBox) {
          if (props.onTouchStart) props.onTouchStart();
          setSelectionBox(true);
        }
        if (selectionBox) {
          const elem = document.getElementById(props.id ?? "");
          var viewportOffset = elem?.getBoundingClientRect();
          console.log(viewportOffset);
          const touchLeave =
            evt.touches[0].pageX < (viewportOffset?.left ?? 0) ||
            evt.touches[0].pageX > (viewportOffset?.right ?? 0) ||
            evt.touches[0].pageY < (viewportOffset?.top ?? 0) ||
            evt.touches[0].pageY > (viewportOffset?.bottom ?? 0);

          if (touchLeave) {
            closeSelectionBox();
          }
          setSelectionBoxTarget([
            Math.round(evt.touches[0].pageX),
            Math.round(evt.touches[0].pageY),
          ]);

          const { topLeft, width, height } = calculateRoomDivParams();

          props.onSelect(evt, {
            origin: selectionBoxOrigin,
            target: selectionBoxTarget,
            limit: selectionBoxLimit,
            topLeft: topLeft,
            width: width,
            height: height,
          });
        }
      }}
    >
      {props.children}
    </div>
  );
};

export default RectangleSelection;
