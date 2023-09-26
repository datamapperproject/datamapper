#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Script Name: dataimportscript.py
Author: Joshua Vargas
Date: September 20, 2023
Description: This script provides a frontend for importing data to the Design Actions app.
"""

# Importing libraries

# Processing libraries
import os
import pandas as pd
import json
import ast  # Import the ast module for literal_eval() function
import openpyxl
from PIL import Image
import unidecode
import shutil

# GUI Libraries
import tkinter as tk
from tkinter import filedialog

print(openpyxl.__version__)

#### Function to turn xlsx into DA JSON ####
def process_xlsx_da(excel_file, output_folder):
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

    return True

#### Function to turn DA JSON into xlsx ####
def process_da_xlsx(json_file, output_folder):
    """
    Process existing content.json and output it as an XSLX.
    """
    try:
        with open(json_file, 'r') as json_file:
            data = json.load(json_file)

        proms = pd.DataFrame(data['proms'])
        description = pd.DataFrame(data['description'])

        # Create Pandas Excel writer using ExcelWriter
        with pd.ExcelWriter(os.path.join(output_folder, 'content.xlsx'), engine='xlsxwriter') as writer:
            proms.to_excel(writer, sheet_name='proms')
            description.to_excel(writer, sheet_name='description')

        return True
    
    except Exception as e:
        print(e)
        return False
    
#### Function for Import Wizard ####
def import_wizard_logic(json_file, photo, name, descriptivetext, actionword):
    # Get the folder path of the json file
    folder_path = os.path.dirname(json_file)

    # Resize to 800px wide, then centered crop to 800x480
    img = Image.open(photo)
    width, height = img.size
    # get width and height after resizing to 800px wide
    new_width = 800
    new_height = int(height * (new_width / width))
    # if new height is less than 480px, resize to 480px tall instead
    if new_height < 480:
        new_height = 480
        new_width = int(width * (new_height / height))
        # resize to new dimensions
        img = img.resize((new_width, new_height))
    else:
        # resize to new dimensions
        img = img.resize((new_width, new_height))
    img = img.crop((0, 0, 800, 480))

    # Turn case study name to lowercase without spaces
    ascii_name = name.lower().replace(' ', '-')

    # Make ascii_name use only ASCII characters for file name compatibility
    ascii_name = unidecode.unidecode(ascii_name)

    # Save image with ascii_name to same folder as content_json
    img.save(os.path.join(folder_path, f'{ascii_name}.jpg'))

    # Open JSON file
    with open(json_file, 'r') as json_file:
        data = json.load(json_file)
    
    # Create dataframes from 'proms' and 'descripton' in JSON file
    proms = pd.DataFrame(data['proms'])
    description = pd.DataFrame(data['description'])

    # Record the photo filename in the 'proms' dataframe
    row_index = proms[proms['name'] == actionword].index[0]  # Get the index of the row to update
    links = proms.at[row_index, 'links']
    new_link = ascii_name + '.jpg'
    links.extend([new_link])
    proms.at[row_index, 'links'] = links

    # Create a string that corresponds to the HTML code for the case study, in the form of: "<b>name</b><br>descriptivetext"
    html = f'<b>{name}</b><br>{descriptivetext}'

    # Add a new row to the 'description' dataframe, with the photo's file path as the name and the HTML string as the description
    description = description.append({'name': ascii_name + '.jpg', 'desc': html}, ignore_index=True)

    # Save two dataframes to a dictionary
    data_dict = {
        'proms': proms.to_dict(orient='records'),
        'description': description.to_dict(orient='records')
    }
    
    # Convert dictionary to a JSON string
    json_string = json.dumps(data_dict, indent=4)
    json_string = json_string.replace('"[', '[')
    json_string = json_string.replace(']"', ']')

    # Backup existing JSON file
    backup_file_name = 'content_bak.json'
    backup_file_path = os.path.join(folder_path, backup_file_name)
    source_file_path = os.path.join(folder_path, 'content.json')
    os.makedirs(os.path.dirname(source_file_path), exist_ok=True)
    shutil.copyfile(source_file_path, backup_file_path)

    # Save json_string to a JSON file
    with open(source_file_path, 'w') as data_file:
        data_file.write(json_string)

    return True

# Create GUI window
app = tk.Tk()
app.title("Design Actions Data Importer")

# Function to trigger Import Wizard

processing_label = tk.Label(app, text="", wraplength=350)

def import_wizard_FE():
    # Make a new window
    app = tk.Toplevel()
    app.title("Import Wizard")
    app.geometry("400x550")
    # Create "Import Wizard" header in large font
    header = tk.Label(app, text="Import Wizard", font=("Helvetica Neue", 16))
    header.pack()
    # Update the window to ensure the header is displayed
    app.update()
    # Create the steps
    step1 = tk.Label(app, text="Step 1: Select the content.json file you want to import a case study to.", wraplength=350)
    step1.pack()
    app.update()  # Update the window to display step1 label
    input_file = filedialog.askopenfilename(filetypes=[("JSON Files", "*.json")])
    step2 = tk.Label(app, text="Step 2: Select the photo you want to use for the case study.", wraplength=350)
    step2.pack()
    app.update()  # Update the window to display step2 label
    photo = filedialog.askopenfilename(filetypes=[("JPEG Files", "*.jpg")])
    app.update()  # Update the window to display step3 label
    step3 = tk.Label(app, text="Step 3: Enter the name of the case study.", wraplength=350)
    name = tk.Entry(app)
    step4 = tk.Label(app, text="Step 4: Enter the descriptive text for the case study.", wraplength=350)
    descriptivetext = tk.Entry(app)
    step5 = tk.Label(app, text="Step 5: Enter the action word for the case study.", wraplength=350)
    # This is an OptionMenu with the following choices: sense, formulate, gather, imagine, craft, empower, lifeworlds, concepts, data, potentials, cases, participants, to describe, to frame, to analyse, to create, to evaluate, to negotiate, needs & aspirations, problems, limits, ideas, solutions, projects
    actionword = tk.StringVar(app)
    actionword.set("sense")  # default value
    actionword_options = tk.OptionMenu(app, actionword, "sense", "formulate", "gather", "imagine", "craft", "empower", "lifeworlds", "concepts", "data", "potentials", "cases", "participants", "to describe", "to frame", "to analyse", "to create", "to evaluate", "to negotiate", "needs & aspirations", "problems", "limits", "ideas", "solutions", "projects")
    step6 = tk.Label(app, text="Once all values are filled out, click the button below.", wraplength=350)
    # Create a label for processing completion (initially empty)
    processing_label = tk.Label(app, text="", wraplength=350)
    # The button will trigger the import_wizard_logic function
    import_wizard_button = tk.Button(app, text="Import Case Study", command=lambda: process_import(input_file, photo, name.get(), descriptivetext.get(), actionword.get(), processing_label))
    # Add margins to the window
    for child in app.winfo_children():
        child.pack_configure(padx=10, pady=5)
    # Display the steps
    step1.pack()
    step2.pack()
    step3.pack()
    name.pack()
    step4.pack()
    descriptivetext.pack()
    step5.pack()
    actionword_options.pack()
    step6.pack()
    import_wizard_button.pack()
    processing_label.pack()

def process_import(input_file, photo, name, descriptivetext, actionword, processing_label):
    # Check if any of the values are empty
    if any(not value for value in [input_file, photo, name, descriptivetext, actionword]):
        processing_label.config(text="Error: All fields must be filled")
    else:
        # Call the import_wizard_logic function and check if it returns True
        if import_wizard_logic(input_file, photo, name, descriptivetext, actionword):
            # Update the processing_label to indicate success
            processing_label.config(text="Processing Complete")
        else:
            # Update the processing_label to indicate failure (if needed)
            processing_label.config(text="Processing Failed")

# Function to trigger converting from XLSX to DA
def process_XLSX_DA_button_click():
    step1 = tk.Label(app, text="Step 1: Select the Excel file you want to convert to Design Actions data.")
    input_file = filedialog.askopenfilename(filetypes=[("XLSX Files", "*.xlsx")])
    step2 = tk.Label(app, text="Step 2: Select the output folder where you want to save the Design Actions data.")
    output_folder = filedialog.askdirectory()
    if input_file and output_folder:
        status_label.config(text="Processing...")
        try:
            process_xlsx_da(input_file, output_folder)
            status_label.config(text="Processing complete!")
        except Exception as e:
            status_label.config(text=f"Error: {e}")

# Function to trigger converting from DA to XLS
def process_DA_XLSX_button_click():
    step1 = tk.Label(app, text="Step 1: Select the content.json file you want to convert to Excel.")
    input_file = filedialog.askopenfilename(filetypes=[("JSON Files", "*.json")])
    step2 = tk.Label(app, text="Step 2: Select the output folder where you want to save the Excel file.")
    output_folder = filedialog.askdirectory()
    if input_file and output_folder:
        status_label.config(text="Processing...")
        try:
            process_da_xlsx(input_file, output_folder)
            status_label.config(text="Processing complete!")
        except Exception as e:
            status_label.config(text=f"Error: {e}")

# Window title
app.title("Design Actions Data Importer")

# Create "Design Actions Data Importer" header in large font
header = tk.Label(app, text="Design Actions Data Importer", font=("Helvetica Neue", 16))
header.pack()

# Create button for Import Wizard
import_wizard_button = tk.Button(app, text="Import a Case Study", command=import_wizard_FE)
import_wizard_button.pack()

# Create button for XLSX to DA JSON
xlsx_da_button = tk.Button(app, text="Convert Excel to DA data", command=process_XLSX_DA_button_click)
xlsx_da_button.pack()

# Create button for DA JSON to XLSX
da_xlsx_button = tk.Button(app, text="Convert DA data to Excel", command=process_DA_XLSX_button_click)
da_xlsx_button.pack()

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