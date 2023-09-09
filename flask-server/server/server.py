from flask import Flask, request
import pandas as pd 
from json import loads

app = Flask(__name__)

@app.route("/properties/all", methods=['GET'])
def all_properties():
    return build_response_body(load_dataset())

@app.route("/properties", methods=['GET'])
def single_property():
    args = request.args
    dataset = load_dataset()
    filters = True
    text_filters = False
    text_filters = build_text_filter(dataset, text_filters, args, 'Condo_area', 'search')
    text_filters = build_text_filter(dataset, text_filters, args, 'Address_TH', 'search')
    text_filters = build_text_filter(dataset, text_filters, args, 'Condo_NAME_EN', 'search')
    text_filters = build_text_filter(dataset, text_filters, args, 'Condo_NAME_TH', 'search')
    filters = build_strict_filter(dataset, filters, args, 'ID', 'id')
    filters = build_min_max_filters(dataset=dataset, filters=filters, args=args, params_dict=[
        {'db_key': 'Year_built', 'min_param': 'year_built_min', 'max_param': 'year_built_max'},
        {'db_key': 'Area_m2', 'min_param': 'area_min', 'max_param': 'area_max'},
        {'db_key': '#_Tower', 'min_param': 'tower_min', 'max_param': 'tower_max'},
        {'db_key': '#_Floor', 'min_param': 'floor_min', 'max_param': 'floor_max'},
        {'db_key': 'Sale_Price_Sqm', 'min_param': 'sale_price_sqm_min', 'max_param': 'sale_price_sqm_max'},
        {'db_key': 'Latitude', 'min_param': 'lat_min', 'max_param': 'lat_max'},
        {'db_key': 'Longtitude', 'min_param': 'long_min', 'max_param': 'long_max'},
        {'db_key': 'MinDist_Station', 'min_param': 'min_dist', 'max_param': 'max_dist'},
    ])
    text_filters = text_filters if args.get('search') else True
    properties = dataset[filters & (text_filters)] if args else dataset
    return build_response_body(properties)

def build_min_max_filters(dataset, filters, args, params_dict):
    for param in params_dict:
        filters = build_min_max_filter(dataset, filters, args, param['db_key'], param['min_param'], param['max_param'])
    return filters

def build_min_max_filter(dataset, filters, args, db_key, min_param, max_param):
    if args.get(min_param):
        filters = filters & (dataset[db_key] >= float(args[min_param]))
    if args.get(max_param):
        filters = filters & (dataset[db_key] <= float(args[max_param]))
    return filters

def build_text_filter(dataset, filters, args, db_key, param):
    if args.get(param):
        filters = filters | (dataset[db_key].str.contains(args[param]))
    return filters

def build_strict_filter(dataset, filters, args, db_key, param):
    if args.get(param):
        filters = filters & (dataset[db_key] == args[param])
    return filters

def load_dataset():
    return pd.read_csv("../dataset/cleaned/bangkok-condo-dataset.csv")

def build_response_body(dataframe):
    return loads(dataframe.to_json(orient="records"))

if __name__ == "__main__":
    app.run(debug=True)