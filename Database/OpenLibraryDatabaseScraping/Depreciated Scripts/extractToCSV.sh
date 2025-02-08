#!/bin/bash

input_file="ol_dump_editions_2024-04-30.txt.gz"
temp_file="./out/last_processed_isbn.txt"
output_file="./out/extracted_data.csv"

# Delimiter for subjects
delimiter=";"

# Function to handle script interruption
cleanup() 
{
    last_processed=$(tail -n 2 "$output_file" | sed -n '1{s/.*"\([^"]*\)"$/\1/p}')
    echo "$last_processed" > "$temp_file"
    
    # Remove the last line from the output file
    sed -i '$d' "$output_file"

    echo "Script interrupted. Last processed ISBN saved."
    exit 1
}


# Trap interruption signal (Ctrl+C) and call the cleanup function
trap cleanup SIGINT

mkdir -p ./out/

# Check if the output file exists
if [ ! -f "$output_file" ]; then
    # If the output file doesn't exist, start processing from the beginning
    zcat "$input_file" | sed 's/^[^\{]*//' | jq -r 'select((.title | length > 0) and (.subjects | length > 0) and (.languages | length > 0) and (.isbn_13 | length > 0) and any(.subjects[]; . | test("Juvenile Fiction|Short stories|Classics|Fiction|Shakespeare plays, texts|Juvenile Fiction / General"; "i"))) | [.title, (.subjects | join("'$delimiter'")), (.languages[]?.key // empty | split("/")[2] // empty), (.isbn_13[]? // empty)] | @csv' | sed 's/;/\t/g' > "$output_file"
else
    # Read the last processed ISBN from the temporary file
    if [ -f "$temp_file" ]; then
        last_isbn=$(cat "$temp_file")
        echo "Resuming from ISBN: $last_isbn"

        # Continue processing from the line after the last processed ISBN
        zcat "$input_file" | sed "/$last_isbn/Q" | sed 's/^[^\{]*//' | jq -r 'select((.title | length > 0) and (.subjects | length > 0) and (.languages | length > 0) and (.isbn_13 | length > 0) and any(.subjects[]; . | test("Juvenile Fiction|Short stories|Classics|Fiction|Shakespeare plays, texts|Juvenile Fiction / General"; "i"))) | [.title, (.subjects | join("'$delimiter'")), (.languages[]?.key // empty | split("/")[2] // empty), (.isbn_13[]? // empty)] | @csv' | sed 's/;/\t/g' >> "$output_file"
    else
        echo "No temporary file found. Starting from the beginning."
        zcat "$input_file" | sed 's/^[^\{]*//' | jq -r 'select((.title | length > 0) and (.subjects | length > 0) and (.languages | length > 0) and (.isbn_13 | length > 0) and any(.subjects[]; . | test("Juvenile Fiction|Short stories|Classics|Fiction|Shakespeare plays, texts|Action|Fantasy|Adventure|Romance|Juvenile Fiction / General"; "i"))) | [.title, (.subjects | join("'$delimiter'")), (.languages[]?.key // empty | split("/")[2] // empty), (.isbn_13[]? // empty)] | @csv' | sed 's/;/\t/g' > "$output_file"
    fi
fi

# Store the last processed ISBN in the temporary file
last_processed=$(tail -n 1 "$output_file" | cut -d $'\t' -f 4)
echo "$last_processed" > "$temp_file"
echo "Script completed successfully."
