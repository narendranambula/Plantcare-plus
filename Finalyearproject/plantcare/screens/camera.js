
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';



const CameraScreen = () => {

  const navigation = useNavigation();
  const [hasPermission, setPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const cameraRef = useRef(null);

  useEffect(() => {
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        const mediaStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
        setPermission(status === 'granted' && mediaStatus.status === 'granted');
      })();
  }, []);

  const pickImage = async () => {
      try {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 1,
        });
        if (!result.cancelled && result.assets[0].uri) {
          setImage(result.assets[0].uri);
        }
      } catch (error) {
        console.error('Error picking image:', error);
      }
  };


  const takePicture = async () => {
    if (hasPermission && cameraRef && cameraRef.current) {
      try {
        const { uri } = await cameraRef.current.takePictureAsync();
        setImage(uri);
      } catch (error) {
        retakeImage(); 
      }
    }
  };

  const saveImage = async () => {
    if (image) {
      try {
        await MediaLibrary.saveToLibraryAsync(image);
        alert('Picture saved!');
        navigation.navigate('Results', { capturedImage: image, resetCameraState: true });
      } catch (error) {
        console.error('Error saving image:', error);
      }
    }
  };

  const retakeImage = () => {
    setImage(null);
  };

  const predictImage = () => {
    // Implement your predict functionality here
    navigation.navigate('Results', { capturedImage: image, resetCameraState: true });
    console.log('Predict function called');
  };

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      {!image ? (
        <Camera style={styles.camera} type={type} flashMode={flash} ref={cameraRef}>
          <View style={styles.cameraControls}>
            <TouchableOpacity onPress={pickImage} style={styles.controlButton}>
              <Ionicons name="image-outline" size={30} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setFlash(
              flash === Camera.Constants.FlashMode.off
                ? Camera.Constants.FlashMode.on
                : Camera.Constants.FlashMode.off
            )} style={styles.controlButton}>
              <Ionicons name={flash === Camera.Constants.FlashMode.off ? "flash-off" : "flash"} size={30} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={takePicture} style={styles.controlButton}>
              <Ionicons name="camera" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
        </Camera>
      ) : (
        <View style={styles.previewContainer}>
          <Image source={{ uri: image }} style={styles.previewImage} />
          <View style={styles.bottomControls}>
            <TouchableOpacity style={styles.bottomButton} onPress={retakeImage}>
              <Ionicons name="camera-reverse" size={24} color="#fff" />
              <Text style={styles.bottomButtonText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottomButton} onPress={predictImage}>
              <Ionicons name="analytics-outline" size={24} color="#fff" />
              <Text style={styles.bottomButtonText}>Predict</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  controlButton: {
    marginHorizontal: 20,
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
    marginBottom: 20,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  bottomButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 16,
  },
});

export default CameraScreen;
