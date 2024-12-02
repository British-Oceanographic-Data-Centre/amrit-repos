# Making AMRIT FAIR
This file is the repot on how we can make AMRIT software FAIR.


## workflow 
```mermaid
graph TD;
  Start --> |Do you have access to the AMRIT github space?| AccessCheck
  AccessCheck --> |YES| LicenseCheck
  AccessCheck --> |NO| RequestAccess
  RequestAccess --> AccessCheck
  LicenseCheck --> |YES| OpenSourceCheck
  LicenseCheck --> |NO| AmritLicense
  AmritLicense --> |Is suitable for open source software| |YES| CreateRepo
  CreateRepo --> AddLicense
  AddLicense --> AddReadme
  AddReadme --> AddCodeOfConduct
  AddCodeOfConduct --> AddCitation
  AddCitation --> AddLanguageFile
  AddLanguageFile --> WriteCode
  WriteCode -.-> PushCode
  PushCode --> TestCheck
  TestCheck --> |YES| LintingCheck
  TestCheck --> |NO| AddTests
  AddTests --> PushCode
  LintingCheck --> |YES| TestPass
  LintingCheck --> |NO| FixCode
  FixCode --> PushCode
  TestPass --> |YES| CitationCheck
  TestPass --> |NO| FixCode
  CitationCheck --> |YES| CodeCommitted
  CitationCheck --> |NO| UpdateCitation
  UpdateCitation --> PushCode
  CodeCommitted -.-> PublishRelease
  PublishRelease --> BreakingChange
  BreakingChange --> |YES| MajorVersion
  BreakingChange --> |NO| BugFix
  BugFix --> |YES| PatchVersion
  BugFix --> |NO| MinorVersion
  MajorVersion --> SendToZendo
  PatchVersion --> SendToZendo
  MinorVersion --> SoftwareHeritage
  SoftwareHeritage -.-> SendToZendo
```

## Intro

There are a few steps that need to be taken to make software FAIR. some thsese are not directly related to software and are more extras that need to be include into the software life cycle. 

The web cotains alot of optiuins and articales on how to _do_ FAIR software, mostly in terms of Research Software. I have listed the parts required to get the highest 'score'. 
 - public GitHub (or GitLab)
 - readme
 - licence file
 - codemeta.json
 - pom.xml (java only)
 - pyproject.toml (python only)
 - packages.json/packages-lock.json (JavaScript only)
 - Documentation that links all the parts of Amrit together
    - This should be written in a machine-readable way, ideally sematic 


### notes
We might be required to repeat some of the information. FAIR in software is still in the early days, and the networks (citation, repos, publishers) have not finalised the pathways for information flows. for example, the pom/project will have duplicate information from the codemeta.json file and citations files. for now, this is just the state of play and we will need to accept it. ,

