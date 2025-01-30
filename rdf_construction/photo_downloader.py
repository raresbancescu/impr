import os
import pandas as pd
import requests
from pathlib import Path

def download_photo_by_row(row, directory):
    url = row["Poster"]
    if isinstance(url, str) and url.startswith('\"'):
        url = url.strip('\"')
    movie_id = row["imdbId"]
    movie_name = row["Title"]
    try:
        file_name = download_photo(url, movie_id, directory)
        print(f"Saved {file_name} : poster for {movie_name}")
    except Exception as e:
        print(F"Exception for {movie_id} with url {url} : {e}" )


def download_photo(url, movie_id, directory):
    file_extension = url.split('/')[-1].split('.')[-1]
    file_name = f'{movie_id}.{file_extension}'
    r = requests.get(url, allow_redirects=True)
    open(os.path.join(directory, file_name), 'wb').write(r.content)
    return file_name

source_csv = "MovieGenre_1972.csv"
source_dir = f"data/subsets/{source_csv}"
img_dir = f"data/subsets/images/{source_csv.split('.')[0]}"
Path(img_dir).mkdir(parents=True, exist_ok=True)

df = pd.read_csv(source_dir, encoding = "ISO-8859-1")

df.apply(lambda row: download_photo_by_row(row, img_dir), axis=1)
