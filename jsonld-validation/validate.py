from pathlib import Path
import json
from rdflib import Graph
from pydantic import BaseModel
import pyshacl
from rdflib.plugins.sparql import prepareQuery
import sys

class ValidationResult(BaseModel):
    is_valid: bool
    errors: list[str]

def validate(file_path: Path):
    content = file_path.read_text()
    doc = json.loads(content)

    g = Graph().parse(data=doc, format="json-ld")
    shacl_graph = Graph().parse(data=Path("shacl\\test.shacl").read_text(), format="turtle")

    is_valid, results_graph, _ = pyshacl.validate(
        data_graph=g,
        shacl_graph=shacl_graph,
    )

    errors = []
    result_nodes = [x.node for x in results_graph.query("SELECT ?node where { ?a <http://www.w3.org/ns/shacl#result> ?node }")]
    q = prepareQuery(
        "SELECT ?focusNode ?message where { ?node shacl:focusNode ?focusNode . ?node shacl:resultMessage ?message }",
        initNs={"shacl": "http://www.w3.org/ns/shacl#"},
    )
    for node in result_nodes:
        r = results_graph.query(q, initBindings={"node": node})
        for x in r:
            errors.append(f'"{x.message}" on node "{x.focusNode}"')

    results_graph.serialize("results.ttl")
    return ValidationResult(is_valid=is_valid, errors=errors)


if __name__ == "__main__":
    file_path = sys.argv[1]
    print(validate(Path(file_path)))
