import face_recognition
import numpy as np
from PIL import Image
import os

class FaceRec:
    def __init__(self, known_persons_folder, unknown_images_path_file):
        self.known_persons_folder = known_persons_folder
        self.unknown_images_path_file = unknown_images_path_file
        self.known_face_encodings = []
        self.known_face_names = []
        self.load_known_faces()

    def load_known_faces(self):
        # Load all known images and their names from the known people folder
        for file in os.listdir(self.known_persons_folder):
            if file[0] != '.':  # Skip hidden files (e.g., .DS_Store)
                name = file.split('.')[0]  # Name is the filename without extension
                image_path = os.path.join(self.known_persons_folder, file)
                known_image = face_recognition.load_image_file(image_path)
                known_encoding = face_recognition.face_encodings(known_image)

                if known_encoding:  # If there are faces in the image
                    self.known_face_encodings.append(known_encoding[0])
                    self.known_face_names.append(name)

    def recognize_faces(self):
        results = []
        for file in os.listdir(self.unknown_images_path_file):
            if file[0] != '.':
                unknown_image_path = os.path.join(self.unknown_images_path_file, file)
                unknown_image = face_recognition.load_image_file(unknown_image_path)
                face_locations = face_recognition.face_locations(unknown_image)
                face_encodings = face_recognition.face_encodings(unknown_image, face_locations)

                for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
                    matches = face_recognition.compare_faces(self.known_face_encodings, face_encoding)
                    name = 'Nobody'

                    # Find the best match
                    face_distances = face_recognition.face_distance(self.known_face_encodings, face_encoding)
                    best_match_index = np.argmin(face_distances)

                    if matches[best_match_index]:
                        name = self.known_face_names[best_match_index]

                    results.append({'file': file, 'name': name})

        return results
