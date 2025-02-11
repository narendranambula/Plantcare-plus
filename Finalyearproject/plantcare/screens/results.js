
import axios from "axios";
import { Audio } from 'expo-av';
import { AntDesign } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';

const ResultScreen = () => {
  const route = useRoute();
  const { capturedImage } = route.params;
  const navigation = useNavigation();
  const [base64Image, setBase64Image] = useState(null);
  const [labels, setLabels] = useState(['', '', '']);
  const [probabilities, setProbabilities] = useState(['', '', '']);
  const [activeSoundIndex, setActiveSoundIndex] = useState(null);
  const [soundObjects, setSoundObjects] = useState([]); // Array to store sound objects for each file

  useEffect(() => {
    const convertToBase64 = async () => {
      try {
        const response = await FileSystem.readAsStringAsync(capturedImage, {
          encoding: FileSystem.EncodingType.Base64,
        });
        setBase64Image(response);
      } catch (error) {
        console.error('Error converting to base64:', error);
      }
    };
    convertToBase64();
  }, [capturedImage]);

  useEffect(() => {
    if (base64Image) {
      axios.post('http://192.168.120.4:8000/api/diseasename/', { image: base64Image })
        .then((response) => {
          const { labels, probabilities } = response.data;
          setLabels(labels);
          setProbabilities(probabilities);
          console.log('Labels:', labels);
          console.log('Probbilities:', probabilities);
        })
        .catch((error) => {
          console.error('Errors.', error);
        });
    }
  }, [base64Image]);

  const handleGoBack = () => { 
    navigation.navigate('Home', { resetCameraState: true });
  };
  
  const handleVoiceOver = async (diseaseName, index) => {
    try {
      if (activeSoundIndex === index) {
        // Stop if it's the same sound that is playing
        if (soundObjects[index]) {
          await soundObjects[index].stopAsync();
          setActiveSoundIndex(null);
        }
      } else {
        // Stop the currently playing sound if any
        if (activeSoundIndex !== null && soundObjects[activeSoundIndex]) {
          await soundObjects[activeSoundIndex].stopAsync();
        }
  
        // Create a new sound object for the clicked sound if it doesn't exist
        if (!soundObjects[index]) {
          soundObjects[index] = new Audio.Sound();
          const audioFilePath = `../audios/`+diseaseName+`.mp3`;
          console.log('Audio File Path:', audioFilePath); 
          let source = require('../audios/healthy.mp3');
          // Concatenate the string to form the path to the audio file
          switch (diseaseName) {
            case 'CommonRust':
                 source = require('../audios/CommonRust.mp3');
              break;
            case 'BlackSpot':
              source = require('../audios/BlackSpot.mp3');
              break;
            case 'BacterialSpot':
               source = require('../audios/BacterialSpot.mp3');
              break;
            case 'Powdery':
               source = require('../audios/Powdery.mp3');
              break;
            case 'Early_blight':
               source = require('../audios/Early_blight.mp3');
              break;
            case 'Late_blight':
               source = require('../audios/Late_blight.mp3');
              break;
            case 'Yellow_leaf_curl_virus':
               source = require('../audios/Yellow_leaf_curl_virus.mp3');
              break;
            case 'bacterial_blight':
              source = require('../audios/bacterial_blight.mp3');
              break;
            default:
               source = require('../audios/healthy.mp3');
          }
          await soundObjects[index].loadAsync(source);
        }
  
        // Play the clicked sound
        await soundObjects[index].playAsync();
        setActiveSoundIndex(index);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };
  
  const renderCard = (diseaseName, percentage, recommendations, index) => (
    <View style={styles.card} key={index}>
      <Text style={styles.diseaseName}>{diseaseName}</Text>
      <Text style={styles.percentage}>{`Chance: ${percentage}%`}</Text>
      <View style={styles.recommendationsContainer}>
        {recommendations.map((recommendation, idx) => (
          <View key={idx}>
            <Text style={styles.recommendationTitle}>{`ఫంగీసైడ్${idx + 1}.`}</Text>
            <Text style={styles.recommendation}>{recommendation[0]}</Text>
            <Text style={styles.recommendationTitle}>ప్రక్రియ:</Text>
            <Text style={styles.recommendation}>{recommendation[1]}</Text>
          </View>
        ))}
      </View>

      <View style={styles.audioContainer}>
        <Text>Play Audio</Text>
        <TouchableOpacity onPress={() => handleVoiceOver(diseaseName, index)}>
          <View style={styles.button}>
            <AntDesign name={activeSoundIndex === index ? "pause" : "play"} size={24} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderRecommendations = () => {
    return labels.map((label, index) => {
      const diseaseName = label;
      const percentage = (probabilities[index] * 100).toFixed(2);
      let recommendations = [[]];
      switch (label) {
        case 'CommonRust':
          recommendations = [["Tilt fungicide", "ప్రతి ఎకరాకు 200 లీటర్ల నీటిలో, 200 గ్రాములు లేక మిలీలీటరులు మందును, 7 రోజుల మధ్య పిచికారీ చేయండి"],["Folicur fungicide","ప్రతి ఎకరాకు 200 లీటర్ల నీటిలో 250 గ్రాములు లేక మిలీలీటరులు మందును 7 రోజుల మధ్య పిచికారీ చేయండి."],["Score fungicide","ప్రతి ఎకరాకు 200 లీటర్ల నీటిలో 200 గ్రాములు లేక మిలీలీటరులు మందును 7 రోజుల మధ్య పిచికారీ చేయండి."]];
          break;
        case 'BlackSpot':
          recommendations = [["Keefun (tolfenlyarad15%EC)", "ప్రతి ఎకరాకు 200 లీటర్ల నీటిలో 400 గ్రాములు లేక మిలీలీటరులు మందును   10 రోజుల మధ్య పిచికారీ చేయండి"], [" Police (GHARDA) (fipronil 40% + Imaidacloprid 40%WG)", "ప్రతి ఎకరాకు 200 లీటర్ల నీటిలో 170 గ్రాములు లేక మిలీలీటరులు  మందును  10 రోజుల మధ్య పిచికారీ చేయండి"], ["ROGOR INSECTICIDE", ": ప్రతి ఎకరాకు 200 లీటర్ల నీటిలో 200 గ్రాములు లేక మిలీలీటరులు మందును 10 రోజుల మధ్య పిచికారీ చేయండి.."]];
          break;
        case 'BacterialSpot':
          recommendations = [["KAVACH (Chlorothalonil 75% WP)", "ప్రతి ఎకరాకు 200 లీటర్ల నీటిలో 150 గ్రాములు లేక మిలీలీటరులు మందును 7 రోజుల మధ్య పిచికారీ చేయండి"], ["Dhanucop 50 %WP", "ప్రతి ఎకరాకు 200 లీటర్ల నీటిలో 400 గ్రాములు లేక మిలీలీటరులు మందును 7 రోజుల మధ్య పిచికారీ చేయండి"]];
          break;
        case 'Powdery':
          recommendations = [["Tebuconazole 25.9% EC", "ప్రతి ఎకరాకు 200 లీటర్ల నీటిలో 250 గ్రాములు లేక మిలీలీటరులు మందును  10 రోజుల మధ్య పిచికారీ చేయండి"], ["Sulphur 80% WP", "ప్రతి ఎకరాకు 200 లీటర్ల నీటిలో 600 గ్రాములు లేక మిలీలీటరులు మందును  10 రోజుల మధ్య పిచికారీ చేయండి"],['Hexaconalzole 5%EC','ప్రతి ఎకరాకు 200 లీటర్ల నీటిలో 400 గ్రాములు లేక మిలీలీటరులు మందును  10 రోజుల మధ్య పిచికారీ చేయండి']];
          break;
        case 'Early_blight':
          recommendations = [["UPL SAAF Mancozeb", "ప్రతి ఎకరాకు 200 లీటర్ల నీటిలో 400 గ్రాములు లేక మిలీలీటరులు మందును  10  రోజుల మధ్య  పిచికారీ చేయండి"], ["Antracol propineb fungicide 70pw", "ప్రతి ఎకరాకు 200 లీటర్ల నీటిలో 400 గ్రాములు లేక మిలీలీటరులు మందును  10  రోజుల మధ్య  పిచికారీ చేయండి"],["Amistar top fungicide", "ప్రతి ఎకరాకు 200 లీటర్ల నీటిలో 150 గ్రాములు లేక మిలీలీటరులు మందును 10  రోజుల మధ్య  పిచికారీ చేయండి"]];
          break;
        case 'Late_blight':
          recommendations = [["Mancozeb fungicide", "ప్రతి ఏక ఎకరాకు 200 లీటర్ల నీటిలో 300 గ్రాములు లేక మిలీలీటరులు మందును  7 రోజుల మధ్య పిచికారీ చేయండి"],["UPL Cuprofix fungicide", "ప్రతి ఏక ఎకరాకు 200 లీటర్ల నీటిలో 300 గ్రాములు లేక మిలీలీటరులు మందును 7 రోజుల మధ్య  పిచికారీ చేయండి."],["Mancozeb fungicide", "ప్రతి ఏక ఎకరాకు 200 లీటర్ల నీటిలో 300 గ్రాములు లేక మిలీలీటరులు మందును  7 రోజుల మధ్య పిచికారీ చేయండి"]];
          break;
        case 'Yellow_leaf_curl_virus':
          recommendations = [[" ACTARA (Thiamethoxam 25% WG).", "ప్రతి ఎకరాకు 200 లీటర్ల నీటిలో 100 గ్రాములు లేక మిలీలీటరులు మందును  7 రోజుల మధ్య పిచికారీ చేయండి"], ["EKKA (Acetamiprid 20 % SP)", " ప్రతి ఎకరాకు 200 లీటర్ల నీటిలో 50 గ్రాములు లేక మిలీలీటరులు మందును  7 రోజుల మధ్య పిచికారీ చేయండి."],['Syngenta Pegasus (Diafenthiuron 50%WP)','ప్రతి ఎకరాకు 200 లీటర్ల నీటిలో 200 గ్రాములు లేక మిలీలీటరులు మందును  7 రోజుల మధ్య పిచికారీ చేయండి']];
          break;
        case 'bacterial_blight':
          recommendations = [["Conika 500G Fungicide", "ప్రతి ఎకరాకు 200 లీటర్ల నీటిలో 300 గ్రాములు లేక మిలీలీటరులు మందును 7 రోజుల మధ్య పిచికారీ చేయండి..."], ["Indofil M45 (Mancozeb 75% Wp) Fungicide", "ప్రతి ఎకరాకు 200 లీటర్ల నీటిలో 400 గ్రాములు లేక మిలీలీటరులు మందును  7 రోజుల మధ్య పిచికారీ చేయండి"],['Blitox Copper Oxychloride 50% WP','ప్రతి ఎకరాకు 200 లీటర్ల నీటిలో 600 గ్రాములు లేక మిలీలీటరులు మందును 7 రోజుల మధ్య పిచికారీ చేయండి.']];
          break;
        default:
          recommendations = [['Healthy Plant',""]];
      }
      return renderCard(diseaseName, percentage, recommendations, index);
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Image Captured</Text>
      {capturedImage && <Image source={{ uri: capturedImage }} style={styles.image} />}
      {renderRecommendations()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
  },
  image: {
    objectFit: 'cover',
    width: 350,
    height: 220,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2, // for Android shadow
    shadowColor: '#000', // for iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  diseaseName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  percentage: {
    fontSize: 16,
    marginBottom: 8,
  },
  recommendationsContainer: {
    marginBottom: 8,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  recommendation: {
    fontSize: 14,
    marginBottom: 8,
  },
  audioContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  button: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: 150,
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ResultScreen;
