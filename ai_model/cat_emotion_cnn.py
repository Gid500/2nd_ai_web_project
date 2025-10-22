import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import pandas as pd
import numpy as np
import os
import matplotlib.pyplot as plt

# Define constants
IMAGE_WIDTH, IMAGE_HEIGHT = 128, 128  # Roboflow default size is often 416x416, but 128x128 is good for a start
BATCH_SIZE = 32
EPOCHS = 20  # You can increase this for better training
NUM_CLASSES = 6  # Unlabeled, angry, attentive, no clear emotion recognizable, relaxed, sad, uncomfortable
DATA_DIR = "/home/qod120/Documents/project/2nd_ai_web_project/ai_model/Cat Emotions.v2i.multiclass/train"
CSV_FILE = os.path.join(DATA_DIR, "_classes.csv")

def create_cnn_model(input_shape, num_classes):
    model = Sequential([
        Conv2D(32, (3, 3), activation='relu', input_shape=input_shape),
        MaxPooling2D((2, 2)),
        Conv2D(64, (3, 3), activation='relu'),
        MaxPooling2D((2, 2)),
        Conv2D(128, (3, 3), activation='relu'),
        MaxPooling2D((2, 2)),
        Flatten(),
        Dense(512, activation='relu'),
        Dropout(0.5),
        Dense(num_classes, activation='softmax')
    ])
    return model

def load_data(csv_file, data_dir, image_width, image_height):
    df = pd.read_csv(csv_file)
    
    # Drop the 'Unlabeled' column if it's not a class we want to predict, or if it's always 0
    # Based on the CSV content, 'Unlabeled' seems to be a class itself.
    # Let's assume all columns except 'filename' are emotion classes.
    
    class_columns = df.columns.drop('filename').tolist()
    
    # Ensure that each row has exactly one '1' for multi-class classification
    # If there are rows with multiple '1's or no '1's, this needs to be handled
    # For now, we assume it's clean one-hot encoding.
    
    # Convert the DataFrame to a format suitable for flow_from_dataframe
    # The 'y_col' should be a list of class columns
    
    # Create a list of filenames with their full paths
    df['filename'] = df['filename'].apply(lambda x: os.path.join(data_dir, x))
    
    return df, class_columns

def prepare_data(csv_file, data_dir, image_width, image_height, batch_size):
    df, class_columns = load_data(csv_file, data_dir, image_width, image_height)
    
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)
    
    validation_split_ratio = 0.2
    validation_samples = int(len(df) * validation_split_ratio)
    
    train_df = df.iloc[validation_samples:]
    validation_df = df.iloc[:validation_samples]
    
    num_classes = len(class_columns)
    
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=30,
        width_shift_range=0.3,
        height_shift_range=0.3,
        shear_range=0.3,
        zoom_range=0.3,
        horizontal_flip=True,
        fill_mode='nearest'
    )

    validation_datagen = ImageDataGenerator(rescale=1./255)

    train_generator = train_datagen.flow_from_dataframe(
        dataframe=train_df,
        x_col='filename',
        y_col=class_columns,
        target_size=(image_width, image_height),
        batch_size=batch_size,
        class_mode='raw',
        shuffle=True
    )

    validation_generator = validation_datagen.flow_from_dataframe(
        dataframe=validation_df,
        x_col='filename',
        y_col=class_columns,
        target_size=(image_width, image_height),
        batch_size=batch_size,
        class_mode='raw',
        shuffle=False
    )
    return train_generator, validation_generator, class_columns, num_classes

def build_and_compile_model(input_shape, num_classes):
    model = create_cnn_model(input_shape, num_classes)
    model.compile(optimizer='adam',
                  loss='categorical_crossentropy',
                  metrics=['accuracy'])
    model.summary()
    return model

def train_and_save_model(model, train_generator, validation_generator, epochs, batch_size):
    history = model.fit(
        train_generator,
        steps_per_epoch=int(np.ceil(train_generator.samples / batch_size)),
        epochs=epochs,
        validation_data=validation_generator,
        validation_steps=int(np.ceil(validation_generator.samples / batch_size))
    )
    model.save("cat_emotion_cnn_model.h5")
    print("Model trained and saved as cat_emotion_cnn_model.h5")
    return history

def evaluate_and_display_predictions(model_path, validation_generator, class_columns):
    loaded_model = tf.keras.models.load_model(model_path)

    validation_images, validation_labels = next(validation_generator)
    predictions = loaded_model.predict(validation_images)

    plt.figure(figsize=(10, 10))
    for i in range(min(9, len(validation_images))):
        plt.subplot(3, 3, i + 1)
        plt.imshow(validation_images[i])
        true_label = class_columns[np.argmax(validation_labels[i])]
        predicted_label = class_columns[np.argmax(predictions[i])]
        plt.title(f"True: {true_label}\nPred: {predicted_label}")
        plt.axis('off')
    plt.show()

def train_model():
    train_generator, validation_generator, class_columns, num_classes = prepare_data(
        CSV_FILE, DATA_DIR, IMAGE_WIDTH, IMAGE_HEIGHT, BATCH_SIZE
    )
    
    model = build_and_compile_model((IMAGE_WIDTH, IMAGE_HEIGHT, 3), num_classes)
    
    train_and_save_model(model, train_generator, validation_generator, EPOCHS, BATCH_SIZE)
    
    evaluate_and_display_predictions("cat_emotion_cnn_model.h5", validation_generator, class_columns)

if __name__ == "__main__":
    train_model()