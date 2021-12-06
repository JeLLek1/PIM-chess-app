import React from "react";
import {createStackNavigator} from '@react-navigation/stack';

import RoomScreen from "../screens/room_screen";
import BoardScreen from "../screens/board_screen";

const TmpStack = createStackNavigator()

export const AppStack = () => {
    return (
        <TmpStack.Navigator>
            <TmpStack.Screen name="RoomScreen" 
                component={RoomScreen}
                options={{
                    headerShown: false
                }}/>
            <TmpStack.Screen name="BoardScreen"
                component={BoardScreen}
                options={{
                    headerShown: false
                }}
            />
        </TmpStack.Navigator>
    )
}

