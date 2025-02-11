import * as React from 'react';
import {Text,TouchableOpacity,StyleSheet} from 'react-native'
import {Entypo} from '@expo/vector-icons'
export default function Buttons({title,onPress,icon,color}){
    return (
        <TouchableOpacity onPress={onPress} style={styles.button}>
            <Entypo name={icon} color={color ?color:'#f1f1f1'}size={48}/>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    )
}
const styles=StyleSheet.create({
    button:{
        height:60,
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row'
    },
    text:{
        fontWeight:'bold',
        fontSize:16,
        color:'#f1f1f1',
        marginLeft:10
    }
})