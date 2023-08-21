import pandas as pd
from os import walk
import os

os.chdir('./dataset')

filenames = next(walk('.'), (None, None, []))[2]  # [] if no file
EXTENSTION = ".xls"

for filename in filenames:
    if EXTENSTION in filename:
        prefix = filename.split('.')[0]
        df = pd.read_html(filename, flavor='bs4')[0]
        df.to_csv(prefix+'.csv')

 