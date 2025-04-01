# Investigation outputs regarding the validation of JSON-LD metadata


While several options exist for validating JSON-LD and other linked data formats, the standard is SHACL ([Shapes Constraint Language](https://www.w3.org/TR/shacl/)). The OceanJSON schema is provided as JSON SChema files and while these can be used for validation are not optimal for JSON-LD and as such following this pattern is probably not the best approach. A comprehensive example of a SHACL file can be seen at `shacl/FE-DCAT-AP-SHACLshapes.ttl`.

A much more simple SHACL file has been created for demo purposes, `shacl/test.shacl`, along with a Python script to use this to validate some sample JSON-LD files. The steps to run the script:

```bash
pip install -r requirements.txt

# A file that passes validation
python validate.py data/valid.jsonld
# and one that doesn't
python validate.py data/invalid.jsonld
```
This will output the validation results to terminal as well as in RDF form in the file `results.ttl`.
