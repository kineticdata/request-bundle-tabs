<%-- Set the page content type, ensuring that UTF-8 is used. --%>
<%@page contentType="text/html; charset=UTF-8"%>

<%-- Include the package initialization file for preparing a review page. --%>
<%@include file="framework/includes/reviewRequestInitialization.jspf"%>

<%-- Include the package initialization file. --%>
<%@include file="framework/includes/packageInitialization.jspf"%>
<!DOCTYPE html>
<html>
    <head>
        <%-- Include the bundle common content. --%>
        <%@include file="../../common/interface/fragments/head.jspf"%>
        <%-- Include the application head content. --%>
        <%@include file="../../core/interface/fragments/applicationHeadContent.jspf" %>
        <%@include file="../../core/interface/fragments/reviewHeadContent.jspf"%>

        <!-- Common js lib -->
        <script type="text/javascript" src="<%=bundle.bundlePath()%>common/resources/js/flyout.js"></script>
        <!-- Package Stylesheets -->
        <link rel="stylesheet" href="<%= bundle.packagePath()%>resources/css/displayPackage.css" type="text/css" />
        <link rel="stylesheet" href="<%= bundle.packagePath()%>resources/css/reviewPackage.css" type="text/css" />
        <!-- Page Stylesheets -->
        <link rel="stylesheet" href="<%= bundle.packagePath()%>resources/css/reviewFrame.css" type="text/css" />
        <!-- Page Javascript -->
        <script type="text/javascript" src="<%=bundle.packagePath()%>resources/js/review.js"></script>

        <%-- Include the form head content, including attached css/javascript files and custom header content --%>
        <%@include file="../../core/interface/fragments/formHeadContent.jspf"%>
    </head>
    <body class="loadAllPages_<%=customerSurveyReview.getLoadAllPages()%> reviewFrame">
        <section class="container">
            <%@include file="../../core/interface/fragments/reviewBodyContent.jspf"%>
        </section>
        <!-- Start Temp Requester Information -->
        <div id="temp-requester-info">
            <div class="request-for">
                <h4>
                    This request is for:
                </h4>
                <div class="contact border-left">
                    <div id="request-for-name"></div>
                    <div id="request-for-site"></div>
                    <div id="request-for-email"></div>
                    <div id="request-for-phone"></div>
                </div>
            </div>
            <div class="approver">
                <h4>
                    Approver:
                </h4>
                <div class="contact border-left">
                    <div id="approver-name"></div>
                    <div id="approver-site"></div>
                    <div id="approver-email"></div>
                    <div id="approver-phone"></div>
                </div>
            </div>
        </div>
        <!-- End Temp Requester Information -->
    </body>
</html>