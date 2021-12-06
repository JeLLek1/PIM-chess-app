import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AppStack } from "./navigator";

export const Router = () => {
    return (
        <NavigationContainer>
            <AppStack/>
        </NavigationContainer>
    )
}