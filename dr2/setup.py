from cx_Freeze import setup, Executable

# Dependencies are automatically detected, but it might need
# fine tuning.
build_options = {'packages': [], 'excludes': []}

import sys
base = 'Win32GUI' if sys.platform=='win32' else None

executables = [
    Executable('/Users/jvargas/Documents/GitHub/datamapper/dr2/excel_conv/dataimportscript.py', base=base)
]

setup(name='DesignActionsDataImporter',
      version = '0.1',
      description = 'Data importer for the Design Actions tool developed at Future Cities Laboratory.',
      options = {'build_exe': build_options},
      executables = executables)
