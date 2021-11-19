import * as React from "react"
import Svg, { G, Path } from "react-native-svg"

function RookWhite(props: any) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={45} height={45} {...props}>
      <G
        fill="#fff"
        fillRule="evenodd"
        stroke="#000"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path
          d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5"
          strokeLinecap="butt"
        />
        <Path d="M34 14l-3 3H14l-3-3" />
        <Path
          d="M31 17v12.5H14V17"
          strokeLinecap="butt"
          strokeLinejoin="miter"
        />
        <Path d="M31 29.5l1.5 2.5h-20l1.5-2.5" />
        <Path d="M11 14h23" fill="none" strokeLinejoin="miter" />
      </G>
    </Svg>
  )
}

export default RookWhite