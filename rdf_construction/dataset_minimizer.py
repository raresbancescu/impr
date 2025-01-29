import pandas as pd

df = pd.read_csv("data/MovieGenre.csv", encoding = "ISO-8859-1")
df_fraction = df.sample(frac=0.1)
nr_of_rows = len(df_fraction)
new_filename = f"MovieGenre_{nr_of_rows}.csv"
df_fraction.to_csv(f"data/subsets/{new_filename}", index=False)

