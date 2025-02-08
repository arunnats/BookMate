zcat ol_dump_editions_2024-04-30.txt.gz | sed 's/^[^\{]*//' | head -n 5 | jq -r '["title", "subjects", "languages", "isbn"], [.title, (.subjects[]? // empty), (.languages[]? | .key // empty), (.isbn_13[]? // empty)] | @csv' > extracted_data.csv

zcat ol_dump_editions_2024-04-30.txt.gz | sed 's/^[^\{]*//' | head -n 5 | jq -r 'select((.title | length > 0) and (.subjects | length > 0) and (.languages | length > 0) and (.isbn_13 | length > 0)) | [.title, (.subjects | join("; ") // empty), (.languages[]?.key // empty), (.isbn_13[]? // empty)] | @csv' | sed 's/,/","/g;s/^/"/;s/$/"/' > extracted_data.csv

zcat ol_dump_editions_2024-04-30.txt.gz | head -n 10 | > out.txt


zcat ol_dump_editions_2024-04-30.txt.gz | sed 's/^[^\{]*//' | head -n 5 | jq -r '"title,language,subjects,isbn", [.title, (.languages[]? | .key // empty), (.subjects | map(.) | join(";")), (.isbn_13[]? // empty)] | @csv' > extracted_data.csv
