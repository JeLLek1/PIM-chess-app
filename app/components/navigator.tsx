import React from "react";
import {createStackNavigator} from 'react-navigation-stack';
import { createAppContainer } from "react-navigation";

import HomeScreen from "../screens/home_screen";
import RoomScreen from "../screens/room_screen";
import BoardScreenFinal from "../screens/board_screen";

const TmpStack = createStackNavigator({
    HomeScreen: HomeScreen,
    RoomScreen: RoomScreen,
    BoardScreenFinal: BoardScreenFinal
})

export default createAppContainer(TmpStack)

