import * as React from "react"
import Svg, { G, Path } from "react-native-svg"

function RookBlack(props: any) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={45} height={45} {...props}>
      <G
        opacity={1}
        fill="#000"
        fillOpacity={1}
        fillRule="evenodd"
        stroke="#000"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={4}
        strokeDasharray="none"
        strokeOpacity={1}
      >
        <Path
          d="M9 39h27v-3H9v3zM12.5 32l1.5-2.5h17l1.5 2.5h-20zM12 36v-4h21v4H12z"
          strokeLinecap="butt"
        />
        <Path
          d="M14 29.5v-13h17v13H14z"
          strokeLinecap="butt"
          strokeLinejoin="miter"
        />
        <Path
          d="M14 16.5L11 14h23l-3 2.5H14zM11 14V9h4v2h5V9h5v2h5V9h4v5H11z"
          strokeLinecap="butt"
        />
        <Path
          d="M12 35.5h21M13 31.5h19M14 29.5h17M14 16.5h17M11 14h23"
          fill="none"
          stroke="#fff"
          strokeWidth={1}
          strokeLinejoin="miter"
        />
      </G>
    </Svg>
  )
}

export default RookBlack
