import pandas as pd
from os import walk
import os

os.chdir('./dataset')

filenames = next(walk('.'), (None, None, []))[2]  # [] if no file
EXTENSION = ".csv"

full_df = pd.read_csv(filenames[0])

for filename in filenames[1:]:
    if EXTENSION in filename:
        full_df = pd.concat([full_df, pd.read_csv(filename).tail(-1)])

full_df.to_csv("./cleaned/demographic.csv")