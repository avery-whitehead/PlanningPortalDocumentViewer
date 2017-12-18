import os, sys, time

dir_path = '//ccvuni01/PlanningPortal/_Archive'

def get_path_ref():
    # Gets a list of directories in the path
    ref_dirs = [stats for stats in os.listdir(dir_path) if os.path.isdir(os.path.join(dir_path, stats))]
    # Sorts them by the last modified time (most recent first)
    ref_dirs.sort(key = lambda stats: os.path.getmtime(os.path.join(dir_path, stats)), reverse = True)
    # Returns the first 50
    return ref_dirs[:50]

def get_ref_docs(ref_dir):
    # Builds the path string
    doc_path = dir_path + '/' + ref_dir + '/Attachments'
    # Returns a list of files
    return os.listdir(doc_path)
