import pandas as pd
from os import walk
import os

os.chdir('./dataset')

filenames = next(walk('.'), (None, None, []))[2]  # [] if no file
EXTENSTION = ".csv"

full_df = pd.DataFrame()

for filename in filenames:
    if EXTENSTION in filename:
        full_df = pd.concat([full_df, pd.read_csv(filename)])

full_df.to_csv("./cleaned/demographic.csv")