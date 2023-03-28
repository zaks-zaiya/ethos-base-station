:: Setup javascript npm
cd javascript_ui
call npm install
:: Setup python environment
cd ..\python_radio
call python3 -m venv .\env
call .\env\Scripts\activate.bat
call pip3 install -r requirements.txt
echo Installation complete!