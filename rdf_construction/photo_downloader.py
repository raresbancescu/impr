import os
import pandas as pd
import requests
from pathlib import Path


row_increment = 0

def download_photo_by_row(row, directory, rejected_movie_ids):
    global row_increment
    url = row["Poster"]
    if isinstance(url, str) and url.startswith('\"'):
        url = url.strip('\"')
    movie_id = row["imdbId"]
    movie_name = row["Title"]
    try:
        file_name = download_photo(url, movie_id, directory, rejected_movie_ids)
        print(f"{row_increment} - Saved {file_name} : poster for {movie_name}")
        row_increment += 1
    except Exception as e:
        print(F"{row_increment} - Exception for {movie_id} with url {url} : {e}" )
        row_increment += 1


def download_photo(url, movie_id, directory, rejected_movie_ids):
    file_extension = url.split('/')[-1].split('.')[-1]
    file_name = f'{movie_id}.{file_extension}'
    r = requests.get(url, allow_redirects=True)
    if r.status_code != 200:
        rejected_movie_ids.append(movie_id)
        raise Exception(f"Status code for request is {r.status_code}")
    open(os.path.join(directory, file_name), 'wb').write(r.content)
    return file_name

def main():
    source_csv = "MovieGenre_1972.csv"
    source_dir = "data/subsets/"
    source = os.path.join(source_dir, source_csv)
    img_dir = "data/subsets/images/"
    img_dir_destination = os.path.join(img_dir, source_csv.split('.')[0])
    Path(img_dir_destination).mkdir(parents=True, exist_ok=True)

    df = pd.read_csv(source, encoding = "ISO-8859-1")
    rejected_movie_ids = []
    df.apply(lambda row: download_photo_by_row(row, img_dir_destination, rejected_movie_ids), axis=1)

    #remove the movies for which the get image request failed
    df = df[~df["imdbId"].isin(rejected_movie_ids)]
    nr_rows = len(df)
    new_csv = f"MovieGenre_{nr_rows}.csv"
    df.to_csv(os.path.join(source_dir, new_csv), index=False)
    os.rename(img_dir_destination, os.path.join(img_dir, new_csv.split('.')[0]))

if __name__ == "__main__":
    main()

