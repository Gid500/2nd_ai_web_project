
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import pandas as pd
import numpy as np
import os
import math

# Define constants
IMAGE_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 10  # You might want to increase this for better accuracy
NUM_CLASSES = 6 # angry, Happy, Normal, relaxed, sad, Scared
DATASET_PATH = "/home/qod120/Documents/project/2nd_ai_web_project/ai_model/Cat Emotions.v2i.folder"
TRAIN_DIR = os.path.join(DATASET_PATH, "train")

MODEL_SAVE_PATH = "/home/qod120/Documents/project/2nd_ai_web_project/ai_model/cat_emotion_mobilenet_v2.h5"

# Create an ImageDataGenerator for data augmentation and preprocessing
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    fill_mode='nearest',
    validation_split=0.1 # 10% for validation
)

# Create the generators
train_generator = train_datagen.flow_from_directory(
    TRAIN_DIR,
    target_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical', # For one-hot encoded labels
    subset='training', # Set as training data
    shuffle=True
)

validation_generator = train_datagen.flow_from_directory(
    TRAIN_DIR,
    target_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical', # For one-hot encoded labels
    subset='validation', # Set as validation data
    shuffle=False
)

# Load MobileNetV2 pre-trained on ImageNet
base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(IMAGE_SIZE[0], IMAGE_SIZE[1], 3))

# Add custom top layers for single-label classification
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(128, activation='relu')(x) # Added a new Dense layer
x = Dropout(0.5)(x) # Added a Dropout layer for regularization
x = Dense(NUM_CLASSES, activation='softmax')(x) # Softmax for single-label classification

# Create the new model
model = Model(inputs=base_model.input, outputs=x)

# Freeze the base model layers
for layer in base_model.layers:
    layer.trainable = False

# Compile the model
model.compile(optimizer='adam',
              loss='categorical_crossentropy', # Use categorical_crossentropy for single-label classification
              metrics=['accuracy'])

# Train the model
print("Starting model training...")
history = model.fit(
    train_generator,
    epochs=EPOCHS,
    steps_per_epoch=math.ceil(train_generator.samples / BATCH_SIZE),
    validation_data=validation_generator,
    validation_steps=math.ceil(validation_generator.samples / BATCH_SIZE),
    verbose=1
)
print("Model training finished.")

# Save the trained model
model.save(MODEL_SAVE_PATH)
print(f"Model saved to {MODEL_SAVE_PATH}")
