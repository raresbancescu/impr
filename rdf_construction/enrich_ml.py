import os.path
import time

from dd_client import DD
import pandas as pd
import requests

host = 'localhost'
port = 1912
path = '/api/deepdetect'
dd = DD(host, port, 0, path=path)
dd.set_return_format(dd.RETURN_PYTHON)


def get_objects_from_prediction(prediction):
    objects = []
    for pred_class in prediction['classes']:
        objects.append(pred_class['cat'])

    return "|".join(objects)


def get_objects_from_prediction_distinct(prediction):
    objects = []
    for pred_class in prediction['classes']:
        objects.append(pred_class['cat'])
    objects = list(set(objects))
    return "|".join(objects)

def get_nsfw_from_prediction(prediction):
    return prediction["classes"][0]['cat']

def call_ml_algorithm(service_name, parameters_output, photo_urls, batch_size, result_key, prediction_processing_func):
    parameters_input = {}
    parameters_mllib = {}
    results = {'Poster': [], result_key: []}
    start_time = time.time()
    for batch in [photo_urls[i:i + batch_size] for i in range(0, len(photo_urls), batch_size)]:
        data = batch
        classif = dd.post_predict(service_name, data, parameters_input, parameters_mllib, parameters_output)
        if classif['status']['code'] != 200:
            print(f"Predict for {service_name} failed")
        else:
            for prediction in classif['body']['predictions']:
                photo_url = prediction['uri']
                result = prediction_processing_func(prediction)
                results['Poster'].append(photo_url)
                results[result_key].append(result)
    print(f"Predict success for {service_name}: nr. of results - {len(results['Poster'])}; time: {time.time() - start_time} s")
    return results


# max batch_size 15
def get_objects_in_photos(photo_urls, batch_size):
    return call_ml_algorithm(
        "detection_600",
        {"confidence_threshold": 0.30, "bbox": True},
        photo_urls,
        batch_size,
        "Objects",
        get_objects_from_prediction
    )

# good batch_size 60
def get_main_themes_in_photos(photo_urls, batch_size):
    return call_ml_algorithm(
        "classification_21k",
        {"confidence_threshold": 0.30},
        photo_urls,
        batch_size,
        "MainThemes",
        get_objects_from_prediction
    )


#maximum batch_size is 3
def get_is_nsfw_photos(photo_urls, batch_size):
    return call_ml_algorithm(
        "nsfw",
        {"confidence_threshold": 0.30},
        photo_urls,
        batch_size,
        "NSFW",
        get_nsfw_from_prediction
    )

#maximum batch_size is 8
def get_clothes_in_photos(photo_urls, batch_size):
    return call_ml_algorithm(
        "basic_fashion_v2",
        {"confidence_threshold": 0.30, "bbox":True},
        photo_urls,
        batch_size,
        "Clothes",
        get_objects_from_prediction_distinct
    )

#maximum batch_size is 1
def get_emotions_in_photos(photo_urls, batch_size):
    return call_ml_algorithm(
        "faces_emo",
        {"confidence_threshold": 0.30, "bbox": True},
        photo_urls,
        batch_size,
        "Emotions",
        get_objects_from_prediction
    )

def write_dictionary_to_csv(dictionary, destination):
    df_dict = pd.DataFrame(dictionary)
    df_dict.to_csv(destination, index=False)

def main():
    source_folder = "data/subsets/"
    source_file = "MovieGenre_1000.csv"
    df = pd.read_csv(os.path.join(source_folder, source_file), encoding = "ISO-8859-1")
    poster_list = df["Poster"].to_list()
    poster_list = [url.strip('\"') for url in poster_list]

    poster_objects = get_objects_in_photos(poster_list, 15)
    new_file = source_file.strip('.csv') + "_poster_objects.csv"
    write_dictionary_to_csv(poster_objects, os.path.join(source_folder, new_file))

    poster_main_themes = get_main_themes_in_photos(poster_list, 60)
    new_file = source_file.strip('.csv') + "_poster_main_themes.csv"
    write_dictionary_to_csv(poster_main_themes, os.path.join(source_folder, new_file))

    poster_nsfw = get_is_nsfw_photos(poster_list, 1)
    new_file = source_file.strip('.csv') + "_poster_nsfw.csv"
    write_dictionary_to_csv(poster_nsfw, os.path.join(source_folder, new_file))

    poster_clothes = get_clothes_in_photos(poster_list, 8)
    new_file = source_file.strip('.csv') + "_poster_clothes.csv"
    write_dictionary_to_csv(poster_clothes, os.path.join(source_folder, new_file))

    poster_emotions = get_emotions_in_photos(poster_list, 1)
    new_file = source_file.strip('.csv') + "_poster_emotions.csv"
    write_dictionary_to_csv(poster_emotions, os.path.join(source_folder, new_file))

if __name__ == "__main__":
   main()



