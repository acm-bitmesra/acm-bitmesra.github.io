# ACM BIT Mesra Event Evaluation & Contribution Scoring Engine

---

## 1. Principles of Contribution Evaluation

1. **Independent ACM Event Challenge**:
   - For Hacktoberfest and seasonal developer challenges, ACM BIT Mesra organizes independent chapter challenges.
   - We do **not** claim that raw PR counts equate to official global Hacktoberfest rewards.
2. **Candidate Discovery**:
   - Only students who have registered for the event and connected their GitHub account via the dedicated OAuth linking flow are scanned.
   - We query the public GitHub REST API for candidate pull requests matching the event's configured repository allowlist and date boundaries.
3. **Human-in-the-Loop Moderation**:
   - Candidate pull requests begin in `PENDING` review status.
   - Event managers and moderators inspect metadata (PR title, description, files changed, maintainer approval labels).
   - Decisions: `APPROVED`, `REJECTED`, or `DISQUALIFIED`.
4. **Transparent Score Adjustments**:
   - Any manual score adjustment requires an explicit explanation recorded in the audit log.
5. **Deterministic Leaderboards**:
   - Published standings are snapshotted in `event_leaderboards`.
   - Results are immutable once marked `FINAL` by an authorized event manager.
