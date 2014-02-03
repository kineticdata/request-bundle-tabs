<%-- Set the page content type, ensuring that UTF-8 is used. --%>
<%@page contentType="text/html; charset=UTF-8"%>
<%-- Include the package initialization file. --%>
<%@include file="framework/includes/packageInitialization.jspf"%>

<%-- Retrieve the Catalog --%>
<%
    // Retrieve the main catalog object
    Catalog catalog = Catalog.findByName(context, customerRequest.getCatalogName());
    // Preload the catalog child objects (such as Categories, Templates, etc)
    catalog.preload(context);
    // Get category
    Category currentCategory = catalog.getCategoryByName(request.getParameter("category"));
    // Get map of description templates
    Map<String, String> templateDescriptions = DescriptionHelper.getTemplateDescriptionMap(context, catalog);
    Map<String, String> categoryDescriptions = DescriptionHelper.getCategoryDescriptionMap(context, catalog);
    // Get popular requests
    HelperContext systemContext = com.kd.kineticSurvey.impl.RemedyHandler.getDefaultHelperContext();
    List<String> globalTopTemplates = SubmissionStatisticsHelper.getMostCommonTemplateNames(systemContext, new String[] {customerRequest.getCatalogName()}, templateTypeFilterTopSubmissions, 5);
