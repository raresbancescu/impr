import subprocess
import pandas as pd
import os

from enrich_ml import write_dictionary_to_csv


def extract_image_metadata(accepted_keys, image_path):
    exe_process = "hachoir-metadata"
    process = subprocess.Popen([exe_process, image_path],
                               stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                               universal_newlines=True)
    metadata = {}
    for tag in process.stdout:
        line = tag.strip().removeprefix("-").split(':')
        key = line[0].strip()
        value = line[-1].strip()
        if not value or not key in accepted_keys:
            continue
        metadata[key] = value
    return metadata

def extract_images_metadata(accepted_keys, image_ids, image_folder):
    results = {"imdbId":[]}
    for key in accepted_keys:
        results[key] = []
    for movie in image_ids:
        results["imdbId"].append(movie)
        file_path = os.path.join(image_folder, f"{movie}.jpg")
        img_metadata = extract_image_metadata(accepted_keys, file_path)
        for key in accepted_keys:
            results[key].append(img_metadata.get(key, ''))
    return results

def main():
    source_folder = "data/subsets/"
    source_file = "MovieGenre_1000.csv"
    df = pd.read_csv(os.path.join(source_folder, source_file), encoding = "ISO-8859-1")
    movie_ids = df["imdbId"].to_list()
    accepted_keys = ['Image width', 'Image height', 'Bits/pixel', 'Pixel format', 'Compression',  'Format version', 'MIME type', 'Endianness']
    images_folder = os.path.join(source_folder, "images", source_file.split(".")[0])

    results = extract_images_metadata(accepted_keys, movie_ids, images_folder)
    new_file = source_file.strip('.csv') + "_metadata.csv"
    write_dictionary_to_csv(results, os.path.join(source_folder, new_file))

if __name__ == "__main__":
   main()