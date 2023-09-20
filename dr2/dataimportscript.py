#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Script Name: da_xlsx_contentscript.py
Author: Joshua Vargas
Date: September 20, 2023
Description: This script turns an Excel file with the Design Actions template into a JSON file.
"""

# Importing libraries

# Processing libraries
import os
import pandas as pd
import json
import ast  # Import the ast module for literal_eval() function

# GUI Libraries
import tkinter as tk
from tkinter import filedialog

def process_da_xlsx(excel_file, output_folder):
    """
    Process data from an Excel file and save it as a JSON file.

    Args:
        excel_file (str): Path to the input Excel file.
        output_folder (str): Path to the output folder.

    Returns:
        str: JSON string containing processed data.
    """
    # Validate input file and output folder paths
    if not os.path.isfile(excel_file):
        raise FileNotFoundError(f"Input Excel file '{excel_file}' not found.")
    
    if not os.path.isdir(output_folder):
        raise FileNotFoundError(f"Output folder '{output_folder}' not found.")

    # Read data from each sheet into separate DataFrames
    with pd.ExcelFile(excel_file, engine='openpyxl') as xls:
        proms = pd.read_excel(xls, 'proms')
        description = pd.read_excel(xls, 'description')

    # Dropping first column
    proms = proms.iloc[:, 1:]
    description = description.iloc[:, 1:]

    # Dropping index
    proms.reset_index(drop=True, inplace=True)
    description.reset_index(drop=True, inplace=True)

    # Convert string representations of lists to actual lists
    proms['links'] = proms['links'].apply(ast.literal_eval)

    # Save two dataframes to a dictionary
    data_dict = {
        'proms': proms.to_dict(orient='records'),
        'description': description.to_dict(orient='records')
    }

    # Convert dictionary to a JSON string
    json_string = json.dumps(data_dict, indent=4)
    json_string = json_string.replace('"[', '[')
    json_string = json_string.replace(']"', ']')

    # Define the output JSON file path
    output_json_file = os.path.join(output_folder, 'content.json')

    # Rename existing JSON file (if it exists)
    if os.path.exists(output_json_file):
        os.rename(output_json_file, os.path.join(output_folder, 'content_bak.json'))

    # Save json_string to a JSON file
    with open(output_json_file, 'w') as json_file:
        json_file.write(json_string)

    return json_string

# Create GUI window
app = tk.Tk()
app.title("Design Actions Excel Converter")

# Function to handle the "Process" button click
def process_button_click():
    input_file = filedialog.askopenfilename(filetypes=[("XLSX Files", "*.xlsx")])
    output_folder = filedialog.askdirectory()
    if input_file and output_folder:
        status_label.config(text="Processing...")
        try:
            process_da_xlsx(input_file, output_folder)
            status_label.config(text="Processing complete!")
        except Exception as e:
            status_label.config(text=f"Error: {e}")

# Window title
app.title("Design Actions Excel Converter")

# Create "Design Actions Excel Converter" header in large font
header = tk.Label(app, text="Design Actions Excel Converter", font=("Helvetica Neue", 16))
header.pack()

# Add multi-line instructional text that wraps at 400 pixels
instructions = tk.Label(app, text="This script converts an Excel file with the Design Actions template into a JSON file. To use this script, click the \"Select XLSX File\" button below and select the Excel file you want to convert. Then, select the output folder (usually the Data folder of the the Design Actions web app.", wraplength=400)

# Create "Select File" button
select_file_button = tk.Button(app, text="Select XLSX File", command=process_button_click)
select_file_button.pack()

# Create status label
status_label = tk.Label(app, text="")
status_label.pack()

# Add copyright text
copy_text = tk.Label(app, text="© 2023 Future Cities Laboratory, Singapore-ETH Centre")

# Add credits window
def credits_button_click():
    credits_window = tk.Toplevel(app)
    credits_window.title("Credits")
    credits_window.geometry("400x200")
    credits_header = tk.Label(credits_window, text="Credits", font=("Helvetica Neue", 16))
    credits_header.pack()
    # Credits table with first column being name and second column being position at Singapore-ETH Centre, for Joshua Vargas and Stephen Cairns
    credits_text = tk.Label(credits_window, text="Joshua Vargas\nResearch Assistant\n\nDavid Neudecker\nDesign Leader\n\nStephen Cairns\nPrincipal Investigator")
    credits_text.pack()
    credits_window.mainloop()

# Create credits button
credits_button = tk.Button(app, text="Credits", command=credits_button_click)

# Add margins to the window
for child in app.winfo_children():
    child.pack_configure(padx=10, pady=5)

# Start the GUI main loop
app.mainloop()