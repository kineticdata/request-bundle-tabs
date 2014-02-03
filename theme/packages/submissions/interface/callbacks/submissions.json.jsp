<%@page contentType="application/json; charset=UTF-8"%>
<%@include file="../../framework/includes/packageInitialization.jspf"%>
<%
    if (context == null) {
        ResponseHelper.sendUnauthorizedResponse(response);
    } else {
        // Retrieve the main catalog object
        Catalog catalog = Catalog.findByName(context, bundle.getProperty("catalogName"));
        catalog.preload(context);

        /*
         * Here we are pulling the parameters for the ars helpers call from the request
         * object and processing a few of them as necessary.
         * 
         * Retrieve the form and qualification parameters.  These are simply passed
         * as Strings and no further processing is needed.
         */
        String qualification = submissionGroups.get(request.getParameter("qualification"));
        if (qualification == null) {
            throw new Exception("The specified submission qualification ("+
                request.getParameter("qualification")+") does not match any pre-defined "+
                "submission qualifications.");
        }

        /*
         * Retrieve the pageSize and pageNumber parameters.  These need to be converted
         * from Strings to ints.  Also we must use the pageSize and pageNumber values
         * to calculate the proper offset.
         */
        int pageSize = Integer.parseInt(request.getParameter("limit"));
        int pageOffset = Integer.parseInt(request.getParameter("offset"));

        /*
         * orderField.  Currently only sorting for one field
         */
        String sortOrderField = SubmissionConsole.getSortFieldId(request.getParameter("orderField"));
        String[] sortFieldIds = new String[]{sortOrderField};
       
        /*
         * Retrieve the sortOrder parameter.  This is passed as either "ascending" or
         * "descending".  Ars helpers expects a value of 1 for ascending sort order
         * and a value of 2 for a descending sort order.
         */
        int sortOrder = request.getParameter("order").equals("DESC") ? 2 : 1;

        /*
         * Here we are preparing to make the ars helpers call.
         * 
         * Here we verify that the context variable is not null, otherwise we cannot
         * continue with this operation
         */
        if (context == null) {
            throw new IllegalArgumentException("The \"context\" argument can't be null.");
        }

        /*
         * Retrieve the entries with the parameters gathered above.  Also retrieve a
         * count of the total number of entries that match the qualification.
         */
        SubmissionConsole[] submissions = SubmissionConsole.find(context, catalog, qualification, sortFieldIds, pageSize, pageOffset, sortOrder);
        int count = ArsBase.count(context, SubmissionConsole.FORM_NAME, qualification);

        out.println("{");
        out.println("\"count\" : " + count + ",");
        out.println("\"limit\" : " + pageSize + ",");
        out.println("\"offset\" : " + pageOffset + ",");
        out.println("\"data\" : [");
        for (int i = 0; i < submissions.length; i++) {
            if (i != 0) {
                out.println(",");
            }
            // Output json results
            out.print(submissions[i].toJson());
        }
        out.println("]");
        out.println("}");
    }
%>