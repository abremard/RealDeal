# RealDeal

![Screenshot 2024-08-03 at 19 27 10](https://github.com/user-attachments/assets/ad6f1354-880d-419e-a6c4-cf5f8bf8a754)
![Screenshot 2024-08-03 at 19 27 22](https://github.com/user-attachments/assets/81996a96-bec4-4017-ac77-f4f1dabf6490)
![Screenshot 2024-08-03 at 19 42 11](https://github.com/user-attachments/assets/4f0d817b-cc3e-4455-9521-d31bbd3d38f3)


This project is a real estate analytics app that help investors find the right condominium purchase opportunities in Bangkok.

The app is built using Python Flask as a backend and React as a frontend. The datasets come from property scout condo dataset 2021 and public demographic data from the [national statistics office](https://stat.bora.dopa.go.th/stat/statnew/statMenu/newStat/home.php).

I've also trained a ML model to forecast price per SQM for condominium in Bangkok based on the area, the distance to BTS, condo size, nearest road...

This is a publicly accessible project for anyone interested in real estate investment intelligence. I've personally used this tool to purchase my first condo at a 35% discount from market price this year

# Running locally

```
python flask-server/server.py
cd app && npm start
```

# Data

Under `flask-server/scrape`, there's a few scripts and notebook to scrape data from various sources
Under `flask-server/EDA`, there's some tools for data analysis and visualisation
Make sure to also run `flask-server/ETL` scripts to preprocess/cleanup the data
