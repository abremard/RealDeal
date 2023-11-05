from flask import Flask, request
import pandas as pd
from json import loads
import flask
import joblib
from flask_cors import CORS

app = Flask(__name__)
CORS(app, support_credentials=True)
CONDO_DATASET_PATH = "../dataset/cleaned/bangkok-condo-dataset.csv"
NPA_DATASET_PATH = "../dataset/npa/krungthai_2023-11-04.csv"
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


@app.route("/npa/all", methods=['GET'])
def all_npas():
    response = flask.jsonify(build_response_body(
        load_dataset(NPA_DATASET_PATH)))
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
    text_filters = build_text_filter(
        dataset, text_filters, args, 'Condo_area', 'search')
    text_filters = build_text_filter(
        dataset, text_filters, args, 'Address_TH', 'search')
    text_filters = build_text_filter(
        dataset, text_filters, args, 'Condo_NAME_EN', 'search')
    text_filters = build_text_filter(
        dataset, text_filters, args, 'Condo_NAME_TH', 'search')
    filters = build_strict_filter(dataset, filters, args, 'ID', 'id')
    filters = build_min_max_filters(dataset=dataset, filters=filters, args=args, params_dict=[
        {'db_key': 'Year_built', 'min_param': 'year_built_min',
            'max_param': 'year_built_max'},
        {'db_key': 'Area_m2', 'min_param': 'area_min', 'max_param': 'area_max'},
        {'db_key': '#_Tower', 'min_param': 'tower_min', 'max_param': 'tower_max'},
        {'db_key': '#_Floor', 'min_param': 'floor_min', 'max_param': 'floor_max'},
        {'db_key': 'Sale_Price_Sqm', 'min_param': 'sale_price_sqm_min',
            'max_param': 'sale_price_sqm_max'},
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
    response_df = demography_dataset[demography_dataset["ชื่อจังหวัด"] == "กรุงเทพมหานคร"].groupby(
        ['ชื่อจังหวัด', 'ปีเดือน']).sum().reset_index()
    response_df["x"] = response_df['ปีเดือน']
    response_df["y"] = response_df['ผลรวมประชากรทั้งหมด']
    response = flask.jsonify(build_response_body(response_df[["x", "y"]]))
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route("/demography", methods=['GET'])
def single_demography():
    args = request.args
    district_en = args.get('district')
    district_th = district_mapper[district_mapper["district_en"]
                                  == district_en]["district_th"].iloc[0]
    response_df = demography_dataset[demography_dataset["ชื่อสำนักทะเบียน"] == district_th].groupby(
        ['ชื่อสำนักทะเบียน', 'ปีเดือน']).sum().reset_index()
    response_df["x"] = response_df['ปีเดือน']
    response_df["y"] = response_df['ผลรวมประชากรทั้งหมด']
    response = flask.jsonify(build_response_body(response_df[["x", "y"]]))
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route("/mortgage", methods=['GET'])
def calculate_mortgage():
    args = request.args
    # params
    price = float(args.get("price"))
    rent = float(args.get("rent"))
    monthly_expenses = float(args.get("monthly_expenses"))
    down_payment = float(args.get("down_payment"))
    appreciation = float(args.get("appreciation"))
    interest_rate = float(args.get("interest_rate"))
    mortgage_duration = int(args.get("mortgage_duration"))
    ROI_duration = int(args.get("ROI_duration"))

    # calculated properties
    interest_coeff = (interest_rate*pow(1+interest_rate,
                      mortgage_duration)/(pow(1+interest_rate, mortgage_duration)-1))
    starting_debt = mortgage_duration*(price-down_payment)*interest_coeff
    monthly_payment = starting_debt/(12*mortgage_duration)
    avg_monthly_principal = (price-down_payment)/(12*mortgage_duration)
    avg_monthly_interest = monthly_payment - avg_monthly_principal
    gross_yield = rent * 12 / price
    BP_cash_flow = rent-monthly_expenses-avg_monthly_interest
    monthly_cash_flow = rent-monthly_expenses-monthly_payment
    cash_on_cash_return = BP_cash_flow * 12 / down_payment
    equity = down_payment / price
    ROI_on_duration = (price*(pow(1+appreciation, ROI_duration/12)-1) + BP_cash_flow*ROI_duration) / \
        (down_payment + monthly_payment*ROI_duration + monthly_expenses*ROI_duration)

    response = flask.jsonify([
        {"price": price, "rent": rent, "monthly_expenses": monthly_expenses, "down_payment": down_payment,
         "appreciation": appreciation, "interest_rate": interest_rate, "mortgage_duration": mortgage_duration, "ROI_duration": ROI_duration,
         "starting_debt": starting_debt, "monthly_payment": monthly_payment, "avg_monthly_principal": avg_monthly_principal,
         "avg_monthly_interest": avg_monthly_interest, "gross_yield": gross_yield, "monthly_cash_flow": monthly_cash_flow,
         "cash_on_cash_return": cash_on_cash_return, "equity": equity, "ROI_on_duration": ROI_on_duration
         }])
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route("/prediction", methods=['POST'])
def predict_sqm_price():
    input_json = request.json
    input_df = pd.DataFrame.from_dict(input_json)
    new_area = pd.get_dummies(
        input_df['Condo_area'], dummy_na=True, prefix='Area_')
    new_kind = pd.get_dummies(input_df['Kind'], dummy_na=True, prefix='Kind_')
    new_road = pd.get_dummies(input_df['Road'], dummy_na=True, prefix='Road_')
    input_df = pd.concat([input_df, new_area, new_kind, new_road], axis=1)
    input_df = input_df.drop('Condo_area', axis=1)
    input_df = input_df.drop('Kind', axis=1)
    input_df = input_df.drop('Road', axis=1)
    scaler_model = joblib.load('../ML/data_scaler.joblib')
    full_df = pd.DataFrame(columns=scaler_model.feature_names_in_)
    full_df.loc[0] = input_df.iloc[0, :]
    full_df = full_df.fillna(False)
    X = scaler_model.transform(full_df)
    rf_best_model = joblib.load('../ML/rf.joblib')
    predictions = rf_best_model.predict(X)
    response = flask.jsonify({"sqm_price": predictions[0]})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


def build_min_max_filters(dataset, filters, args, params_dict):
    for param in params_dict:
        filters = build_min_max_filter(
            dataset, filters, args, param['db_key'], param['min_param'], param['max_param'])
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
    demography_dataset = load_dataset(
        DEMOGRAPHY_DATASET_PATH, header=1, index_col=0)
    district_mapper = load_dataset(DISTRICT_MAPPER_PATH, index_col=False)
    app.run(debug=True)
