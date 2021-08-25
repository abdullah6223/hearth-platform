# Validates whether generated schema.ts file is up to date with actual GraphQL API
# Renames original schema.ts file, generates a new one, compares and rolls changes back

mv apps/hearth/schema.ts apps/hearth/schema.temp.ts
yarn workspace @app/hearth maketypes
FILES_ARE_IDENTICAL="$(cmp --silent -- "apps/hearth/schema.ts" "apps/hearth/schema.temp.ts"; echo $?)"
if [[ $FILES_ARE_IDENTICAL -ne 0 ]]; then
  git diff --no-index apps/hearth/schema.temp.ts apps/hearth/schema.ts
  rm apps/hearth/schema.ts
  mv apps/hearth/schema.temp.ts apps/hearth/schema.ts
  echo "Error: Outdated schema.ts file! Please execute `maketypes` script and commit changes"
  exit 1
else
  rm apps/hearth/schema.ts
  mv apps/hearth/schema.temp.ts apps/hearth/schema.ts
  echo "schema.ts file is up to date"
fi
