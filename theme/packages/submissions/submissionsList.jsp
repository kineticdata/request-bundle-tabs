<%-- Set the page content type, ensuring that UTF-8 is used. --%>
<%@page contentType="text/html; charset=UTF-8"%>

<%-- Include the package initialization file. --%>
<%@include file="framework/includes/packageInitialization.jspf"%>

<%-- Retrieve the Catalog --%>
<%
    // Retrieve the main catalog object
    Catalog catalog = Catalog.findByName(context, customerRequest.getCatalogName());
    // Preload the catalog child objects (such as Categories, Templates, etc) so
    // that they are available.  Preloading all of the related objects at once
    // is more efficient than loading them individually.
    catalog.preload(context);

    String submissionType = request.getParameter("type");
    // Determine if the type exists and is set and is a real type
    if(submissionType == null || !submissionType.equals("requests") && !submissionType.equals("approvals")) {
        submissionType = "requests";
    }
%>
<!DOCTYPE html>
<html>
    <head>
        <%-- Include the common content. --%>
        <%@include file="../../common/interface/fragments/head.jspf"%>
        <title>
            <%= bundle.getProperty("companyName")%>&nbsp;|
            <% if(submissionType.equals("requests")) {%>
                My&nbsp;Requests&nbsp;(<%= totalRequests%>)
            <% } else if(submissionType.equals("approvals")) {%>
                My&nbsp;Approvals&nbsp;(<%= totalApprovals%>)
            <%}%>
        </title>

        <!-- Page Stylesheets -->
        <link rel="stylesheet" href="<%= bundle.packagePath()%>resources/css/jquery.qtip.css" type="text/css" />
        <link rel="stylesheet" href="<%= bundle.packagePath()%>resources/css/package.css" type="text/css" />
        <link rel="stylesheet" href="<%= bundle.packagePath()%>resources/css/submissionsList.css" type="text/css" />
        <!-- Page Javascript -->
        <script type="text/javascript" src="<%=bundle.packagePath()%>resources/js/moment.min.js"></script>
        <script type="text/javascript" src="<%=bundle.packagePath()%>resources/js/jquery.consoleList.js"></script>
        <script type="text/javascript" src="<%=bundle.packagePath()%>resources/js/package.js"></script>
        <script type="text/javascript" src="<%=bundle.packagePath()%>resources/js/submissionsList.js"></script>
    </head>
    <body>
        <div class="view-port">
            <%@include file="../../common/interface/fragments/navigationSlide.jspf"%>
            <div class="content-slide" data-target="div.navigation-slide">
                <%@include file="../../common/interface/fragments/header.jspf"%>
                <div class="pointer-events">
                    <%-- SUBMISSION TABLE LINKS --%>
                    <% if (context != null) { %>
                        <header class="sub">
                            <div class="container">
                                <ul class="unstyled">
                                    <% if(submissionType.equals("requests")) {%>
                                        <% for (String groupName : submissionGroups.keySet()) { %>
                                            <% if(requestsFilter.contains(groupName)) {%>
                                                <%-- Count the number of submissions that match the current query --%>
                                                <% Integer count = ArsBase.count(context, "KS_SRV_CustomerSurvey", submissionGroups.get(groupName)); %>
                                                <li class="">
                                                    <a data-group-name="<%=groupName%>" href="<%= bundle.getProperty("submissionsUrl")%>&type=requests&status=<%=groupName%>">
                                                        <%=count%>&nbsp;
                                                        <% if (count != 1) { %>
                                                            <%=groupName%>s
                                                        <% } else {%>
                                                            <%=groupName%>
                                                        <% }%>
                                                    </a>
                                                </li>
                                            <%}%>
                                        <% }%>
                                    <% } else if(submissionType.equals("approvals")) {%>
                                        <% for (String groupName : submissionGroups.keySet()) { %>
                                            <% if(approvalsFilter.contains(groupName)) {%>
                                                <%-- Count the number of submissions that match the current query --%>
                                                <% Integer count = ArsBase.count(context, "KS_SRV_CustomerSurvey", submissionGroups.get(groupName)); %>
                                                <li class="">
                                                    <a data-group-name="<%=groupName%>" href="<%= bundle.getProperty("submissionsUrl")%>&type=approvals&status=<%=groupName%>">
                                                        <%=count%>&nbsp;
                                                        <% if (count != 1) { %>
                                                            <%=groupName%>s
                                                        <% } else {%>
                                                            <%=groupName%>
                                                        <% }%>
                                                    </a>
                                                </li>
                                            <%}%>
                                        <% }%>
                                    <%}%>
                                </ul>
                            </div>
                        </header>
                    <% }%>
                    <section class="container">  
                        <%-- SUBMISSIONS VIEW --%>
                        <div class="results hide">
                        </div>
                        <div class="results-message hide"></div>
                        <%-- LOADER --%>
                        <div id="loader">
                            <img alt="Please Wait." src="<%=bundle.bundlePath()%>common/resources/images/spinner.gif" />
                            <br />
                            Loading Results
                        </div>
                    </section>
                </div>
                <%@include file="../../common/interface/fragments/footer.jspf"%>
            </div>
        </div>
    </body>
</html>
