#!/bin/bash

# Define file paths
input_file="ol_dump_editions_2024-04-30.txt.gz"
output_file="extracted_data.csv"
resume_file="resume.txt"

# Check if resume file exists
if [ -f "$resume_file" ]; then
    # Read last processed ISBN from resume file
    last_isbn=$(cat "$resume_file")
    # Resume processing from the next line after the last processed ISBN
    start_line=$(zgrep -n "$last_isbn" "$input_file" | cut -d: -f1)
    start_line=$((start_line + 1))
else
    # Start processing from the beginning if resume file doesn't exist
    start_line=1
fi

# Process the file starting from the specified line
zcat "$input_file" | sed 's/^[^\{]*//' | sed -n "${start_line},$"p | \
    jq -r 'select((.title | length > 0) and (.subjects | length > 0) and (.languages | length > 0) and (.isbn_13 | length > 0)) | [.title, (.subjects | join("; ")), (.languages[]?.key // empty | split("/")[2] // empty), (.isbn_13[]? // empty)] | @csv' | \
    sed 's/;/\t/g' > "$output_file"

# Check if any lines were processed
if [ -s "$output_file" ]; then
    # Get the last processed ISBN
    last_processed_isbn=$(tail -n 1 "$output_file" | cut -f4)
    # Save the last processed ISBN to the resume file
    echo "$last_processed_isbn" > "$resume_file"
fi
