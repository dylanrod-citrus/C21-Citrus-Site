# Privacy Control Manual Validation

The browser-facing privacy controls were reviewed at **375×812**, **768×1024**, and **1244×828** viewports after the footer changes. The long “Do Not Sell or Share My Personal Information” control remained within its legal-and-privacy column without horizontal clipping, and the dedicated “Submit a Privacy Request” path remained separately available.

The technical behavior to verify during final deployment testing is as follows:

| Action | Expected technical result |
| --- | --- |
| Choose **Accept** | The consent preference is stored and optional analytics load. |
| Choose **Decline** or **Do Not Sell or Share** | The denied preference is stored and optional analytics scripts are removed or not loaded. |
| Browser sends `navigator.globalPrivacyControl === true` | The denied preference is stored before optional analytics load. |
| Choose **Submit a Privacy Request** | The visitor reaches the dedicated form for requests to know, delete, correct, opt out, limit, or request non-discrimination. |

This validation documents technical behavior only. Legal applicability, policy disclosures, data mapping, vendor contracts, retention requirements, and consumer-rights operations require qualified privacy counsel review.
