# Trust Lens

# Master Website Development Prompt — SATYA IMMUNE X
## Project Title
**SATYA IMMUNE X**
### Subtitle
**Disaster Information Intelligence & Human Resilience Platform**
---
## 1. Project Overview
Build a professional, responsive, accessible web application called **SATYA IMMUNE X**.
SATYA IMMUNE X is an AI-assisted disaster information intelligence platform designed initially for **flood and landslide events**. Its purpose is not simply to label social-media posts as "fake" or "real." Instead, the platform analyzes disaster-related information at the **event and claim level**, compares available evidence, estimates information risk and potential impact, explains why a claim may be unreliable, and helps users develop stronger misinformation-recognition skills through personalized prebunking.
The platform is intended as a **final-year engineering/research project** with future integration of:
* AI/ML
* Natural Language Processing
* Multi-source evidence analysis
* Geospatial and temporal reasoning
* IoT environmental sensors
* Edge computing
* FPGA/VLSI-based anomaly processing
The first version of the website should focus primarily on the **software architecture and user experience**. Do not make the website dependent on IoT or FPGA functionality yet. Those should appear as future/optional modules in the interface.
---
# 2. Core Problem
During floods and landslides, large amounts of information spread rapidly through social media, news, messaging platforms, and public sources.
Examples include:
* false evacuation announcements
* old disaster photographs presented as current
* incorrect locations
* exaggerated casualty reports
* fake government announcements
* false road-closure information
* fabricated rescue information
* misleading weather or disaster predictions
* emotionally manipulative posts
* legitimate information taken out of context
A simple "Fake / Real" classifier is insufficient because disaster information changes rapidly and the same claim may be true at one point and outdated later.
SATYA IMMUNE X therefore works around:
**Event → Claim → Evidence → Risk → Explanation → Human Resilience**
---
# 3. Main Workflow
The website architecture must represent this workflow:
```text
Public Information
       ↓
Data Ingestion
       ↓
Disaster/Event Detection
       ↓
Flood / Landslide Classification
       ↓
Claim Extraction
       ↓
Location + Time Extraction
       ↓
Claim Clustering
       ↓
Duplicate/Redundant Information Filtering
       ↓
Evidence Retrieval
       ↓
Source Analysis
       ↓
Temporal + Geographic Consistency
       ↓
Manipulation Signal Analysis
       ↓
Risk × Impact × Propagation
       ↓
Priority Assessment
       ↓
Explainable Result
       ↓
Adaptive Prebunking
       ↓
User Retesting
       ↓
Resilience Profile
```
The website should visually communicate this workflow without overwhelming the user.
---
# 4. Important Product Philosophy
The interface must NOT make SATYA IMMUNE X look like a generic "fake news detector."
Avoid presenting every result simply as:
> TRUE
or
> FALSE
Instead use more responsible classifications such as:
* **Supported**
* **Contradicted**
* **Insufficient Evidence**
* **Needs Verification**
* **High Information Risk**
Every result should show:
* confidence
* evidence quality
* last verification time
* relevant sources
* explanation
* potential impact
The system should communicate uncertainty rather than pretending that AI is always correct.
---
# 5. Target Users
Design the interface for several possible users:
### General Public
People who want to check whether a disaster-related claim is trustworthy.
### Students/Researchers
Users who want to explore disaster-information patterns.
### Emergency/Information Analysts
Users who need to identify high-priority claims.
### Project Demonstrators
Faculty, judges, researchers, and hackathon evaluators who need to understand the system quickly.
The interface must therefore be understandable even to someone who has never used an AI misinformation-analysis system.
---
# 6. Design Language
Use a **clean, professional, modern dashboard design**.
The visual identity should communicate:
* trust
* safety
* reliability
* technology
* emergency awareness
* clarity
Do NOT make the interface look like:
* a gaming dashboard
* a cryptocurrency dashboard
* a cyber-security "hacker" interface
* an overly futuristic sci-fi interface
Use restrained visual hierarchy.
### Color philosophy
Use a neutral/light interface as the default.
Use semantic colors only where appropriate:
* Green → supported / low concern
* Amber → needs verification / uncertain
* Red → high risk / critical
* Blue → neutral information
* Gray → inactive/unknown
Do not use excessive gradients.
Avoid excessive glassmorphism.
Avoid excessive neon colors.
---
# 7. Animation Requirements
Use **minimal animations only**.
Animations should communicate system state, not decorate the interface.
Acceptable:
* subtle page transitions
* loading indicators
* progress bars
* small status transitions
* gentle notification appearance
* map marker updates
* expandable cards
Avoid:
* constantly moving backgrounds
* particle effects
* excessive glowing
* large animated illustrations
* spinning objects
* animated text everywhere
* parallax effects
The application should remain fast and usable on low-end devices.
---
# 8. Main Navigation
Create a simple sidebar or top navigation containing:
1. **Dashboard**
2. **Events**
3. **Claim Analysis**
4. **Evidence**
5. **Resilience**
6. **Analytics**
7. **About SATYA IMMUNE**
If appropriate, include:
**Settings**
Keep navigation obvious and uncluttered.
---
# 9. Dashboard Page
The Dashboard is the main landing page after login.
### Header
Display:
**SATYA IMMUNE X**
**Disaster Information Intelligence & Human Resilience**
Include a short status:
> Monitoring flood and landslide information
---
## Dashboard statistics
Display simple cards:
### Active Events
Example:
**03**
### High-Priority Claims
**08**
### Claims Requiring Verification
**21**
### Sources Analyzed
**142**
Do not use exaggerated statistics unless data exists. During development, clearly mark mock/demo data.
---
## Active Events
Display event cards such as:
### 🌊 Flood — Assam
Status:
**Developing**
Risk:
**High**
Location:
**Dibrugarh**
Last updated:
**12 minutes ago**
Button:
**View Event**
---
### 🏔 Landslide — Assam
Status:
**Monitoring**
Risk:
**Medium**
Location:
**Dima Hasao**
Button:
**View Event**
---
# 10. Event Detail Page
When the user opens an event, show a clear event overview.
Example:
**Flood Event #1042**
Location:
**Dibrugarh, Assam**
Event type:
**Flood**
Status:
**Developing**
Information risk:
**High**
---
## Event timeline
Create a simple vertical timeline:
```text
08:00
Heavy rainfall reports appear
09:15
Flood-related claims increase
10:05
Environmental anomaly detected
11:20
Official warning published
12:10
False evacuation claim begins spreading
```
The timeline is important because disaster information changes over time.
---
## Event map
Include a simple map placeholder/component.
Show:
* event location
* relevant evidence locations
* sensor locations when IoT is later enabled
Do not make the map visually complicated.
---
# 11. Claim Analysis Page
This is one of the most important pages.
Provide a simple input box:
### "Enter a disaster-related claim"
Example:
> "NH-27 is completely blocked because of a landslide."
Button:
**Analyze Claim**
Initially the website can use mock backend responses.
Later this button will call the ML/backend API.
---
# 12. Claim Analysis Result
Display:
### Claim
> NH-27 is completely blocked because of a landslide.
### Disaster Type
**Landslide**
### Location
**NH-27**
### Status
**Needs Verification**
### Information Risk
**High**
### Potential Impact
**High**
### Confidence
**78%**
---
## Why this result?
Show short, understandable explanations:
* Supporting authoritative evidence is currently limited.
* Multiple social reports mention the same claim.
* The location is relevant to a known landslide event.
* The claim contains strong certainty language.
* Current evidence does not fully confirm complete road blockage.
Do not show technical ML terminology unless the user requests details.
---
# 13. Evidence Section
Create an evidence panel.
Organize evidence into categories:
### Official Sources
Status:
✓ Supporting
### News Sources
Status:
⚠ Partially supporting
### Public/Social Sources
Status:
⚠ Conflicting
### Environmental Sensors
Status:
— Not available
When IoT is integrated later, environmental sensor information will appear automatically.
---
# 14. Evidence Comparison
Use a simple table:
| Evidence        | Type     | Relation    | Reliability Signal |
| --------------- | -------- | ----------- | ------------------ |
| Official report | Official | Supports    | High               |
| News report     | News     | Supports    | Medium             |
| Social post     | Social   | Contradicts | Low                |
| Sensor event    | IoT      | Supports    | High               |
Do not display arbitrary reliability scores unless they are backed by the system.
---
# 15. Misinformation DNA
Create a visual section called:
### Information Manipulation Signals
Show horizontal bars or simple indicators.
Example:
```text
Artificial urgency       ████████░░  82%
Fake authority            ██████░░░░  61%
Emotional language        █████░░░░░  52%
Evidence conflict         █████████░  91%
Context inconsistency     ███████░░░  73%
```
Use this to explain *why* the system considers information risky.
Do not call these values scientifically validated unless the backend actually produces them.
---
# 16. Claim-Evidence Relationship
Create a simple visual relationship:
```text
CLAIM
  │
  ├── Official source → Supports
  │
  ├── News report → Supports
  │
  ├── Social report → Contradicts
  │
  └── IoT observation → Supports
```
This can initially be a static/mock visualization.
Later connect it to the real evidence graph.
---
# 17. Risk & Priority
Create a section:
### Priority Assessment
Display:
**Risk: HIGH**
**Impact: CRITICAL**
**Propagation: RAPID**
**Priority: 92/100**
But make it clear that these values are system-generated estimates.
Use a simple visual hierarchy rather than a complicated gauge.
---
# 18. Resilience Page
Create a separate page called:
### My Information Resilience
Explain:
> SATYA IMMUNE evaluates how well you recognize common misinformation patterns and provides personalized training.
Show categories:
```text
Source Verification       78%
Context Checking          52%
Fake Authority Detection  86%
Location Verification     61%
Urgency Detection         91%
```
Use simple progress bars.
---
# 19. Adaptive Prebunking
Display:
### Recommended Training
Example:
> Your current results suggest that you need more practice identifying information taken out of context.
Button:
**Start 2-Minute Training**
The training should contain:
* short explanation
* example
* question
* answer
* explanation
Keep the interface simple.
---
# 20. Retesting
After training:
### Quick Test
Show several disaster-information examples.
The user chooses:
* Supported
* Misleading
* Needs Verification
Then show:
### Improvement
```text
Before training: 54%
After training: 78%
Improvement: +24%
```
Use this only when real test data exists. Otherwise label it as demonstration data.
---
# 21. Analytics Page
Create an analytics dashboard for researchers/project administrators.
Include:
### Model Performance
* Accuracy
* Precision
* Recall
* F1-score
### Claim Statistics
* Flood claims
* Landslide claims
* Supported
* Contradicted
* Insufficient evidence
### Risk Distribution
* Low
* Medium
* High
* Critical
### User Resilience
* Pre-test average
* Post-test average
* Improvement
Use simple charts.
Avoid excessive charts.
---
# 22. IoT Integration Section
Include an optional section called:
### Environmental Evidence
Initially display:
> **IoT integration coming in Phase 2**
Later show:
```text
Rainfall
████████░░ HIGH
Water Level
█████████░ HIGH
Soil Moisture
███████░░░ MEDIUM
Ground Tilt
██░░░░░░░░ NORMAL
```
The website should be designed so that IoT data can be added later without redesigning the entire UI.
---
# 23. FPGA/Edge Computing Section
Do not make FPGA a major user-facing feature.
Instead, include technical information in the Analytics/System page:
### Edge Processing
**Status: Prototype**
Display:
* sensor processing latency
* CPU latency
* FPGA latency
* FPGA resource utilization
This section is mainly for technical evaluators.
---
# 24. About Page
Explain the project in simple language.
### What is SATYA IMMUNE X?
> SATYA IMMUNE X is an AI-assisted disaster information intelligence platform designed to help identify, assess, and explain potentially misleading information during floods and landslides.
### How it works
```text
Information
↓
Event Detection
↓
Claim Analysis
↓
Evidence
↓
Risk Assessment
↓
Explanation
↓
User Resilience
```
---
# 25. Technical Architecture Page
Include a simplified architecture diagram:
```text
Public Information
        ↓
Data Ingestion
        ↓
Event Detection
        ↓
Claim Engine
        ↓
Evidence Engine
        ↓
Risk Engine
        ↓
Explanation
        ↓
Resilience Engine
        ↓
Dashboard
```
Add optional:
```text
IoT → Edge/FPGA → Environmental Evidence
```
Do not expose unnecessary implementation details to normal users.
---
# 26. Backend Readiness
The frontend must be designed so it can later connect to a backend.
Use a clean API-oriented architecture.
Possible future endpoints:
```text
POST /api/analyze
GET  /api/events
GET  /api/events/{id}
GET  /api/claims
GET  /api/claims/{id}
GET  /api/evidence/{claim_id}
GET  /api/resilience/{user_id}
POST /api/prebunk
POST /api/test
GET  /api/analytics
```
Do not hard-code the UI around fake values.
Use mock JSON objects during the prototype.
---
# 27. Data Model Awareness
Design the frontend around these core entities:
```text
Event
Claim
Post
Evidence
Source
RiskAssessment
User
Intervention
SensorEvent
```
Relationships:
```text
Event
 ├── Claims
 │     ├── Posts
 │     └── Evidence
 │
 └── Sensor Events
User
 ├── Tests
 ├── Interventions
 └── Resilience Profile
```
---
# 28. Accessibility Requirements
The interface should be usable by non-technical users.
Requirements:
* readable typography
* strong text/background contrast
* clear labels
* icons accompanied by text
* keyboard-friendly controls
* responsive layout
* mobile-friendly design
* no information conveyed by color alone
* clear error messages
* simple language
* avoid unnecessary technical terminology
The application should remain understandable to someone who does not know AI or VLSI.
---
# 29. Responsive Design
The website must work on:
* desktop
* laptop
* tablet
* mobile
Desktop should prioritize the dashboard.
Mobile should prioritize:
1. Active event
2. Claim analysis
3. Risk
4. Evidence
5. Explanation
Avoid overly wide tables on mobile.
Use cards or horizontal scrolling where necessary.
---
# 30. Demo Mode
Because the ML/backend will not initially be available, create a **Demo Mode**.
Demo Mode should use clearly labeled simulated data.
Example:
> **DEMO DATA — Not a live emergency service**
This disclaimer must be visible but unobtrusive.
Never imply that the prototype is providing real emergency instructions.
---
# 31. Safety and Responsibility
SATYA IMMUNE X is an information-analysis and resilience platform, not an emergency authority.
Never display:
> "EVACUATE NOW"
as an autonomous instruction.
Instead use:
> "This claim indicates a possible evacuation announcement. Verify with the relevant official authority."
The system must clearly distinguish:
**AI assessment**
from
**official emergency information.**
---
# 32. Visual Style
Use:
* clean cards
* rounded but restrained components
* generous whitespace
* clear headings
* simple icons
* subtle borders
* accessible typography
* consistent spacing
* minimal shadows
* minimal animation
Overall impression:
**Professional + trustworthy + academic + modern + easy to use**
Avoid:
* excessive futuristic graphics
* neon
* excessive gradients
* unnecessary animations
* cluttered dashboards
* tiny text
* excessive statistics
---
# 33. Technology Recommendation
For the first working prototype:
### Frontend
**React + TypeScript** if building a production-style web application.
Alternatively:
**Streamlit** for the fastest ML research prototype.
### Backend
**Python + FastAPI**
### ML
**Python + scikit-learn initially**
Later:
**PyTorch / Transformer-based NLP models**
### Database
**PostgreSQL**
### Vector search
Later:
**pgvector or FAISS**
### IoT
**ESP32 + MQTT**
### FPGA
**Verilog + available FPGA development board**
Do not implement all of these immediately.
---
# 34. Development Priority
Build the website in this order:
### Phase 1 — UI prototype
* Dashboard
* Events
* Claim Analysis
* Evidence
* Resilience
* About
Use mock data.
### Phase 2 — Dataset
Build the flood/landslide dataset.
### Phase 3 — ML
Implement:
* disaster classification
* claim extraction
* manipulation detection
### Phase 4 — Backend
Connect ML models through APIs.
### Phase 5 — Evidence Engine
Implement:
* source analysis
* evidence comparison
* temporal consistency
* geographic consistency
### Phase 6 — Risk Engine
Implement:
* risk
* impact
* propagation
* priority
### Phase 7 — Human Resilience
Implement:
* pre-test
* user profile
* personalized prebunking
* post-test
### Phase 8 — Real Data
Add legitimate/permitted public data sources.
### Phase 9 — IoT
Add environmental sensor evidence.
### Phase 10 — FPGA
Add edge anomaly detection and benchmark it.
---
# 35. Most Important UI Principle
The website should answer four questions immediately:
### 1. What is happening?
**Active disaster events**
### 2. What information is spreading?
**Claims**
### 3. Can I trust it?
**Evidence + risk + explanation**
### 4. What can I learn?
**Personalized resilience training**
If a user can understand these four things within a few seconds, the interface is successful.
---
# 36. Final Product Identity
The website should communicate this concept:
> **SATYA IMMUNE X does not simply tell people what to believe. It helps them understand information, evidence, uncertainty, and risk so they can make better decisions during disasters.**
Build the interface around this principle.
---
## Final requirement
Create the first version as a **functional frontend prototype with mock data**, not as a fake fully operational AI system.
The architecture must be **backend-ready**, modular, responsive, accessible, and easy to extend.
Do not over-engineer the first version.
The first milestone is:
**Dashboard → Select Event → Select Claim → Analyze → View Evidence → View Risk → View Explanation → Take Resilience Test**
Everything else should be built incrementally.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://trust-aid-nexus.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/217398b7-b87f-4ef5-b024-a804fb7d5831).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
