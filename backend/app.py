import os
from flask import Flask, flash, request, redirect, url_for, jsonify
from werkzeug.utils import secure_filename
import tensorflow as tf
from tensorflow.keras.models import load_model
import tensorflow as tf
import numpy as np
from flask_cors import CORS, cross_origin


UPLOAD_FOLDER = 'data'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        # Subiendo imagen
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            route = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(route)
            # Cargando el modelo
            model = load_model('modelMascarilla.h5')
            img = tf.keras.utils.load_img(route, target_size=(180, 180))
            img_array = tf.keras.utils.img_to_array(img)
            img_array = tf.expand_dims(img_array, 0)
            predictions = model.predict(img_array)
            score = tf.nn.softmax(predictions[0])
            class_names = ["mascarilla", "no mascarilla"]

            return jsonify(
                response="Successfully",
                prediction=class_names[np.argmax(score)],
                percentaje=100 * np.max(score))
