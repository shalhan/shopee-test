# Currency Rate Management System
an API based on Node.js and MySQL to manage your own currency rate data (not for public use)

## Getting Started

if you want to use this app follow these instructions below

### Installation
```
    $ git clone https://github.com/shalhan/shopee-test.git

    $ cd shopee-test

    $ npm install

    $ npm start
```

System will be running in port :8080
### PostgreSQL Config
Copy past file **config.json.example** into root directory then fill all the attributes

### Database Structure
This API have 2 tables which are **rates** table and **tracks** table. **rates** table is used to manage currency exchange rate and **tracks** table is used to tracking currency rate

#### rates
| Attribute        |  |
| ------------- |-------------| 
| id      | bigint primaryKey sequence |          |
| from_c      | character_varying(5)  |
| to_c | character_varying(5) |
| rate | double_precision  |
| created_at | date |
| updated_at | timestamp without timezone |

#### tracks
| Attribute        |  |
| ------------- |-------------| 
| id      | bigint primaryKey sequence |          |
| from_c      | character_varying(5)  |
| to_c | character_varying(5) |
| created_at | date |
| updated_at | timestamp without timezone |

NOTE : Follow all the attribute name, attribute data type, and table name to running this app
&nbsp;
&nbsp;

&nbsp;

&nbsp;

## API Calls

### Overview

| Method        | Endpoint           | Query |
| ------------- |-------------| -----:|
| GET      | /rates | date=YYYY-MM-DD |
| GET      | /rates/trend      |  from=USD and to=IDR |
| POST | /rates      |    - |
| GET | /tracks | - |
| POST | /tracks | - |
| DELETE | /tracks/:id | - |

### Rates
#### GET    / rates?date=YYYY-MM-DD

##### Notes

```
    This endpoint return average rate in last 7 days from selected date
```

##### Response Example
```
{
    "status": 201,
    "title": "Success",
    "data": [
        {
            "from_c": "JPY",
            "to_c": "IDR",
            "rate": null,
            "created_at": "2017-09-24",
            "avg_rate": "Insufficient data"
        },
        {
            "from_c": "USD",
            "to_c": "GBP",
            "rate": 2,
            "created_at": "2017-09-24",
            "avg_rate": 1.5857142857142856
        },
        {
            "from_c": "GBP",
            "to_c": "USD",
            "rate": 1,
            "created_at": "2017-09-24",
            "avg_rate": 1.4285714285714286
        },
        {
            "from_c": "USD",
            "to_c": "IDR",
            "rate": null,
            "created_at": "2017-09-23",
            "avg_rate": "Insufficient data"
        }
    ]
}
```
NOTE : avg_rate have value *'insufficient data'* and rate have value *null* when there is a missing data between selected date to its last-7-days-data

#### GET    / rates / trend ? from = currency1 & to = currency2

##### Notes

```
    This endpoint return recent exchange rate data of selected currency 
```

##### Response Example
```
{
    "status": 200,
    "title": "Success",
    "data": {
        "from_c": "USD",
        "to_c": "GBP",
        "var_rate": 2.9,
        "avg_rate": 1.5857142857142856,
        "last_7_days": [
            {
                "rate": 2,
                "created_at": "2017-09-24"
            },
            {
                "rate": 1,
                "created_at": "2017-09-23"
            },
            {
                "rate": 2,
                "created_at": "2017-09-22"
            },
            {
                "rate": 1,
                "created_at": "2017-09-21"
            },
            {
                "rate": 2,
                "created_at": "2017-09-20"
            },
            {
                "rate": 0.1,
                "created_at": "2017-09-19"
            },
            {
                "rate": 3,
                "created_at": "2017-09-18"
            }
        ]
    }
}
```

#### POST    / rates 

##### Notes

```
    Insert currency exchange rate data 
```

##### Request Example
```
=/ x-www-form-urlencoded

{
    from_c : "IDR",
    to_c: "USD",
    rate: 14200,
    created_at: 2018-10-02
}
```
### Tracks
#### GET    / tracks 
##### Notes

```
    Get all tracking currencies
```
##### Response Example

```
{
    "status": 201,
    "title": "Success",
    "data": [
        {
            "id": 2,
            "from_c": "USD",
            "to_c": "IDR"
        }
    ]
}
```

#### POST    / tracks 
##### Notes

```
    Create tracking exchange rate data
```
##### Request Example

```
{
    from_c: "USD",
    to_c: "IDR"
}
```
NOTE : currency data (from_c and to_c) that will be inserted have to exist in rates table

#### DELETE    / tracks / :id
##### Notes

```
    Delete tracking exchange rate data
```
