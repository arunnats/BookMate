#!/bin/bash

input_file="ol_dump_editions_2024-04-30.txt.gz"
output_file="./out/extracted_data.csv"

delimiter=";"

mkdir -p ./out/

zcat "$input_file" | sed 's/^[^\{]*//' | jq -r 'select((.title | length > 0) and (.subjects | length > 0) and (.languages | length > 0) and (.isbn_13 | length > 0) and any(.subjects[]; . | test("Juvenile Fiction|Short stories|Classics|Fiction|Shakespeare plays, texts|Action|Fantasy|Adventure|Romance|Juvenile Fiction / General"; "i")) and all(.subjects[]; . | index("nonfiction") // empty == null)) | [.title, (.subjects | join("'$delimiter'")), (.languages | map(.key // empty | split("/")[2]) | join("'$delimiter'")), (.isbn_13[0])] | @csv' | sed 's/;/\t/g' >> "$output_file"

echo "Script completed successfully."
