import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  SafeAreaView,
  Modal,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import StartMeeting from "../components/StartMeeting";
import { io } from "socket.io-client";
import { Camera } from "expo-camera";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Chat from "../components/Chat";

const menuIcons = [
  {
    id: 1,
    name: "microphone",
    title: "Mute",
    customColor: "#efefef",
  },
  {
    id: 2,
    name: "video-camera",
    title: "Stop Video",
  },
  {
    id: 3,
    name: "upload",
    title: "Share Content",
  },
  {
    id: 4,
    name: "group",
    title: "Participants",
  },
];

let socket;

const MeetingRoom = () => {
  const [name, setName] = useState();
  const [roomId, setRoomId] = useState();

  const [activeUsers, setActiveUsers] = useState([]);

  const [startCamera, setStartCamera] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const __startCamera = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    if (status == "granted") {
      setStartCamera(true);
    } else {
      Alert.alert("Acces Denied");
    }
  };
  const joinRoom = () => {
    __startCamera();
    socket.emit("join-room", { roomId: roomId, userName: name });
  };

  useEffect(() => {
    const API_URL = "http://localhost:3000";
    socket = io(`${API_URL}`);
    socket.on("connection", () => console.log("connected"));
    socket.on("all-users", (users) => {
      //   users = users.filter(user => (user.userName != name))
      setActiveUsers(users);
    });
  }, []);

  return (
    <View style={styles.container}>
      {startCamera ? (
        <SafeAreaView style={{ flex: 1 }}>
          <Modal
            animationType="slide"
            transparent={false}
            presentationStyle={"fullScreen"}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <Chat
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
            />
          </Modal>

          {/* Active Users */}
          <View style={styles.activeUsersContainer}>
            <View style={styles.cameraContainer}>
              <Camera
                type={"front"}
                style={{
                  width: activeUsers.length <= 1 ? "100%" : 180,
                  height: activeUsers.length <= 1 ? 600 : 180,
                }}
              ></Camera>
              {activeUsers
                .filter((user) => user.userName != name)
                .map((user, index) => (
                  <View key={index} style={styles.activeUserContainer}>
                    <Text style={{ color: "white" }}>{user.userName}</Text>
                  </View>
                ))}
            </View>
          </View>

          <View style={styles.menu}>
            {menuIcons.map((icon, index) => (
              <TouchableOpacity key={index} style={styles.title}>
                <FontAwesome name={icon.name} size={24} color={"#efefef"} />
                <Text style={styles.textTitle}>{icon.title}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={styles.title}
            >
              <FontAwesome name={"comment"} size={24} color={"#efefef"} />
              <Text style={styles.textTitle}>Chat</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      ) : (
        <StartMeeting
          name={name}
          setName={setName}
          roomId={roomId}
          setRoomId={setRoomId}
          joinRoom={joinRoom}
        />
      )}
    </View>
  );
};

export default MeetingRoom;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1c1c1c",
    flex: 1,
  },
  title: {
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginTop: 15,
  },
  textTitle: {
    color: "white",
    marginTop: 10,
  },
  menu: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  cameraContainer: {
    backgroundColor: "black",
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  activeUserContainer: {
    borderColor: "gray",
    borderWidth: 1,
    width: 180,
    height: 180,
    justifyContent: "center",
    alignItems: "center",
  },
  activeUsersContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
