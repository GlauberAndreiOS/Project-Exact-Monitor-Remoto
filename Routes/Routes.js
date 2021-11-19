import React from 'react'
import Monitor from '../Screen/Monitor';
import Graficos from '../Screen/Graficos';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function Routes({navigator}){
    return(
        <Tab.Navigator initialRouteName="Monitor"
            screenOptions={({ route }) => ({
                headerShown:false,
                tabBarOptions: () => {{
                    showLabel=true,
                    labelStyle={
                        fontSize: 12,
                        margin: 0,
                        padding: 0
                    }
                }},
                tabBarIcon: ({ focused }) => {
                    let iconName, iconColor;

                    if (route.name === 'Monitor') {
                        iconName = focused ? 'monitor' : 'monitor';
                        iconColor = focused ? '#00AFEF' : 'black';
                    }else if (route.name === 'Graficos') {
                        iconName = focused ? 'bar-chart' : 'bar-chart';
                        iconColor = focused ? '#00AFEF' : 'black';
                    }
                    return <Feather name={iconName} size={24} color={iconColor} />;
                    }
                }
            )}
        >
            <Tab.Screen name="Monitor" component={Monitor}/>
            <Tab.Screen name="Graficos" component={Graficos}/>
        </Tab.Navigator>
    );
}