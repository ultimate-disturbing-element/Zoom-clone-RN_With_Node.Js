import React from 'react'
import { StyleSheet, Text, View,TextInput } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

const StartMeeting = ({name,setName,roomId,setRoomId,joinRoom}) => {
    return (
        <View>
           <View style={styles.startMeetingContainer}>
               <View  style={styles.info}>
                   <TextInput
                   style={styles.textInput}
                   value = {name}
                   placeholder="Enter name"
                   placeholderTextColor="#767476"
                   onChangeText={text => setName(text)}
                   />
               </View>
               <View style={styles.info}>
               <TextInput
                   style={styles.textInput}
                   value = {roomId}
                   placeholder="Enter Room Id"
                   placeholderTextColor="#767476"
                   onChangeText={text => setRoomId(text)}
                   />
               </View>
               <View style={{alignItems:'center'}}>
                   <TouchableOpacity
                   style={styles.startMeetingButton}
                   onPress={()=>{joinRoom()}}
                   >
                       <Text style={{color:"white",fontWeight:"bold"}}>Start Meeting</Text>
                   </TouchableOpacity>
               </View>
           </View>
        </View>
    )
}

export default StartMeeting

const styles = StyleSheet.create({
    info:{
        width:'100%',
        backgroundColor:"#373538",
        height:50,
        borderTopWidth:1,
        borderBottomWidth:1,
        borderColor:"#484648",
        padding: 12,
        justifyContent:'center'
    },
    textInput:{
        color:"white",
        fontSize:18
    },
    startMeetingButton:{
        width:350,
        marginTop:20,
        justifyContent:'center',
        alignItems:"center",
        backgroundColor:"#0470DC",
        height:50,
        borderRadius:15,

    }
})
