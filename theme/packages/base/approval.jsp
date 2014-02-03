<%-- Set the page content type, ensuring that UTF-8 is used. --%>
<%@page contentType="text/html; charset=UTF-8"%>

<%-- Include the package initialization file. --%>
<%@include file="framework/includes/packageInitialization.jspf"%>
<%
    // Retrieve the main catalog object
    Catalog catalog = Catalog.findByName(context, customerRequest.getCatalogName());
    // Preload the catalog child objects (such as Categories, Templates, etc) so
    // that they are available.  Preloading all of the related objects at once
    // is more efficient than loading them individually.
    catalog.preload(context);
%>
<!DOCTYPE html>
<html>
    <head>
        <%-- 
            Specify that modern IE versions should render the page with their own 
            rendering engine (as opposed to falling back to compatibility mode.
            NOTE: THIS HAS TO BE RIGHT AFTER <head>!
        --%>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charset="utf-8">
        <title>
            <%= bundle.getProperty("companyName")%>
            |
            <%= customerRequest.getTemplateName()%>
        </title>
        <%-- Include the application head content. --%>
        <%@include file="../../core/interface/fragments/applicationHeadContent.jspf"%>
        <%@include file="../../core/interface/fragments/displayHeadContent.jspf"%>

        <%-- Include the bundle common content. --%>
        <%@include file="../../common/interface/fragments/head.jspf"%>
        <!-- Common js lib -->
        <script type="text/javascript" src="<%=bundle.bundlePath()%>common/resources/js/flyout.js"></script>
        <!-- Package Stylesheets -->
        <link rel="stylesheet" href="<%= bundle.packagePath()%>resources/css/displayPackage.css" type="text/css" />
        <!-- Package Javascript -->
        <script type="text/javascript" src="<%=bundle.packagePath()%>resources/js/package.js"></script>
        <%-- Include the form head content, including attached css/javascript files and custom header content --%>
        <%@include file="../../core/interface/fragments/formHeadContent.jspf"%>
    </head>
    <body>
        <%@include file="../../common/interface/fragments/header.jspf"%>
        <header class="container">
            <h2>
                <%= customerRequest.getTemplateName()%>
            </h2>
            <hr class="soften">
        </header>
        <section class="container">
            <%@include file="../../core/interface/fragments/displayBodyContent.jspf"%>
        </section>
        <%@include file="../../common/interface/fragments/footer.jspf"%>
    </body>
</html>