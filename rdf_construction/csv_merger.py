import pandas as pd
import os

merge_dir = {
    "_poster_objects": "Poster",
    "_poster_main_themes": "Poster",
    "_poster_clothes": "Poster",
    "_poster_emotions": "Poster",
    "_poster_nsfw": "Poster",
    "_metadata": "imdbId"
}

def merge_dataframes(join_column, pd1, csv2):
    pd2 = pd.read_csv(csv2, encoding="ISO-8859-1")
    pd1 = pd.merge(pd1, pd2, left_on=join_column, right_on=join_column, how='left')
    return pd1

def join_movie_data(source_dir, source_file):
    source = os.path.join(source_dir, source_file)
    source_df = pd.read_csv(source, encoding="ISO-8859-1")
    for key in merge_dir:
        to_be_merged = os.path.join(source_dir, source_file.split('.')[0] + key + ".csv")
        if os.path.isfile(to_be_merged):
            source_df = merge_dataframes(merge_dir[key], source_df, to_be_merged)
    source_df.to_csv(os.path.join(source_dir, source_file.split('.')[0] + "_complete" + ".csv"), index=False)

def main():
    join_movie_data("data/subsets/", "MovieGenre_1000.csv")

if __name__ == '__main__':
    main()