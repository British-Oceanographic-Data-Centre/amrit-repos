# OceanJSON Schemas

A comprehensive JSON standard for operational oceanography data management.
Integrated GOOS metadata JSON schemas based on the <a target="_blank" href="https://www.ocean-ops.org/meta/">OceanMeta</a> metadata standard.

In operational oceanography, sharing data effectively is essential to improving our understanding of the ocean. To achieve this, the AMRIT project is introducing a standardized JSON format for platform metadata and data. This initiative will ensure data is easily shared, validated, and used by the global oceanographic community. This page explains the purpose, technology, and examples of our approach, designed for both technical and non-technical users.

---

## Why We Need a Standardized Format

Our initiative addresses three specific needs:

### 1. **Submitting Metadata (Input)**
Agencies and organizations worldwide submit metadata to describe their platforms, such as floats or buoys. Ensuring this metadata is accurate, complete, and consistent is critical for:
- Maintaining data quality.
- Reducing errors during ingestion.
- Simplifying the validation process.

### 2. **Retrieving Metadata (Output)**
AMRIT makes this metadata available via APIs for use in:
- AMRIT applications.
- Other organizations' systems and dashboards.

By standardizing the output format, we ensure:
- Interoperability with other tools and applications.
- Easy integration into workflows across the community.

### 3. **Exposing Metadata for Discovery (Harvesting)**
To enhance global collaboration, we expose our metadata for harvesting by initiatives like the Ocean Data Information System (ODIS). This ensures:
- Discoverability of data across platforms.
- Traceability of metadata origins, providing acknowledgement and transparency about where the data came from and how it has been processed.

---

## The Technology Behind Our Standard

To meet these needs, we use two complementary technologies: **JSON Schema** and **JSON-LD**. Together, they provide both structure and semantic meaning to our data.

### JSON Schema
JSON Schema is a powerful tool that:
- Defines the structure of data.
- Ensures data is valid and complete by enforcing rules (e.g., required fields, valid formats).
- Supports interoperability by creating a clear and consistent blueprint for data.

**Example Use Case:**
When an organization submits metadata about a buoy, JSON Schema ensures fields like `platform_id` and `name` are correctly filled out and properly formatted.

### JSON-LD
JSON-LD (Linked Data) adds semantic meaning to our data, enabling it to be easily understood and linked to other datasets. Key features include:
- **@context:** Provides mappings to standard vocabularies (e.g., Schema.org, PROV).
- **@type:** Identifies the type of data (e.g., Platform, Sensor).
- **@id:** Provides unique identifiers for resources, making them discoverable globally.

**Example Use Case:**
Exposing metadata to ODIS with JSON-LD enables machines to understand the relationships between platforms, sensors, and their origins, improving discoverability.

---

## Stakeholders

By adopting a standardized JSON format, AMRIT aims to enhance data sharing, quality, and discoverability. This initiative will directly benefit:

- **Researchers**, by providing high-quality, interoperable data for analysis and innovation.
- **Agencies**, by streamlining metadata submission and retrieval processes, ensuring compliance with global standards.
- **Software Developers**, by offering a structured, semantic format that simplifies integration into applications.

Using JSON Schema for validation and JSON-LD for semantic enrichment ensures our data is robust, interoperable, and future-proof. We invite all stakeholders to collaborate with us in implementing this standard to improve the global oceanographic data ecosystem.

---

## Development Strategy

Our strategy for development focuses on an iterative approach to meet the three core use cases: input, output, and discoverability. Here is how we plan to proceed:

1. **Proof of Concept (POC) Services**:
   - **Input Validation Application**: A simple application that validates metadata submissions using a basic version of the JSON Schema.
   - **API Service**: A minimal API that allows metadata retrieval in the standardized JSON format.
   - **Discoverability/Exposure Service**: For this use case, we plan to create an ODIS-compatible metadata export service. This service will demonstrate how metadata can be exposed for harvesting and discovery by other systems.

2. **Incremental Improvement Through Feedback**:
   - We will gather feedback on these POCs from stakeholders and the community.
   - Based on this feedback, we will refine the JSON Schema, adapt the applications, and introduce new fields as needed.

3. **SCRUM Sprints**:
   - Development will proceed in short, focused sprints to ensure continuous delivery and improvement.
   - Each sprint will focus on incremental enhancements to one or more of the services.
   - Stakeholder feedback will guide prioritization and ensure the schema evolves to meet real-world needs.

4. **Gradual Expansion**:
   - New fields and features will be introduced gradually to ensure backward compatibility and minimize disruption.

---

## Community Development

The OceanJSON project is actively developed and maintained on GitHub.

We encourage contributions from the community! Here's how you can help:

- **Raise Issues:** Found a bug or have a suggestion? Please raise an issue on our [AMRIT GitHub Repository](https://github.com/British-Oceanographic-Data-Centre/amrit-repos)
- **Contribute:** Fork the repository, make changes, and submit a pull request!

The current version is `0.0.1` and is still a draft and has not been officially published yet. 
