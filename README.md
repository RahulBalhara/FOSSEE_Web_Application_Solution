This `README.md` file serves as developer documentation, specifically detailing how to test a file upload API endpoint using Postman.
Gemini Conversation while building this : https://gemini.google.com/share/4c7133bf0e73

Install & open Postman

clone the repo & open it code editor(VS Code)
In VS Code, open terminal & move to the directory FOSSEE/backend_project.After this write command 
=> python manage.py makemigrations api
=> python manage.py migrate
=> python manage.py createsuperuser
open this url in browser(http://127.0.0.1:8000/api/upload) Write any id & password and remember it.
After this run the command in the same directory :  python manage.py runserver

After this open postman : Paste this url (http://127.0.0.1:8000/api/upload) in the url section of postman. At the left you will see method mostly GET. Change that to post.Now thereby, 
Below the url you will se authorization.CLick that and then select basic auth in the authorization and the write the password which you entered while opening this server in browser.
Below the url you will see the body. CLick body and then in body select the form-data. Then there will be key-value now in the key value select file instead of text and then upload the folder from you laptop (downloaded from this link : https://drive.google.com/file/d/1cq26Jb7vQ8RC1POISdGic0jr_tuTJI1E/view) this is the csv file provided by the FOSSEE.

Now click on SEND button you will see it in mid-right of the screen.

then in the section below you will see response like this on the postman : 
{
    "id": 1,
    "file_name": "sample_equipment_data.csv",
    "uploaded_at": "2025-11-16T12:57:34.900541Z",
    "summary_data": {
        "total_count": 15,
        "averages": {
            "Flowrate": 119.8,
            "Pressure": 6.106666666666667,
            "Temperature": 117.46666666666667
        },
        "type_distribution": {
            "Pump": 4,
            "Valve": 3,
            "Compressor": 2,
            "HeatExchanger": 2,
            "Reactor": 2,
            "Condenser": 2
        }
    }
}

Now integrate this with the desktop pyQt5 frontend.
