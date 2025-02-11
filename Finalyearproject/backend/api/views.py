
import os 
import cv2
import pickle
import base64
import tempfile
import warnings
import numpy as np
from PIL import Image
from io import BytesIO
import tensorflow as tf
from .models import PlantDisease
from rest_framework import status
from rest_framework.views import APIView
from .serializers import DiseaseSerializer
from rest_framework.response import Response
from rest_framework.generics import ListAPIView



warnings.filterwarnings('ignore')

class DiseaseList(APIView):
    def post(self, request, *args, **kwargs):
        try:
            # Get the base64 encoded image from the request
            image = request.data.get('image')
            try:
                # Decode base64 image
                image_data = base64.b64decode(image)
                image = Image.open(BytesIO(image_data))
            except Exception as e:
                print(str(e))
                return JsonResponse({'error': f'Error decoding image: {str(e)}'})   
            
            # Save the decoded image to a temporary file
            temp_image = tempfile.NamedTemporaryFile(delete=False, suffix=".png")
            temp_image_path = temp_image.name
            image.save(temp_image_path)
            temp_image.close()
            
            preprocessed_image = preprocess_image(temp_image_path)
            # Make predictions
            top_labels, top_probabilities = predict_top_labels(preprocessed_image)
            os.unlink(temp_image_path)
            # Store the results in the database
            store_results(top_labels, top_probabilities)
            # Create a PlantDisease instance with the top prediction
            disease_data = {'name': top_labels[0], 'percentage': top_probabilities[0]}
            print(top_labels, top_probabilities)
            serializer = DiseaseSerializer(data=disease_data)
            if serializer.is_valid():
                serializer.save()
            return Response({'labels': top_labels, 'probabilities': top_probabilities}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def preprocess_image(image):
    try:
        image = cv2.imread(image)
        image = image.astype(np.float32)
        image = image / 255.0
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        image = cv2.resize(image, (240, 240))
        image = np.expand_dims(image, axis=0)
    except Exception as e:
        print(str(e))
    return image


def predict_top_labels(image):
    model_pkl_file = "C:/Users/Srinivas Reddy/Finalyearproject/backend/api/plantcare+.pkl"
    try:
        try:
            with open(model_pkl_file, 'rb') as file:
                model = pickle.load(file)
        except Exception as e:
            print("abcd")
            print(e)
        predictions = model.predict(image)[0]
        top_indices = np.argsort(predictions)[-3:][::-1]
        class_names = ['CommonRust', 'BlackSpot', 'BacterialSpot', "healthy", "Powdery", "Early_blight", 
                       "Late_blight", "Yellow_leaf_curl_virus", "bacterial_blight"]
        class_name_label = {class_name: i for i, class_name in enumerate(class_names)}
        top_labels = [class_names[i] for i in top_indices]
        top_probabilities = [predictions[i] for i in top_indices]
    except Exception as e:
        print(str(e))
    return top_labels, top_probabilities


def store_results(labels, probabilities):
    # store in plantDisease model
    for label, percentage in zip(labels, probabilities):
        PlantDisease.objects.create(name=label, percentage=percentage)