%>
<!DOCTYPE html>
<html>
    <head>
        <%-- Include the common content. --%>
        <%@include file="../../common/interface/fragments/head.jspf"%>
        <title>
            <%= bundle.getProperty("companyName")%>&nbsp;Catalog
        </title>
        <!-- Page Stylesheets -->
        <link rel="stylesheet" href="<%= bundle.packagePath()%>resources/css/package.css" type="text/css" />
        <link rel="stylesheet" href="<%= bundle.packagePath()%>resources/css/catalog.css" type="text/css" />
        <!-- Page Javascript -->
        <script type="text/javascript" src="<%=bundle.packagePath()%>resources/js/package.js"></script>
        <script type="text/javascript" src="<%=bundle.packagePath()%>resources/js/catalog.js"></script>
    </head>
    <body>
        <div class="view-port">
            <%@include file="../../common/interface/fragments/navigationSlide.jspf"%>
            <div class="content-slide" data-target="div.navigation-slide">
                <%@include file="../../common/interface/fragments/header.jspf"%>
                <div class="pointer-events">
                    <header class="sub">
                        <div class="container">
                            <div class="breadcrumbs clearfix">
                                <ul class="unstyled">
                                    <li data-id="home">
                                        <a href="javascript:void(0)">    
                                            Home
                                        </a>
                                        &nbsp;/&nbsp;
                                    </li>
                                    <li data-id="root">
                                        <a href="javascript:void(0)">    
                                            Catalog
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <form class="user-search" method="get" action="<%= bundle.applicationPath()%>DisplayPage">
                                <input type="hidden" name="name" value="<%= bundle.getProperty("searchNameParam") %>" />
                                <p>
                                    <label class="hide" for="search">Search Catalog</label>
                                    <input id="search" class="form-control" type="search" name="q" value="<% if(request.getParameter("q") != null && !request.getParameter("q").equals("")) {%> <%= request.getParameter("q") %> <% }%>" autofocus="autofocus" placeholder="Search Catalog" />
                                    <span>
                                        <button class="btn btn-primary fa fa-search fa-flip-horizontal" type="submit"></button>
                                    <span>
                                </p>
                            </form>
                        </div>
                    </header>
                    <section class="container">
                        <nav class="catalog">
                            <%-- BREADCRUMBS NAV --%>
                            <ul class="breadcrumbs unstyled">
                                <li data-id="root">
                                    Categories
                                </li>
                            </ul>
                            <div class="col-sm-4">
                                <%-- TEMPLATES NAV --%>
                                <ul class="templates unstyled">
                                </ul>
                                <div class="nav-divider border-bottom"></div>
                                <%-- CATAGORIES NAV --%>
                                <ul class="categories unstyled">
                                </ul>
                            </div>
                            <%-- LOADER --%>
                            <div id="loader" class="hide">
                                <img alt="Please Wait." src="<%=bundle.bundlePath()%>common/resources/images/spinner.gif" />
                                <br />
                                Loading Results
                            </div>
                            <%-- TEMPLATE DETAILS --%>
                            <div class="template-details col-sm-8 hide">
                            </div>
                            <div class="service-item-content col-sm-8">
                                <%@include file="../../core/interface/fragments/displayBodyContent.jspf"%>
                            </div>
                        </nav>
                    </section>
                </div>
                <%@include file="../../common/interface/fragments/footer.jspf"%>
            </div>
        </div>
        <!-- Data used for jQuery manipulation -->
        <%-- ROOT CATEGORIES DATA --%>
        <ul class="root-category-data hide">
            <% for (Category category : catalog.getRootCategories(context)) { %>
                <% if (category.hasTemplates()) { %>
                    <li data-id="<%= category.getId()%>" data-name="<%= category.getName()%>" data-description="<%= category.getDescription()%>" data-description-id="<%= categoryDescriptions.get(category.getId()) %>">
                        <a href="javascript:void(0)">
                            <%= category.getName()%>
                        </a>
                        <!-- <i class="fa fa-chevron-circle-right"></i> -->
                    </li>
                <% } %>
            <% }%>
        </ul>
        <%-- CATEGORY DATA --%>
        <ul class="category-data hide">
            <% for (Category category : catalog.getAllCategories(context)) {%>
                <% if (category.hasTemplates()) { %>
                    <li class="" data-id="<%= category.getId()%>" data-name="<%= category.getName()%>" data-description="<%= category.getDescription()%>" data-description-id="<%= categoryDescriptions.get(category.getId()) %>">
                        <%= category.getName()%>
                        <!-- <i class="fa fa-chevron-circle-right"></i> -->
                        <%-- SUBCATEGORIES DATA --%>
                        <% if (category.hasNonEmptySubcategories()) {%>
                            <ul class="subcategory-data">
                                <% for (Category subcategory : category.getSubcategories()) { %>
                                    <% if (subcategory.hasTemplates()) { %>
                                        <li data-id="<%= subcategory.getId()%>" data-name="<%= subcategory.getName()%>" data-description="<%= subcategory.getDescription()%>">
                                            <a href="javascript:void(0)">
                                                <%= subcategory.getName()%>
                                            </a>
                                            <!-- <i class="fa fa-chevron-circle-right"></i> -->
                                        </li>
                                    <% }%>
                                <% }%>
                            </ul>
                        <% }%>
                        <%-- TEMPLATES DATA --%>
                        <% if (category.hasTemplates()) {%>
                            <ul class="template-data">
                                <% for (Template template : category.getTemplates()) {%>
                                    <li data-id="<%= template.getId()%>" data-name="<%= template.getName()%>">
                                        <a href="javascript:void(0)">
                                            <%= template.getName()%>
                                        </a>
                                        <div class="template-details-data hide">
                                            <% if (template.hasTemplateAttribute("ServiceItemImage")) { %>
                                                <div class="image">
                                                    <img width="40" src="<%= ServiceItemImageHelper.buildImageSource(template.getTemplateAttributeValue("ServiceItemImage"), bundle.getProperty("serviceItemImagePath"))%>" />
                                                </div>
                                            <% }%>
                                            <p>
                                                <%= template.getDescription()%> 
                                            </p>
                                            <% if (templateDescriptions.get(template.getId()) != null) { %>
                                                <a class="read-more" href="<%= bundle.applicationPath()%>DisplayPage?srv=<%= templateDescriptions.get(template.getId()) %>">
                                                    Read More
                                                </a>
                                            <% }%>
                                            <a class="templateButton" href="<%= template.getAnonymousUrl() %>">
                                                <i class="fa fa-share"></i>
                                                Request
                                            </a>
                                        </div>
                                    </li>
                                <% }%>
                            </ul>
                        <% }%>
                    </li>
                <% }%>
            <% }%>
        </ul>
    </body>
</html>