import { createStackNavigator } from '@react-navigation/stack';
import CameraScreen from '../screens/camera';
import ResultScreen from '../screens/results';
const Stack = createStackNavigator();
export const HomeStack=()=>{
    return(
        <Stack.Navigator>
          <Stack.Screen name="Home" component={CameraScreen}/>
          <Stack.Screen name="Results" component={ResultScreen}/>
        </Stack.Navigator>
    );
}