# {{provider}}

## Integration Benefits

TODO: Iterate the benefits of ingesting data from the provider into JupiterOne.
Consider the following examples:

- Visualize {{provider}} services, teams, and users in the JupiterOne graph.
- Map {{provider}} users to employees in your JupiterOne account.
- Monitor changes to {{provider}} users using JupiterOne alerts.

## How it Works

TODO: Iterate significant activities the integration enables. Consider the
following examples:

- JupiterOne periodically fetches services, teams, and users from {{provider}}
  to update the graph.
- Write JupiterOne queries to review and monitor updates to the graph, or
  leverage existing queries.
- Configure alerts to take action when JupiterOne graph changes, or leverage
  existing alerts.

## Prerequisites

TODO: Iterate requirements for setting up the integration. Consider the
following examples:

- {{provider}} supports the OAuth2 Client Credential flow. You must have a
  Administrator user account.
- JupiterOne requires a REST API key. You need permission to create a user in
  {{provider}} that is used to obtain the API key.
- You must have permission in JupiterOne to install new integrations.

## Support

If you need help with this integration, contact
[JupiterOne Support](https://support.jupiterone.io).

## How to Use This Integration

### In {{provider}}

TODO: List specific actions that must be taken in the provider. Remove this
section when there are no actions to take in the provider.

1. [Generate a REST API key](https://example.com/docs/generating-api-keys)

### In JupiterOne

TODO: List specific actions that the user must take in JupiterOne. Many of the
following steps will be reusable; take care to be sure they remain accurate.

1. From the top navigation of the J1 Search homepage, select **Integrations**.
2. Scroll down to **{{provider}}** and click it.
3. Click **Add Configuration** and configure the following settings:

- Enter the account name by which you want to identify this {{provider}} account
  in JupiterOne. Select **Tag with Account Name** to store this value in
  `tag.AccountName` of the ingested assets.
- Enter a description to help your team identify the integration.
- Select a polling interval that is sufficient for your monitoring requirements.
  You can leave this as `DISABLED` and manually execute the integration.
- {{additional provider-specific settings}} Enter the {{provider}} API key
  generated for use by JupiterOne.

4. Click **Create Configuration** after you have entered all the values.

## How to Uninstall

TODO: List specific actions that must be taken to uninstall the integration.
Many of the following steps will be reusable; take care to be sure they remain
accurate.

1. From the top navigation of the J1 Search homepage, select **Integrations**.
2. Scroll down to **{{provider}}** and click it.
3. Identify and click the **integration to delete**.
4. Click the trash can icon.
5. Click **Remove** to delete the integration.

<!-- {J1_DOCUMENTATION_MARKER_START} -->
<!--
********************************************************************************
NOTE: ALL OF THE FOLLOWING DOCUMENTATION IS GENERATED USING THE
"j1-integration document" COMMAND. DO NOT EDIT BY HAND! PLEASE SEE THE DEVELOPER
DOCUMENTATION FOR USAGE INFORMATION:

https://github.com/JupiterOne/sdk/blob/main/docs/integrations/development.md
********************************************************************************
-->

## Data Model

### Entities

The following entities are created:

| Resources                  | Entity `_type`                 | Entity `_class` |
| -------------------------- | ------------------------------ | --------------- |
| Account                    | `rapid7_insight_account`       | `Account`       |
| Insight VM Site            | `insightvm_site`               | `Site`          |
| InsightAppSec App          | `insight_app_sec_app`          | `Application`   |
| InsightAppSec Engine       | `insight_app_sec_engine`       | `Scanner`       |
| InsightAppSec Engine Group | `insight_app_sec_engine_group` | `Group`         |
| InsightAppSec Finding      | `insight_app_sec_finding`      | `Finding`       |
| InsightAppSec Scan         | `insight_app_sec_scan`         | `Assessment`    |
| InsightAppSec Scan Config  | `insight_app_sec_scan_config`  | `Configuration` |
| Product                    | `rapid7_insight_product`       | `Product`       |

### Relationships

The following relationships are created:

| Source Entity `_type`          | Relationship `_class` | Target Entity `_type`          |
| ------------------------------ | --------------------- | ------------------------------ |
| `insight_app_sec_app`          | **HAS**               | `insight_app_sec_finding`      |
| `insight_app_sec_engine_group` | **HAS**               | `insight_app_sec_engine`       |
| `insight_app_sec_engine_group` | **USES**              | `insight_app_sec_scan_config`  |
| `insight_app_sec_scan_config`  | **PERFORMED**         | `insight_app_sec_scan`         |
| `insight_app_sec_scan`         | **PROTECTS**          | `insight_app_sec_app`          |
| `rapid7_insight_account`       | **HAS**               | `rapid7_insight_product`       |
| `rapid7_insight_product`       | **HAS**               | `insight_app_sec_engine_group` |
| `rapid7_insight_product`       | **HAS**               | `insightvm_site`               |

<!--
********************************************************************************
END OF GENERATED DOCUMENTATION AFTER BELOW MARKER
********************************************************************************
-->
<!-- {J1_DOCUMENTATION_MARKER_END} -->
