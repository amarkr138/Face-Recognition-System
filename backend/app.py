from flask import Flask, request
from flask_cors import CORS
import json
from face_rec import FaceRec
from PIL import Image
import base64
import io
import os
import shutil
import time

app = Flask(__name__)
CORS(app)

# Initialize FaceRec with the known people's folder and the stranger folder
face_recognition_system = FaceRec('./knownpeople', './stranger')

@app.route('/api', methods=['POST', 'GET'])
def api():
    data = request.get_json()
    resp = 'Nobody'
    print(data)

    # Create the stranger folder if it doesn't exist
    directory = './stranger'
    if data:
        if os.path.exists(directory):
            shutil.rmtree(directory)
        if not os.path.exists(directory):
            try:
                os.mkdir(directory)
                time.sleep(1)
                result = data['data']
                b = bytes(result, 'utf-8')
                image = b[b.find(b'/9'):]

                # Decode and save the incoming image
                im = Image.open(io.BytesIO(base64.b64decode(image)))
                im.save(directory + '/stranger.jpeg')

                # Recognize faces dynamically
                recognition_results = face_recognition_system.recognize_faces()

                # Extract the name from the recognition results
                if recognition_results:
                    recognized_names = [result['name'] for result in recognition_results]
                    if recognized_names:
                        resp = ', '.join(recognized_names)
                    else:
                        resp = 'Nobody'
            except Exception as e:
                print(f"Error: {e}")
                pass
    return resp


@app.route('/store', methods=['POST', 'GET'])
def store():
    data = request.get_json()
    directory = './knownpeople'
    print(data)
    resp = 'Nobody'
    if data:
        try:
            time.sleep(1)
            result = data['data']
            b = bytes(result, 'utf-8')
            image = b[b.find(b'/9'):]

            # Decode and save the incoming image as a known person
            im = Image.open(io.BytesIO(base64.b64decode(image)))
            im.save(directory + '/' + data['namex'] + '.jpeg')

            resp = 'Person added successfully'
        except Exception as e:
            print(f"Error: {e}")
            pass
    return resp


if __name__ == '__main__':
    app.run()
