import React, { MouseEventHandler, useState } from 'react'
import tw, { css, styled } from 'twin.macro'

const ResizableBox = styled('div')`
  position: absolute;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 7;
  user-select: none;
`
const Overlay = styled('div')`
  z-index: 8;
  cursor: crosshair;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

export type OnFinish = (data?: {
  x: number
  y: number
  width: number
  height: number
  clientWidth: number
  clientHeight: number
  clientPixelRatio: number
}) => void

const OCRTool: React.FC<{
  onFinish?: OnFinish
}> = (props) => {
  const [axisX, setAxisX] = useState(0)
  const [axisY, setAxisY] = useState(0)
  const [axisFixedX, setAxisFixedX] = useState(0)
  const [axisFixedY, setAxisFixedY] = useState(0)
  const [w, setW] = useState(0)
  const [h, setH] = useState(0)
  const [overlayActive, setOverlayActive] = useState(false)

  const onOverlayMouseDown: MouseEventHandler = (e) => {
    setAxisX(e.clientX)
    setAxisY(e.clientY)
    setAxisFixedX(e.clientX)
    setAxisFixedY(e.clientY)
    setW(0)
    setH(0)
    setOverlayActive(true)
  }

  const onOverlayMouseMove: MouseEventHandler = (e) => {
    if (overlayActive) {
      if (e.clientX >= axisFixedX) {
        setW(e.clientX - axisFixedX)
      } else {
        setW(axisFixedX - e.clientX)
        setAxisX(e.clientX)
      }

      if (e.clientY >= axisFixedY) {
        setH(e.clientY - axisFixedY)
      } else {
        setH(axisFixedY - e.clientY)
        setAxisY(e.clientY)
      }
    }
  }

  const onOverlayMouseUp: MouseEventHandler = () => {
    if (overlayActive) {
      if (props.onFinish) {
        const vw = window.top.innerWidth || window.innerWidth || 0
        const vh = window.top.innerHeight || window.innerHeight || 0

        if (w < 5 || h < 5) {
          props.onFinish()
        } else {
          props.onFinish({
            x: axisX,
            y: axisY,
            width: w,
            height: h,
            clientWidth: vw,
            clientHeight: vh,
            clientPixelRatio: window.devicePixelRatio,
          })
        }
      }
      setOverlayActive(false)
    }
  }

  return (
    <div
      css={[
        css`
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 5;
        `,
      ]}>
      <ResizableBox
        style={{
          height: h,
          width: w,
          left: axisX,
          top: axisY,
        }}
      />

      <Overlay
        onMouseDown={onOverlayMouseDown}
        onMouseMove={onOverlayMouseMove}
        onMouseUp={onOverlayMouseUp}
      />
    </div>
  )
}

export default OCRTool
