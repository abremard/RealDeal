from flask import Flask, request
import pandas as pd 
from json import loads
import flask

app = Flask(__name__)
CONDO_DATASET_PATH = "../dataset/cleaned/bangkok-condo-dataset.csv"
DEMOGRAPHY_DATASET_PATH = "../dataset/cleaned/demographic.csv"
DISTRICT_MAPPER_PATH = "../dataset/cleaned/district_mapper.csv"

demography_dataset = None
district_mapper = None

@app.route("/properties/all", methods=['GET'])
def all_properties():
    response = flask.jsonify(build_response_body(load_dataset(CONDO_DATASET_PATH).reset_index()[["Condo_NAME_EN", "ID"]].rename(columns={'Condo_NAME_EN': 'label', 'ID': 'id'})
))
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route("/properties/<id>", methods=['GET'])
def property_by_id(id):
    id = request.view_args['id']
    dataset = load_dataset(CONDO_DATASET_PATH).reset_index()
    dataset = dataset[dataset['ID'] == int(id)]
    response = flask.jsonify(build_response_body(dataset))
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route("/properties", methods=['GET'])
def property_search():
    args = request.args
    dataset = load_dataset(CONDO_DATASET_PATH).reset_index()
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
    response = flask.jsonify(build_response_body(properties))
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route("/demography/all", methods=['GET'])
def all_demography():
    response_df = demography_dataset[demography_dataset["ชื่อจังหวัด"] == "กรุงเทพมหานคร"].groupby(['ชื่อจังหวัด', 'ปีเดือน']).sum().reset_index()
    response_df["x"] = response_df['ปีเดือน']
    response_df["y"] = response_df['ผลรวมประชากรทั้งหมด']
    response = flask.jsonify(build_response_body(response_df[["x", "y"]]))
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route("/demography", methods=['GET'])
def single_demography():
    args = request.args
    district_en = args.get('district')
    district_th = district_mapper[district_mapper["district_en"] == district_en]["district_th"].iloc[0]
    response_df = demography_dataset[demography_dataset["ชื่อสำนักทะเบียน"] == district_th].groupby(['ชื่อสำนักทะเบียน', 'ปีเดือน']).sum().reset_index()
    response_df["x"] = response_df['ปีเดือน']
    response_df["y"] = response_df['ผลรวมประชากรทั้งหมด']
    response = flask.jsonify(build_response_body(response_df[["x", "y"]]))
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

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

def load_dataset(url, header=0, index_col=0):
    return pd.read_csv(url, header=header, index_col=index_col)

def build_response_body(dataframe):
    return loads(dataframe.to_json(orient="records", force_ascii=False))

if __name__ == "__main__":
    demography_dataset = load_dataset(DEMOGRAPHY_DATASET_PATH, header=1, index_col=0)
    district_mapper = load_dataset(DISTRICT_MAPPER_PATH, index_col=False)
    app.run(debug=True)