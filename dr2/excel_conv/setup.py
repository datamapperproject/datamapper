from cx_Freeze import setup, Executable

# Dependencies are automatically detected, but it might need
# fine tuning.
build_options = {'packages': ['openpyxl'], 'excludes': []}  # Include 'openpyxl' here

executables = [
    Executable('excel_conv/dataimportscript.py', target_name = 'designactionsexcelconverter')
]

setup(name='DesignActionsExcelConverter',
      version = '1.0',
      description = 'Converts the Excel sheet for the Design Actions case studies into the JSON format used in the Design Actions app.',
      options = {'bdist_mac': build_options},
      executables = executables)
