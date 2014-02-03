<%-- Set the page content type, ensuring that UTF-8 is used. --%>
<%@page contentType="text/html; charset=UTF-8"%>

<%-- Include the package initialization file. --%>
<%@include file="framework/includes/packageInitialization.jspf"%>

<!DOCTYPE html>
<html>
    <head>
        <%-- Include the bundle common content. --%>
        <%@include file="../../common/interface/fragments/head.jspf"%>
        
        <title><%= customerRequest.getTemplateName()%></title>
        <%-- Include the application head content. --%>
        <%@include file="../../core/interface/fragments/applicationHeadContent.jspf" %>

        <!-- Page Stylesheets -->
        <link rel="stylesheet" href="<%= bundle.packagePath()%>resources/css/login.css" type="text/css" />
    </head>
    <body>
        <div class="view-port">
            <%@include file="../../common/interface/fragments/navigationSlide.jspf"%>
            <div class="content-slide" data-target="div.navigation-slide">
                <%@include file="../../common/interface/fragments/header.jspf"%>
                <div class="pointer-events">
                    <section class="container">
                        <!-- Render the Login Box -->
                        <div class="center-container-large">
                            <!-- Login Box Header -->
                            <div class="pageHeader">
                                <h3>Please Log In</h3>
                            </div>
                            <!-- Logging In Spinner -->
                            <div class="hidden" id="loader">
                                <img style="margin: 0px 0px 10px 0px; height: 24px; width: 24px;" alt="Please Wait." src="<%=bundle.bundlePath()%>common/resources/images/spinner.gif" />
                                <br />
                                Authenticating
                            </div>
                            <!-- Login Form -->
                            <form id="loginForm" class="well" name="Login" method="post" action="KSAuthenticationServlet">
                                <!-- User Name -->
                                <p>
                                    <label class="hide" for="UserName">Username</label>
                                    <input id="UserName" class="form-control" name="UserName" type="text" autocomplete="off" placeholder="Username" />
                                </p>
                                <!-- Password -->
                                <p>
                                    <label class="hide" for="Password">Password</label>
                                    <input id="Password" class="form-control" name="Password" type="password" autocomplete="off" placeholder="Password" />
                                </p>
                                <!-- Error Message -->
                                <% if (!("".equals(customerRequest.getErrorMessage()) || customerRequest.getErrorMessage() == null)) { %>   
                                    <div class="message alert alert-danger">
                                        <a class="close" data-dismiss="alert">x</a>
                                            <%= customerRequest.getErrorMessage() %>
                                            <% customerRequest.clearErrorMessage(); %>
                                    </div>
                                <% }%>
                                <!-- Options -->
                                <!-- Log In Button -->
                                <input id="loginSubmit" class="btn btn-primary btn-sm stretch" type="submit" value="Log In" />
                                <% if (bundle.getProperty("forgotPasswordAction") != null) {%>
                                    <!-- Forgot Password -->
                                    <a href="<%= bundle.getProperty("forgotPasswordAction")%>">Forgot Password</a>
                                <% }%>
                            </form>
                        </div>
                    </section>
                </div>
                <%@include file="../../common/interface/fragments/footer.jspf"%>
            </div>
        </div>
    </body>
</html>