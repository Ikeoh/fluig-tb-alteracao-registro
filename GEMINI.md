# Project Overview

This is a Fluig workflow project for handling employee registration changes. It consists of a Fluig form, several datasets, and workflow control scripts.

## Main Technologies

*   **Fluig:** The core platform for the workflow and forms.
*   **JavaScript:** Used for client-side logic in the form and for creating datasets.
*   **HTML/CSS:** Used for the structure and styling of the form.
*   **JDBC:** Used by the datasets to connect to an external database.

## Architecture

The project follows a standard Fluig architecture:

*   **forms:** Contains the HTML, CSS, and JavaScript files for the "Alteração de Registro" form.
*   **datasets:** Contains JavaScript files that define Fluig datasets. These datasets query a database via JDBC to populate the form's zoom fields and provide data for validations.
*   **workflow:** (Not present in the provided file list, but implied by the form's structure and scripts) The workflow definition that controls the flow of the process, including approval steps.

# Building and Running

This project is intended to be deployed on a Fluig server. There are no local build or run commands.

1.  **Deploy Datasets:** The JavaScript files in the `datasets` directory should be uploaded to the Fluig server as new datasets.
2.  **Deploy Form:** The files in the `forms/Alteração de Registro` directory should be uploaded to the Fluig server as a new form.
3.  **Create Workflow:** A new workflow process should be created in Fluig, using the deployed form and datasets. The workflow should be designed to follow the approval steps defined in the form (e.g., "Verificação RH", "Aprovação Planejamento e Controle Orçamentário", etc.).

# Development Conventions

*   **Dataset Naming:** Datasets are named with a `ds_` prefix, followed by a descriptive name (e.g., `ds_gtb_jdbc_016_alteracao_salarial`).
*   **Form Fields:** Form fields are named using camelCase (e.g., `requesterName`).
*   **JavaScript:** The JavaScript code uses jQuery and the Fluig JavaScript API.
*   **Code Style:** The code is not formatted with a consistent style. Consider using a tool like Prettier to format the code.
