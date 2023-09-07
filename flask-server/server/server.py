from flask import Flask, request
import pandas as pd 
from json import loads, dumps

app = Flask(__name__)

@app.route("/properties/all", methods=['GET'])
def all_properties():
    return build_response_body(load_dataset())

@app.route("/properties", methods=['GET'])
def single_property():
    args = request.args
    print(args)
    dataset = load_dataset()
    property = dataset[dataset["Condo_area"] == args['area']]
    return build_response_body(property)

def load_dataset():
    return pd.read_csv("../dataset/cleaned/bangkok-condo-dataset.csv")

def build_response_body(dataframe):
    return loads(dataframe.to_json(orient="records"))

if __name__ == "__main__":
    app.run(debug=True)