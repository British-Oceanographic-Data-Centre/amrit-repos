# Passport Request System

## ClickUp Tickets

- [ClickUp Ticket 1](https://app.clickup.com/t/86989z52j)
- [ClickUp Ticket 2](https://app.clickup.com/t/86989z6e9)
- [ClickUp Ticket 3](https://app.clickup.com/t/86989z730)
- [ClickUp Ticket 4](https://app.clickup.com/t/86989z756)
- [ClickUp Ticket 5](https://app.clickup.com/t/86989z78d)
- [ClickUp Ticket 6](https://app.clickup.com/t/86989z7gd)
- [ClickUp Ticket 7](https://app.clickup.com/t/86989z7xc)
- [ClickUp Ticket 8](https://app.clickup.com/t/86989z8n6)
- [ClickUp Ticket 9](https://app.clickup.com/t/86989zfy9)


## Passport Request Rules

- Allow vocab generation without barriers for Ship, Sensor models, Platform models, and Programs.
- As long as one vocab is still pending validation, then the passport is also in a "Pending validation" status.
- This status is also applied to passports if any key metadata required for passport are missing.

## Schema Changes

### Mission
- **passportStatus** (enum: "Not requested", "Pending validation", "Approved", "Rejected")
- **passportRequestDate** (date) - Date WIGOS-ID is temporarily attributed to Ptf
- **passportApplicant** (contact)

### Ship, Sensor Model, Program, and Platform Model
- **validated** (boolean) - Indicates whether the vocab has been validated.

## Automatic Passport Rejection
- If a mission has missing or unvalidated key attributes, the passport application is automatically declined after six months and WIGOS-ID is removed from the mission.

## Alerts & Notifications

### Notifications to System Admins
- When a new vocab needs validation.
- 60 days and 40 days before a platform pending validation with unvalidated vocab is to be rejected.

### Notifications to Passport Applicants
- When they submit a platform application with unknown vocab pending validation.
- When they submit vocab that requires additional details before validation.
- 30 and 10 days before their platform application is to be rejected.
- When a vocab they requested is rejected, approved, or transferred to existing vocab.

## User Interface (UI) Development

- Develop a UI to show vocab pending validation in each of the 4 classes.
- Develop a GUI for admins to handle validations efficiently:
  - Quickly check for similar existing items.
  - Approve, reject, transfer buttons.
  - Contact user button with pre-written message options.
- External users can log in to complete missing vocab information (e.g., if an unknown sensor model name was force submitted for a platform, the user can provide a description and details here).

## User Journey

1. **Pre-submission Validation**
   - User's machine validates request and returns errors, unknown vocab, and suggestions.
   - User chooses to either change unknown vocab and try again or force submission of unknown vocab.
2. **Temporary WIGOS-ID Assignment**
   - The machine adds the permission record and delivers a WIGOS-ID on a temporary basis.
   - If all requirements are met, the passport is automatically approved.
   - If unknown vocab is present, the passport status is set to "Pending validation."
3. **Admin Notifications & Processing**
   - Admins receive notifications for vocab pending validation.
   - They connect to the GUI to manage validations.
4. **User Updates**
   - Users receive notifications on passport updates and vocab validations.

## Existing Workflow for platform submission (Mermaid Diagram)
```mermaid
graph LR
    subgraph User
        R[User Submits Draft Mission Request via Dashboard]
        Q[User's program submits Draft Mission Request]
        P[User retrieves new WIGOS-ID and maps it to their Internal ID]
        A[User Submits Mission Passport Request]
        B[Uploads File prepared by User]
        E[Checks and submits each record, makes required changes - Manual Task]
        J[Views updates metadata in Dashboard]
        N[User Receives Passport]
        F[Contacts OceanOPS staff]
        V[Contacts OceanOPS staff]
    end
    
    subgraph OceanOPS System
        U{Valid Deployment, Program, User rights?}
        O[OceanOPS API ID saves record and delivers WIGOS-ID]
        H[Dashboard API parses file, validating format and content]
        S[Dashboard API stores metadata in Database]
        K{Approved?}
        L[Error message returned]
        M[Mission Passport Issued]
    end

    subgraph OceanOPS Staff
        D[Receives confirmation email]
        T[Adapts file, debugs system, submits the file for user]
        W[Gives users rights, creates programs]
    end

    R -->|Form Submission| U
    Q -->|API Request| U
    U -- Yes --> O
    U -- No --> V
    V --> W
    O --> P
    P --> A
    P --> B
    A -->|Form Submission| S
    H --> E
    B -->|File Upload| H
    S -->|Triggers Dashboard Update| J
    J --> D
    E -->|Issues Found?| F
    F --> T
    E -->|Confirms update| K
    K -- No --> L
    K -- Yes --> M
    M -->|QR Code Available| N
```

## Future Workflow (Mermaid Diagram)
```mermaid
graph TD
  subgraph User
    A1[Submit Platform Passport Request]
    A2{Validation Check}
    A3[Change vocab and resubmit]
    A4[Force Submit with Unknown Vocab]
    A5[Receive temporary WIGOS ID]
    A6[Receive Notifications on Status Changes]
  end

  subgraph System
    B1[Check for Validation Errors]
    B2{Is vocab known?}
    B3[Auto Approve if all valid]
    B4[Set Passport to Pending Validation]
    B5[Send Notification to Admins]
    B6[Schedule Automated Checks]
    B7{After 6 Months: Key Fields Validated?}
    B8[Reject Passport and Remove WIGOS ID]
  end

  subgraph Admin
    C1[Review Pending Validations]
    C2[Approve, Reject, or Transfer Vocab]
    C3[Send Custom Messages to Users]
    C4[Resolve Passport Validation]
  end

  A1 -->|Submit| B1
  B1 -->|Errors Found| A2
  A2 -->|User Updates Vocab| A3 --> A1
  A2 -->|User Forces Submission| A4 --> B4
  B1 -->|No Errors, All Vocab Validated| B3 --> A5
  B2 -->|No| B4 --> B5
  B2 -->|Yes| B3
  B5 --> C1
  C1 -->|Admin Approves| C2 --> B3
  C1 -->|Admin Rejects| C2 --> B8
  B6 -->|Check every 30 days| B7
  B7 -->|No| B8 --> A6
  B7 -->|Yes| C4 --> A6
```

